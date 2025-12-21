import React, { useState, useMemo } from 'react';
import { Filter, ChevronDown, Star, ShoppingCart, Heart, Search, X, SlidersHorizontal, LayoutGrid, Grid2X2, Grid3X3 } from 'lucide-react';

// --- МОКОВІ ДАНІ ---
const PRODUCTS = [
	{
		id: 1,
		name: 'Logitech G Pro X Superlight Black',
		price: 5999,
		oldPrice: 6499,
		category: 'Мишки',
		image: 'https://content1.rozetka.com.ua/goods/images/big/309983933.jpg',
		rating: 4.9,
		reviews: 128,
		inStock: true,
		isNew: false,
		isSale: true
	},
	{
		id: 2,
		name: 'Keychron K2 Pro Mechanical RGB',
		price: 4500,
		oldPrice: null,
		category: 'Клавіатури',
		image: 'https://content2.rozetka.com.ua/goods/images/big/323337966.jpg',
		rating: 4.8,
		reviews: 45,
		inStock: true,
		isNew: true,
		isSale: false
	},
	{
		id: 3,
		name: 'HyperX Cloud Alpha Wireless',
		price: 7200,
		oldPrice: null,
		category: 'Навушники',
		image: 'https://content2.rozetka.com.ua/goods/images/big/11547900.jpg',
		rating: 4.7,
		reviews: 89,
		inStock: true,
		isNew: false,
		isSale: false
	},
	{
		id: 4,
		name: 'Razer DeathAdder V3 Pro',
		price: 6999,
		oldPrice: null,
		category: 'Мишки',
		image: 'https://content1.rozetka.com.ua/goods/images/big/285623086.jpg',
		rating: 5.0,
		reviews: 12,
		inStock: false, // Немає в наявності
		isNew: true,
		isSale: false
	},
	{
		id: 5,
		name: 'Asus ROG Azoth 75% OLED',
		price: 10999,
		oldPrice: 11500,
		category: 'Клавіатури',
		image: 'https://content1.rozetka.com.ua/goods/images/big/317377543.jpg',
		rating: 5.0,
		reviews: 7,
		inStock: true,
		isNew: true,
		isSale: true
	},
	{
		id: 6,
		name: 'SteelSeries QcK Heavy XXL',
		price: 1499,
		oldPrice: null,
		category: 'Килимки',
		image: 'https://content2.rozetka.com.ua/goods/images/big/10747043.jpg',
		rating: 4.8,
		reviews: 340,
		inStock: true,
		isNew: false,
		isSale: false
	},
];

const CATEGORIES = ['Всі', 'Клавіатури', 'Мишки', 'Навушники', 'Килимки'];

