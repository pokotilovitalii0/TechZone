import React, { useState, useMemo, useEffect } from 'react';
import { Filter, ChevronDown, Star, ShoppingCart, Heart, Search, X, LayoutGrid, Grid2X2, Grid3X3, CheckCircle, Trash2, Box, Loader2 } from 'lucide-react';
import { Link, useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAtomValue, useSetAtom } from 'jotai';
import { addToCartAtom } from '../../store/cartAtoms';
import { wishlistAtom, toggleWishlistAtom } from '../../store/wishlistAtoms';

// --- ТИПИ ДАНИХ (Відповідають базі даних) ---
interface Product {
	id: number;
	name: string;
	slug: string;
	price: number;
	oldPrice?: number | null;
	category: string;
	image: string;
	description: string;
	rating: number;
	reviews: number;
	inStock: boolean;
	colors?: any; // JSON з бази
	specs?: any;
	createdAt?: string;
	// Обчислювані поля (додамо їх динамічно)
	isNew?: boolean;
	isSale?: boolean;
}

const CATEGORIES = ['Всі', 'Клавіатури', 'Мишки', 'Навушники', 'Аксесуари'];

const CATEGORY_SLUGS: Record<string, string> = {
	'mice': 'Мишки',
	'keyboards': 'Клавіатури',
	'audio': 'Навушники',
	'accessories': 'Аксесуари'
};

