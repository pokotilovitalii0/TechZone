import React, { useState, useMemo, useEffect } from 'react';
import { Filter, ChevronDown, Star, ShoppingCart, Heart, Search, X, SlidersHorizontal, LayoutGrid, Grid2X2, Grid3X3, CheckCircle, Trash2, Box } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom'; // Додали useParams і useNavigate
import { useSetAtom } from 'jotai';
import { addToCartAtom } from '../../store/cartAtoms';

// --- МОКОВІ ДАНІ ---
// (Ті самі, що й були, я скоротив для читабельності)
const PRODUCTS = [
	{ id: 1, name: 'Logitech G Pro X Superlight', price: 5999, category: 'Мишки', image: 'https://content1.rozetka.com.ua/goods/images/big/309983933.jpg', rating: 4.9, reviews: 128, inStock: true, isSale: true, colors: ['#000000'] },
	{ id: 2, name: 'Keychron K2 Pro', price: 4500, category: 'Клавіатури', image: 'https://content2.rozetka.com.ua/goods/images/big/323337966.jpg', rating: 4.8, reviews: 45, inStock: true, isNew: true, colors: ['#2d3748'] },
	{ id: 3, name: 'HyperX Cloud Alpha', price: 7200, category: 'Навушники', image: 'https://content2.rozetka.com.ua/goods/images/big/11547900.jpg', rating: 4.7, reviews: 89, inStock: true, colors: ['#ff0000'] },
	{ id: 6, name: 'SteelSeries QcK Heavy', price: 1499, category: 'Килимки', image: 'https://content2.rozetka.com.ua/goods/images/big/10747043.jpg', rating: 4.8, reviews: 340, inStock: true, colors: ['#000000'] },
];

const CATEGORIES = ['Всі', 'Клавіатури', 'Мишки', 'Навушники', 'Килимки'];

// === СЛОВНИК ДЛЯ ПЕРЕКЛАДУ URL ===
// Ключ (URL) -> Значення (Дані в базі)
const CATEGORY_SLUGS: Record<string, string> = {
	'mice': 'Мишки',
	'keyboards': 'Клавіатури',
	'audio': 'Навушники',
	'accessories': 'Килимки' // Можна розширити на декілька категорій пізніше
};