const CatalogPage = () => {
	// --- СТАНИ ---
	const [selectedCategory, setSelectedCategory] = useState('Всі');
	const [priceRange, setPriceRange] = useState({ min: 0, max: 15000 });
	const [searchQuery, setSearchQuery] = useState('');
	const [sortOption, setSortOption] = useState('popular');
	const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

	// Новий стан для керування сіткою (за замовчуванням 3 колонки)
	const [gridCols, setGridCols] = useState<2 | 3 | 4>(3);

	// --- ОБРОБНИКИ ДЛЯ СЛАЙДЕРА (Custom Implementation) ---
	const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = Math.min(Number(e.target.value), priceRange.max - 500);
		setPriceRange({ ...priceRange, min: value });
	};

	const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = Math.max(Number(e.target.value), priceRange.min + 500);
		setPriceRange({ ...priceRange, max: value });
	};

	const minPercent = (priceRange.min / 15000) * 100;
	const maxPercent = (priceRange.max / 15000) * 100;

	// --- ЛОГІКА ФІЛЬТРАЦІЇ ---
	const filteredProducts = useMemo(() => {
		let result = PRODUCTS;

		if (selectedCategory !== 'Всі') {
			result = result.filter(p => p.category === selectedCategory);
		}

		result = result.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);

		if (searchQuery) {
			result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
		}

		if (sortOption === 'priceAsc') {
			return [...result].sort((a, b) => a.price - b.price);
		} else if (sortOption === 'priceDesc') {
			return [...result].sort((a, b) => b.price - a.price);
		} else if (sortOption === 'rating') {
			return [...result].sort((a, b) => b.rating - a.rating);
		}

		return result;
	}, [selectedCategory, priceRange, searchQuery, sortOption]);

	return (
		<div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">

			{/* --- HEADER --- */}
			<div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
						<div>
							<h1 className="text-2xl font-black text-slate-900 tracking-tight">Каталог</h1>
							<div className="text-sm text-slate-500 mt-1">
								Головна / <span className="text-sky-500 font-medium">{selectedCategory}</span>
							</div>
						</div>

						{/* Пошук */}
						<div className="relative w-full md:w-96 group">
							<input
								type="text"
								placeholder="Пошук девайсів..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full pl-11 pr-4 py-2.5 bg-slate-100 border-transparent border focus:bg-white focus:border-sky-500 rounded-xl transition-all outline-none text-sm font-medium group-hover:bg-white group-hover:border-slate-300"
							/>
							<Search className="absolute left-3.5 top-3 text-slate-400 group-hover:text-sky-500 transition-colors" size={18} />
						</div>
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex flex-col lg:flex-row gap-8">

					{/* --- SIDEBAR (Фільтри) --- */}
					<div className="lg:w-1/4 flex-shrink-0">
						{/* Кнопка фільтрів для мобільного */}
						<button
							onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
							className="lg:hidden w-full flex items-center justify-center gap-2 bg-white border border-slate-200 p-3 rounded-xl font-bold text-slate-700 mb-4 shadow-sm active:scale-95 transition-transform"
						>
							<SlidersHorizontal size={18} /> Фільтри та Сортування
						</button>

						{/* Контейнер фільтрів */}
						<div className={`fixed inset-0 z-50 bg-white p-6 transform transition-transform duration-300 overflow-y-auto lg:relative lg:inset-auto lg:bg-transparent lg:p-0 lg:transform-none lg:overflow-visible lg:block ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
							<div className="flex justify-between items-center lg:hidden mb-6">
								<h2 className="text-xl font-bold">Фільтри</h2>
								<button onClick={() => setIsMobileFilterOpen(false)} className="p-2 bg-slate-100 rounded-full">
									<X size={20} />
								</button>
							</div>

							<div className="space-y-8">
								{/* Категорії */}
								<div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
									<h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
										<Filter size={16} className="text-sky-500" /> Категорії
									</h3>
									<div className="space-y-1">
										{CATEGORIES.map(cat => (
											<button
												key={cat}
												onClick={() => { setSelectedCategory(cat); setIsMobileFilterOpen(false); }}
												className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 flex justify-between items-center ${selectedCategory === cat
													? 'bg-sky-500 text-white font-medium shadow-lg shadow-sky-500/30'
													: 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
													}`}
											>
												{cat}
												{selectedCategory === cat && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
											</button>
										))}
									</div>
								</div>

								{/* Ціна (Custom Slider) */}
								<div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm">
									<h3 className="font-bold text-slate-900 mb-4">Ціна (грн)</h3>

									{/* Інпути */}
									<div className="flex items-center gap-2 mb-6">
										<div className="relative w-full">
											<span className="absolute left-3 top-2.5 text-slate-400 text-xs">від</span>
											<input
												type="number"
												value={priceRange.min}
												onChange={(e) => setPriceRange({ ...priceRange, min: Math.min(Number(e.target.value), priceRange.max - 100) })}
												className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-8 pr-2 text-sm font-medium focus:ring-2 focus:ring-sky-500 outline-none"
											/>
										</div>
										<span className="text-slate-300 font-light">—</span>
										<div className="relative w-full">
											<span className="absolute left-3 top-2.5 text-slate-400 text-xs">до</span>
											<input
												type="number"
												value={priceRange.max}
												onChange={(e) => setPriceRange({ ...priceRange, max: Math.max(Number(e.target.value), priceRange.min + 100) })}
												className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-8 pr-2 text-sm font-medium focus:ring-2 focus:ring-sky-500 outline-none"
											/>
										</div>
									</div>

									{/* Слайдер */}
									<div className="relative h-2 bg-slate-200 rounded-full mb-4">
										{/* Зафарбована лінія */}
										<div
											className="absolute h-full bg-sky-500 rounded-full z-10"
											style={{ left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }}
										></div>

										{/* Лівий повзунок */}
										<input
											type="range"
											min="0"
											max="15000"
											step="100"
											value={priceRange.min}
											onChange={handleMinChange}
											className="absolute w-full h-full appearance-none bg-transparent pointer-events-none z-20 top-0 left-0
                                            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-sky-500 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:mt-[-6px]"
										/>

										{/* Правий повзунок */}
										<input
											type="range"
											min="0"
											max="15000"
											step="100"
											value={priceRange.max}
											onChange={handleMaxChange}
											className="absolute w-full h-full appearance-none bg-transparent pointer-events-none z-30 top-0 left-0
                                            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-sky-500 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:mt-[-6px]"
										/>
									</div>
								</div>
							</div>
						</div>

						{/* Overlay */}
						{isMobileFilterOpen && (
							<div
								className="fixed inset-0 bg-black/20 z-40 lg:hidden backdrop-blur-sm"
								onClick={() => setIsMobileFilterOpen(false)}
							></div>
						)}
					</div>

					{/* --- MAIN CONTENT --- */}
					<div className="lg:w-3/4">

						{/* Верхня панель */}
						<div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
							<span className="text-slate-500 text-sm font-medium">
								Знайдено <span className="text-slate-900 font-bold">{filteredProducts.length}</span> товарів
							</span>

							<div className="flex items-center gap-4 w-full sm:w-auto justify-end">
								{/* ПЕРЕМИКАЧ СІТКИ (Grid Switcher) */}
								<div className="hidden md:flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
									<button
										onClick={() => setGridCols(2)}
										className={`p-1.5 rounded-md transition-all ${gridCols === 2 ? 'bg-slate-100 text-sky-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
										title="2 колонки"
									>
										<Grid2X2 size={20} />
									</button>
									<button
										onClick={() => setGridCols(3)}
										className={`p-1.5 rounded-md transition-all ${gridCols === 3 ? 'bg-slate-100 text-sky-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
										title="3 колонки"
									>
										<LayoutGrid size={20} />
									</button>
									<button
										onClick={() => setGridCols(4)}
										className={`p-1.5 rounded-md transition-all ${gridCols === 4 ? 'bg-slate-100 text-sky-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
										title="4 колонки"
									>
										<Grid3X3 size={20} />
									</button>
								</div>

								<div className="relative group">
									<select
										value={sortOption}
										onChange={(e) => setSortOption(e.target.value)}
										className="appearance-none bg-white border border-slate-200 text-slate-700 py-2 pl-4 pr-10 rounded-xl text-sm font-bold focus:outline-none focus:border-sky-500 cursor-pointer shadow-sm hover:border-slate-300 transition-colors"
									>
										<option value="popular">За популярністю</option>
										<option value="priceAsc">Від дешевих</option>
										<option value="priceDesc">Від дорогих</option>
										<option value="rating">За рейтингом</option>
									</select>
									<ChevronDown size={16} className="absolute right-3 top-3 text-slate-400 pointer-events-none group-hover:text-sky-500 transition-colors" />
								</div>
							</div>
						</div>

						{/* СІТКА */}
						{filteredProducts.length > 0 ? (
							<div className={`grid gap-6 ${gridCols === 2 ? 'grid-cols-1 sm:grid-cols-2' :
									gridCols === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
										'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
								}`}>
								{filteredProducts.map((product) => (
									<div key={product.id} className="group bg-white rounded-2xl border border-slate-100 p-4 flex flex-col hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-sky-100 transition-all duration-300 relative">

										{/* Бейджі */}
										<div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
											{product.isNew && (
												<span className="bg-sky-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm shadow-sky-200">New</span>
											)}
											{product.isSale && (
												<span className="bg-rose-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm shadow-rose-200">Sale</span>
											)}
										</div>

										{/* Вішліст */}
										<button className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 duration-300">
											<Heart size={20} />
										</button>

										{/* Фото */}
										<div className="h-48 w-full flex items-center justify-center mb-4 overflow-hidden rounded-xl bg-slate-50/50 group-hover:bg-white transition-colors">
											<img
												src={product.image}
												alt={product.name}
												className={`h-full w-auto object-contain mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-110 ${!product.inStock && 'grayscale opacity-60'}`}
											/>
										</div>

										{/* Інфо */}
										<div className="flex-grow flex flex-col">
											<div className="text-xs text-sky-500 font-bold uppercase tracking-wide mb-1 opacity-80">{product.category}</div>

											<h3 className={`font-bold text-slate-900 mb-2 leading-snug group-hover:text-sky-600 transition-colors line-clamp-2 ${gridCols === 4 ? 'text-sm' : 'text-lg'}`}>
												{product.name}
											</h3>

											{/* Рейтинг */}
											<div className="flex items-center gap-1.5 mb-4">
												<div className="flex text-amber-400">
													<Star size={14} fill="currentColor" />
												</div>
												<span className="text-sm font-bold text-slate-700">{product.rating}</span>
												<span className="text-xs text-slate-400 font-medium">({product.reviews} відг.)</span>
											</div>

											<div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
												<div>
													{product.oldPrice && (
														<div className="text-xs text-slate-400 line-through font-medium mb-0.5">{product.oldPrice} ₴</div>
													)}
													<div className={`font-black ${product.isSale ? 'text-rose-600' : 'text-slate-900'} ${gridCols === 4 ? 'text-lg' : 'text-xl'}`}>
														{product.price} <span className="text-sm font-bold text-slate-500">₴</span>
													</div>
												</div>

												{product.inStock ? (
													<button className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white hover:bg-sky-500 hover:scale-110 hover:shadow-lg hover:shadow-sky-200 transition-all duration-300">
														<ShoppingCart size={18} />
													</button>
												) : (
													<span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg">
														Немає
													</span>
												)}
											</div>
										</div>
									</div>
								))}
							</div>
						) : (
							// Порожній стан
							<div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-slate-100 border-dashed text-center">
								<div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
									<Search size={32} />
								</div>
								<h3 className="text-lg font-bold text-slate-900">Нічого не знайдено</h3>
								<p className="text-slate-500 max-w-xs mx-auto mt-2">Спробуйте змінити фільтри або пошуковий запит.</p>
								<button
									onClick={() => { setSelectedCategory('Всі'); setSearchQuery(''); setPriceRange({ min: 0, max: 15000 }) }}
									className="mt-6 text-sky-500 font-bold hover:text-sky-700 hover:underline transition-all"
								>
									Скинути всі фільтри
								</button>
							</div>
						)}

					</div>
				</div>
			</div>
		</div>
	);
};

export default CatalogPage;