const CatalogPage = () => {
	// --- HOOKS ---
	const { categorySlug } = useParams();
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();

	// Jotai Atoms
	const addToCart = useSetAtom(addToCartAtom);
	const toggleWishlist = useSetAtom(toggleWishlistAtom);
	const wishlistItems = useAtomValue(wishlistAtom);

	// --- СТАНИ ---
	const [products, setProducts] = useState<Product[]>([]); // Дані з сервера
	const [isLoading, setIsLoading] = useState(true);        // Стан завантаження
	const [error, setError] = useState<string | null>(null); // Стан помилки

	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [priceRange, setPriceRange] = useState({ min: 0, max: 20000 }); // Збільшив ліміт до 20к

	// Ініціалізуємо пошук значенням з URL
	const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

	const [sortOption, setSortOption] = useState('popular');
	const [gridCols, setGridCols] = useState<2 | 3 | 4 | 5>(4);
	const [toast, setToast] = useState<{ message: string, type: 'success' | 'info' } | null>(null);

	// --- ЗАВАНТАЖЕННЯ ДАНИХ (FETCH) ---
	useEffect(() => {
		const fetchProducts = async () => {
			setIsLoading(true);
			try {
				const response = await fetch('http://localhost:5000/api/products');
				if (!response.ok) throw new Error('Failed to fetch');
				const data = await response.json();

				// Додаємо логіку для isSale та isNew, яких немає в прямій структурі БД, але потрібні для UI
				const processedData = data.map((item: Product) => ({
					...item,
					isSale: item.oldPrice ? item.oldPrice > item.price : false,
					isNew: new Date(item.createdAt || '').getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000 // Новинка якщо < 30 днів
				}));

				setProducts(processedData);
			} catch (err) {
				console.error(err);
				setError('Не вдалося завантажити товари. Перевірте сервер.');
			} finally {
				setIsLoading(false);
			}
		};

		fetchProducts();
	}, []);

	// --- ЕФЕКТИ СИНХРОНІЗАЦІЇ ---

	// 1. Синхронізація категорії з URL
	useEffect(() => {
		if (categorySlug && CATEGORY_SLUGS[categorySlug]) {
			setSelectedCategories([CATEGORY_SLUGS[categorySlug]]);
		} else {
			setSelectedCategories([]);
		}
	}, [categorySlug]);

	// 2. Синхронізація пошуку з URL
	useEffect(() => {
		const queryFromUrl = searchParams.get('q');
		if (queryFromUrl !== searchQuery) {
			setSearchQuery(queryFromUrl || '');
		}
	}, [searchParams]);

	// 3. Оновлення URL при зміні пошуку
	useEffect(() => {
		const params = new URLSearchParams(searchParams);
		if (searchQuery) {
			params.set('q', searchQuery);
		} else {
			params.delete('q');
		}
		setSearchParams(params, { replace: true });
	}, [searchQuery]);


	// --- ЛОГІКА UI ---
	const showToast = (message: string, type: 'success' | 'info' = 'success') => {
		setToast({ message, type });
		setTimeout(() => setToast(null), 3000);
	};

	const toggleCategory = (category: string) => {
		if (category === 'Всі') {
			navigate('/catalog');
			return;
		}

		const slug = Object.keys(CATEGORY_SLUGS).find(key => CATEGORY_SLUGS[key] === category);

		if (selectedCategories.includes(category)) {
			navigate('/catalog'); // Скидання категорії
		} else {
			if (slug) {
				navigate(`/catalog/${slug}`);
			} else {
				setSelectedCategories([category]);
			}
		}
	};

	const isCategorySelected = (category: string) => {
		if (category === 'Всі') return selectedCategories.length === 0;
		return selectedCategories.includes(category);
	};

	// Wishlist Logic
	const isInWishlist = (id: number) => wishlistItems.some(item => item.id === id);

	const handleToggleWishlist = (e: React.MouseEvent, product: Product) => {
		e.preventDefault(); // Запобігаємо переходу по посиланню
		e.stopPropagation();

		toggleWishlist({
			id: product.id,
			name: product.name,
			price: product.price,
			oldPrice: product.oldPrice,
			image: product.image,
			inStock: product.inStock,
			category: product.category
		});

		if (!isInWishlist(product.id)) {
			showToast('Додано до списку бажань', 'info');
		} else {
			showToast('Видалено зі списку бажань', 'info');
		}
	};

	// Cart Logic
	const handleAddToCart = (e: React.MouseEvent, product: Product) => {
		e.preventDefault();
		e.stopPropagation();

		// Отримуємо перший колір безпечно (бо структура JSON може бути різною)
		let selectedColor = 'Default';
		if (Array.isArray(product.colors) && product.colors.length > 0) {
			selectedColor = product.colors[0].name || product.colors[0].hex || 'Default';
		}

		addToCart({
			id: product.id,
			name: product.name,
			price: product.price,
			image: product.image,
			quantity: 1,
			selectedColor: selectedColor
		});
		showToast(`"${product.name}" додано в кошик!`);
	};

	// Price Slider Handlers
	const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = Math.min(Number(e.target.value), priceRange.max - 500);
		setPriceRange({ ...priceRange, min: value });
	};

	const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = Math.max(Number(e.target.value), priceRange.min + 500);
		setPriceRange({ ...priceRange, max: value });
	};

	const minPercent = (priceRange.min / 20000) * 100;
	const maxPercent = (priceRange.max / 20000) * 100;

	// --- ФІЛЬТРАЦІЯ ---
	const filteredProducts = useMemo(() => {
		let result = [...products]; // Працюємо з копією масиву з сервера

		if (selectedCategories.length > 0) {
			result = result.filter(p => selectedCategories.includes(p.category));
		}

		result = result.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);

		if (searchQuery) {
			result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
		}

		if (sortOption === 'priceAsc') {
			result.sort((a, b) => a.price - b.price);
		} else if (sortOption === 'priceDesc') {
			result.sort((a, b) => b.price - a.price);
		} else if (sortOption === 'rating') {
			result.sort((a, b) => b.rating - a.rating);
		}

		return result;
	}, [products, selectedCategories, priceRange, searchQuery, sortOption]);

	const isFiltersActive = selectedCategories.length > 0 || priceRange.min > 0 || priceRange.max < 20000 || searchQuery !== '';

	return (
		<div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20 relative">

			{/* --- TOAST --- */}
			{toast && (
				<div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
					<div className="bg-slate-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700">
						<div className="bg-green-500 rounded-full p-1">
							<CheckCircle size={16} className="text-white" />
						</div>
						<span className="font-medium">{toast.message}</span>
					</div>
				</div>
			)}

			{/* --- HEADER --- */}
			<div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm/50">
				<div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
						<div>
							<h1 className="text-2xl font-black text-slate-900 tracking-tight">
								{categorySlug ? CATEGORY_SLUGS[categorySlug] || 'Каталог' : 'Каталог'}
							</h1>
							<div className="text-sm text-slate-500 mt-1">
								Головна / <span className="text-sky-500 font-medium">
									{selectedCategories.length > 0 ? selectedCategories.join(', ') : 'Всі товари'}
								</span>
							</div>
						</div>

						{/* Local Search Input */}
						<div className="relative w-full md:w-96 group">
							<input
								type="text"
								placeholder="Пошук девайсів..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full pl-11 pr-4 py-2.5 bg-slate-100 border-transparent border focus:bg-white focus:border-sky-500 rounded-xl transition-all outline-none text-sm font-medium group-hover:bg-white group-hover:border-slate-300 text-slate-900"
							/>
							<Search className="absolute left-3.5 top-3 text-slate-400 group-hover:text-sky-500 transition-colors" size={18} />
						</div>
					</div>
				</div>
			</div>

			<div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

				{/* --- FILTERS BAR --- */}
				<div className="flex flex-col gap-6 mb-8">

					{/* Categories */}
					<div className="flex items-center overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
						<div className="flex gap-2">
							{CATEGORIES.map(cat => {
								const active = isCategorySelected(cat);
								return (
									<button
										key={cat}
										onClick={() => toggleCategory(cat)}
										className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${active
											? 'bg-sky-500 border-sky-500 text-white shadow-lg shadow-sky-500/30 scale-105'
											: 'bg-white border-slate-200 text-slate-600 hover:border-sky-300 hover:text-sky-600 hover:bg-slate-50'
											}`}
									>
										{cat}
									</button>
								);
							})}
						</div>
					</div>

					{/* Tools Row */}
					<div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">

						{/* Price Range */}
						<div className="flex flex-col sm:flex-row sm:items-center gap-6">
							<div className="flex items-center gap-3">
								<span className="font-bold text-slate-900 flex items-center gap-2">
									<Filter size={18} className="text-sky-500" /> Ціна:
								</span>
								<div className="flex items-center gap-2">
									<div className="relative">
										<span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₴</span>
										<input
											type="number"
											value={priceRange.min}
											onChange={(e) => setPriceRange({ ...priceRange, min: Math.min(Number(e.target.value), priceRange.max - 100) })}
											className="w-20 pl-6 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-sky-500 outline-none text-slate-900"
										/>
									</div>
									<span className="text-slate-300 font-bold">-</span>
									<div className="relative">
										<span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₴</span>
										<input
											type="number"
											value={priceRange.max}
											onChange={(e) => setPriceRange({ ...priceRange, max: Math.max(Number(e.target.value), priceRange.min + 100) })}
											className="w-20 pl-6 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-sky-500 outline-none text-slate-900"
										/>
									</div>
								</div>
							</div>

							<div className="relative w-full sm:w-48 h-1.5 bg-slate-200 rounded-full my-2 sm:my-0">
								<div
									className="absolute h-full bg-sky-500 rounded-full z-10"
									style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
								></div>
								<input type="range" min="0" max="20000" step="100" value={priceRange.min} onChange={handleMinChange}
									className="absolute w-full h-full appearance-none bg-transparent pointer-events-none z-20 top-0 left-0 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-sky-500 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:mt-[-5px]"
								/>
								<input type="range" min="0" max="20000" step="100" value={priceRange.max} onChange={handleMaxChange}
									className="absolute w-full h-full appearance-none bg-transparent pointer-events-none z-30 top-0 left-0 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-sky-500 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:mt-[-5px]"
								/>
							</div>
						</div>

						{/* Active Filters */}
						{isFiltersActive && (
							<div className="flex flex-wrap items-center gap-2 pl-0 xl:pl-6 xl:border-l xl:border-slate-200">
								{selectedCategories.map(cat => (
									<button
										key={cat}
										onClick={() => toggleCategory(cat)}
										className="bg-sky-50 text-sky-700 border border-sky-100 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-colors"
									>
										{cat} <X size={12} />
									</button>
								))}

								{(priceRange.min > 0 || priceRange.max < 20000) && (
									<button onClick={() => setPriceRange({ min: 0, max: 20000 })} className="bg-sky-50 text-sky-700 border border-sky-100 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-colors">
										{priceRange.min}-{priceRange.max} <X size={12} />
									</button>
								)}
								{searchQuery && (
									<button onClick={() => { setSearchQuery(''); navigate('/catalog'); }} className="bg-sky-50 text-sky-700 border border-sky-100 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-colors">
										"{searchQuery}" <X size={12} />
									</button>
								)}
								<button onClick={() => { navigate('/catalog'); setSearchQuery(''); setPriceRange({ min: 0, max: 20000 }) }} className="text-slate-400 hover:text-red-500 transition-colors p-1">
									<Trash2 size={16} />
								</button>
							</div>
						)}

						{/* Sort & Grid */}
						<div className="flex items-center gap-4 ml-auto pt-4 xl:pt-0 border-t xl:border-t-0 border-slate-100 w-full xl:w-auto justify-end">
							<span className="text-slate-400 text-sm font-medium whitespace-nowrap hidden sm:inline">
								{filteredProducts.length} товарів
							</span>

							<div className="flex items-center gap-2">
								<div className="hidden lg:flex items-center bg-slate-100 rounded-lg p-1">
									<button onClick={() => setGridCols(2)} className={`p-1.5 rounded-md transition-all ${gridCols === 2 ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`} title="2 колонки"><Grid2X2 size={18} /></button>
									<button onClick={() => setGridCols(3)} className={`p-1.5 rounded-md transition-all ${gridCols === 3 ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`} title="3 колонки"><Grid3X3 size={18} /></button>
									<button onClick={() => setGridCols(4)} className={`p-1.5 rounded-md transition-all ${gridCols === 4 ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`} title="4 колонки"><LayoutGrid size={18} /></button>
									<button onClick={() => setGridCols(5)} className={`p-1.5 rounded-md transition-all ${gridCols === 5 ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`} title="5 колонок"><Box size={18} /></button>
								</div>

								<div className="relative group">
									<select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-2 pl-4 pr-10 rounded-lg text-sm font-bold focus:outline-none focus:border-sky-500 cursor-pointer hover:bg-white transition-colors">
										<option value="popular">Популярні</option>
										<option value="priceAsc">Дешеві</option>
										<option value="priceDesc">Дорогі</option>
										<option value="rating">Рейтинг</option>
									</select>
									<ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* --- CONTENT AREA (Loading / Error / Grid) --- */}

				{isLoading ? (
					<div className="flex flex-col items-center justify-center h-96">
						<Loader2 className="w-12 h-12 text-sky-500 animate-spin mb-4" />
						<p className="text-slate-500 font-medium">Отримуємо актуальні ціни...</p>
					</div>
				) : error ? (
					<div className="flex flex-col items-center justify-center h-96 text-center">
						<div className="bg-rose-50 p-4 rounded-full mb-4"><X className="w-8 h-8 text-rose-500" /></div>
						<h3 className="text-xl font-bold text-slate-900 mb-2">Щось пішло не так</h3>
						<p className="text-slate-500 mb-6 max-w-md">{error}</p>
						<button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors">Спробувати ще раз</button>
					</div>
				) : filteredProducts.length > 0 ? (
					<div className={`grid gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ${gridCols === 2 ? 'grid-cols-1 sm:grid-cols-2' :
						gridCols === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
							gridCols === 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' :
								'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
						}`}>
						{filteredProducts.map((product) => (
							<div key={product.id} className="group bg-white rounded-2xl border border-slate-200/60 p-4 flex flex-col hover:shadow-xl hover:shadow-slate-200/50 hover:border-sky-200 transition-all duration-300 relative">
								<div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
									{product.isNew && <span className="bg-sky-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm shadow-sky-200">New</span>}
									{product.isSale && <span className="bg-rose-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm shadow-rose-200">Sale</span>}
								</div>

								<button
									onClick={(e) => handleToggleWishlist(e, product)}
									className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-all duration-300 shadow-sm ${isInWishlist(product.id)
										? 'bg-rose-50 text-rose-500 opacity-100 scale-100'
										: 'bg-slate-50 text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-rose-50 hover:text-rose-500 scale-75 group-hover:scale-100'
										}`}
								>
									<Heart size={20} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
								</button>

								<Link to={`/product/${product.slug}`} className="h-56 w-full flex items-center justify-center mb-4 overflow-hidden rounded-xl bg-slate-50/50 group-hover:bg-white transition-colors cursor-pointer">
									<img src={product.image} alt={product.name} className={`h-full w-auto object-contain mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-110 ${!product.inStock && 'grayscale opacity-60'}`} />
								</Link>

								<div className="flex-grow flex flex-col">
									<div className="text-xs text-sky-500 font-bold uppercase tracking-wide mb-1 opacity-80">{product.category}</div>
									<Link to={`/product/${product.slug}`}>
										<h3 className={`font-bold text-slate-900 mb-2 leading-snug group-hover:text-sky-600 transition-colors line-clamp-2 ${gridCols >= 4 ? 'text-sm' : 'text-lg'}`}>{product.name}</h3>
									</Link>

									{/* Colors rendering logic updated for DB structure */}
									{product.colors && Array.isArray(product.colors) && product.colors.length > 0 && (
										<div className="flex gap-1.5 mb-3">
											{product.colors.map((color: any, idx: number) => (
												<div
													key={idx}
													className="w-3 h-3 rounded-full border border-slate-200 shadow-sm ring-1 ring-transparent hover:ring-slate-300 transition-all cursor-pointer"
													style={{ backgroundColor: color.hex || color }}
													title={color.name || 'Color'}
												></div>
											))}
										</div>
									)}

									<div className="flex items-center gap-1.5 mb-4">
										<div className="flex text-amber-400"><Star size={14} fill="currentColor" /></div>
										<span className="text-sm font-bold text-slate-700">{product.rating}</span>
										<span className="text-xs text-slate-400 font-medium">({product.reviews} відг.)</span>
									</div>

									<div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
										<div>
											{product.oldPrice && <div className="text-xs text-slate-400 line-through font-medium mb-0.5">{product.oldPrice} ₴</div>}
											<div className={`font-black ${product.isSale ? 'text-rose-600' : 'text-slate-900'} ${gridCols >= 4 ? 'text-lg' : 'text-xl'}`}>{product.price} <span className="text-sm font-bold text-slate-500">₴</span></div>
										</div>
										{product.inStock ? (
											<button
												onClick={(e) => handleAddToCart(e, product)}
												className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white hover:bg-sky-500 hover:scale-110 hover:shadow-lg hover:shadow-sky-200 transition-all duration-300"
											>
												<ShoppingCart size={18} />
											</button>
										) : (
											<span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg">Немає</span>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-slate-100 border-dashed text-center">
						<div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4"><Search size={32} /></div>
						<h3 className="text-lg font-bold text-slate-900">Нічого не знайдено</h3>
						<p className="text-slate-500 max-w-xs mx-auto mt-2">Спробуйте змінити фільтри або пошуковий запит.</p>
						<button onClick={() => { navigate('/catalog'); setSearchQuery(''); setPriceRange({ min: 0, max: 20000 }) }} className="mt-6 text-sky-500 font-bold hover:text-sky-700 hover:underline transition-all">Скинути всі фільтри</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default CatalogPage;