const CatalogPage = () => {
	// Отримуємо параметр з URL (наприклад, "mice")
	const { categorySlug } = useParams();
	const navigate = useNavigate();
	const addToCart = useSetAtom(addToCartAtom);

	// --- СТАНИ ---
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [priceRange, setPriceRange] = useState({ min: 0, max: 15000 });
	const [searchQuery, setSearchQuery] = useState('');
	const [sortOption, setSortOption] = useState('popular');
	const [gridCols, setGridCols] = useState<2 | 3 | 4 | 5>(4);
	const [toast, setToast] = useState<{ message: string, type: 'success' | 'info' } | null>(null);

	// --- СИНХРОНІЗАЦІЯ URL З ФІЛЬТРАМИ ---
	useEffect(() => {
		if (categorySlug && CATEGORY_SLUGS[categorySlug]) {
			// Якщо в URL є категорія (напр. /catalog/mice), вмикаємо цей фільтр
			setSelectedCategories([CATEGORY_SLUGS[categorySlug]]);
		} else {
			// Якщо ми просто на /catalog, очищаємо фільтри категорій
			setSelectedCategories([]);
		}
	}, [categorySlug]);

	// --- ЛОГІКА ---
	const showToast = (message: string, type: 'success' | 'info' = 'success') => {
		setToast({ message, type });
		setTimeout(() => setToast(null), 3000);
	};

	const toggleCategory = (category: string) => {
		if (category === 'Всі') {
			navigate('/catalog'); // Скидаємо URL
			return;
		}

		// Знаходимо англійський slug для категорії, щоб оновити URL
		const slug = Object.keys(CATEGORY_SLUGS).find(key => CATEGORY_SLUGS[key] === category);

		if (selectedCategories.includes(category)) {
			// Якщо знімаємо вибір - повертаємось на загальний каталог
			navigate('/catalog');
		} else {
			// Якщо вибираємо - переходимо на відповідну сторінку
			if (slug) {
				navigate(`/catalog/${slug}`);
			} else {
				// Фоллбек для категорій без власної сторінки (мультиселект)
				setSelectedCategories(prev => [...prev, category]);
			}
		}
	};

	const isCategorySelected = (category: string) => {
		if (category === 'Всі') return selectedCategories.length === 0;
		return selectedCategories.includes(category);
	};

	const handleAddToCart = (product: any) => {
		addToCart({
			id: product.id,
			name: product.name,
			price: product.price,
			image: product.image,
			quantity: 1,
			selectedColor: product.colors[0]
		});
		showToast(`"${product.name}" додано в кошик!`);
	};

	// --- ФІЛЬТРАЦІЯ (Без змін) ---
	const filteredProducts = useMemo(() => {
		let result = PRODUCTS;
		if (selectedCategories.length > 0) {
			result = result.filter(p => selectedCategories.includes(p.category));
		}
		result = result.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);
		if (searchQuery) {
			result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
		}
		if (sortOption === 'priceAsc') return [...result].sort((a, b) => a.price - b.price);
		if (sortOption === 'priceDesc') return [...result].sort((a, b) => b.price - a.price);
		if (sortOption === 'rating') return [...result].sort((a, b) => b.rating - a.rating);
		return result;
	}, [selectedCategories, priceRange, searchQuery, sortOption]);

	const isFiltersActive = selectedCategories.length > 0 || priceRange.min > 0 || priceRange.max < 15000 || searchQuery !== '';

	return (
		<div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20 relative">
			{/* Toast */}
			{toast && (
				<div className="fixed bottom-8 right-8 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
					<div className="bg-slate-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700">
						<div className="bg-green-500 rounded-full p-1"><CheckCircle size={16} className="text-white" /></div>
						<span className="font-medium">{toast.message}</span>
					</div>
				</div>
			)}

			{/* Header і Filters (Ті самі, що були, лише логіка toggleCategory оновлена вище) */}
			<div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm/50">
				{/* ... код хедера сторінки (Search, Title) залишається тим самим ... */}
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
						{/* ... Input пошуку ... */}
					</div>
				</div>
			</div>

			<div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Фільтри категорій */}
				<div className="flex flex-col gap-6 mb-8">
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
					{/* ... Решта фільтрів (ціна, сортування) без змін ... */}
				</div>

				{/* GRID ТОВАРІВ */}
				<div className={`grid gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ${gridCols === 2 ? 'grid-cols-1 sm:grid-cols-2' :
						gridCols === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
							gridCols === 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' :
								'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
					}`}>
					{filteredProducts.map((product) => (
						<div key={product.id} className="group bg-white rounded-2xl border border-slate-200/60 p-4 flex flex-col hover:shadow-xl transition-all duration-300 relative">
							{/* ... Бейджики ... */}

							<Link to={`/product/${product.id}`} className="h-56 w-full flex items-center justify-center mb-4 overflow-hidden rounded-xl bg-slate-50/50 group-hover:bg-white transition-colors">
								<img src={product.image} alt={product.name} className="h-full w-auto object-contain mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-110" />
							</Link>

							<div className="flex-grow flex flex-col">
								<div className="text-xs text-sky-500 font-bold uppercase tracking-wide mb-1 opacity-80">{product.category}</div>
								<Link to={`/product/${product.id}`} className="font-bold text-slate-900 mb-2 leading-snug group-hover:text-sky-600 transition-colors line-clamp-2">
									{product.name}
								</Link>

								{/* ... Рейтинг ... */}

								<div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
									<div className="font-black text-xl text-slate-900">{product.price} ₴</div>
									<button
										onClick={() => handleAddToCart(product)}
										className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white hover:bg-sky-500 transition-all duration-300"
									>
										<ShoppingCart size={18} />
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default CatalogPage;