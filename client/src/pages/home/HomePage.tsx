import { useState, useEffect } from 'react';
import { ArrowRight, Star, ShoppingCart, Truck, ShieldCheck, RefreshCw, Headphones, MousePointer2, Keyboard, Headphones as AudioIcon, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSetAtom } from 'jotai';
import { addToCartAtom } from '../../store/cartAtoms';

import attachSharkX68HE from '@/assets/HomePage/AttachSharkx68he.webp';

// --- TYPES ---
interface Product {
	id: number;
	name: string;
	slug: string;
	price: number;
	category: string;
	image: string;
	rating: number;
	inStock: boolean;
	colors?: any;
}

const HERO_SLIDES = [
	{
		id: 1,
		badge: "Mouse",
		title: "Level Up Your Setup",
		subtitle: "Найкращі комп'ютерні миші по доступних цінах. Швидкість та точність у кожному кліку.",
		image: "https://realaks.shop/wp-content/uploads/2025/04/R5-ULTRA-W-2R-%D0%BA%D0%BE%D0%BF%D1%96%D1%8F.jpg",
		accent: "from-sky-500 to-blue-600"
	},
	{
		id: 2,
		badge: "Headphones",
		title: "Feel the Rhythm",
		subtitle: "Професійний звук для повного занурення. Почуй кожен крок ворога.",
		image: "https://www.mchose.store/cdn/shop/files/mchose-official-headphones-v9-pro-black-red-mchose-v9-series-wireless-gaming-headset-1166639581.jpg?v=1763699075&width=800",
		accent: "from-purple-500 to-indigo-600"
	},
	{
		id: 3,
		badge: "Keyboard",
		title: "Ultimate Control",
		subtitle: "Механічні клавіатури з миттєвим відгуком. Твоя перевага у кожній грі.",
		image: "https://attackshark.com/cdn/shop/files/1500X68.jpg?v=1752039873&width=800",
		accent: "from-emerald-500 to-teal-600"
	}
];

export default function HomePage() {
	const navigate = useNavigate();
	const addToCart = useSetAtom(addToCartAtom);

	// States
	const [currentSlide, setCurrentSlide] = useState(0);
	const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	// 1. Slider Timer
	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
		}, 5000);
		return () => clearInterval(timer);
	}, []);

	// 2. Fetch Trending Products
	useEffect(() => {
		const fetchTrending = async () => {
			try {
				const response = await fetch('http://localhost:5000/api/products');
				if (response.ok) {
					const data = await response.json();
					// Беремо перші 4 товари для блоку "В тренді"
					// (В ідеалі бекенд мав би endpoint /api/products/trending, але поки slice)
					setTrendingProducts(data.slice(0, 4));
				}
			} catch (error) {
				console.error("Failed to fetch trending products", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchTrending();
	}, []);

	const handleAddToCart = (e: React.MouseEvent, product: Product) => {
		e.preventDefault();

		// Спроба дістати колір
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

		// Можна додати toast notification тут
		alert(`"${product.name}" додано в кошик!`);
	};

	return (
		<div className="bg-white min-h-screen overflow-x-hidden">
			{/* === HERO SECTION === */}
			<section className="relative bg-slate-50 overflow-hidden h-[600px] lg:h-[700px]">
				<div
					className="flex h-full transition-transform duration-700 ease-in-out"
					style={{ transform: `translateX(-${currentSlide * 100}%)` }}
				>
					{HERO_SLIDES.map((slide) => (
						<div key={slide.id} className="w-full h-full flex-shrink-0">
							<div className="container mx-auto px-6 lg:px-12 h-full flex flex-col lg:flex-row items-center gap-12">
								<div className="lg:w-1/2 space-y-6 pt-12 lg:pt-0">
									<span className="inline-block py-1 px-4 rounded-full bg-sky-100 text-sky-600 text-xs font-bold uppercase tracking-wider">
										{slide.badge}
									</span>
									<h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight">
										{slide.id === 1 ? (
											<>Level Up <br /> Your <span className={`text-transparent bg-clip-text bg-gradient-to-r ${slide.accent}`}>Setup</span></>
										) : (
											slide.title
										)}
									</h1>
									<p className="text-lg lg:text-xl text-slate-600 max-w-md leading-relaxed">
										{slide.subtitle}
									</p>
									<div className="flex flex-wrap gap-4 pt-4">
										<Link to="/catalog" className="px-8 py-4 bg-sky-500 hover:bg-slate-900 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-sky-500/30 flex items-center gap-2">
											До Каталогу <ArrowRight size={20} />
										</Link>
									</div>
								</div>
								<div className="lg:w-1/2 relative flex justify-center items-center h-full">
									<div className={`absolute w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] bg-gradient-to-br ${slide.accent} opacity-10 rounded-full blur-3xl`}></div>
									<img src={slide.image} alt={slide.title} className="relative z-10 w-full max-w-md lg:max-w-xl h-full object-contain drop-shadow-2xl py-12" />
								</div>
							</div>
						</div>
					))}
				</div>
				<div className="absolute bottom-10 left-6 lg:left-12 flex gap-3 z-20">
					{HERO_SLIDES.map((_, idx) => (
						<button key={idx} onClick={() => setCurrentSlide(idx)} className={`h-3 rounded-full transition-all duration-300 ${currentSlide === idx ? 'w-10 bg-sky-500' : 'w-3 bg-slate-300'}`} />
					))}
				</div>
			</section>

			{/* === USP SECTION === */}
			<section className="py-12 bg-white border-b border-gray-100">
				<div className="container mx-auto px-6 lg:px-12">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
						<div className="flex items-center gap-4 group">
							<div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-500 "><Truck size={24} /></div>
							<div><h4 className="font-bold text-slate-900 text-sm">Швидка доставка</h4><p className="text-xs text-slate-500">В перші 3 дні замовлення</p></div>
						</div>
						<div className="flex items-center gap-4 group">
							<div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-500 "><ShieldCheck size={24} /></div>
							<div><h4 className="font-bold text-slate-900 text-sm">Гарантія якості</h4><p className="text-xs text-slate-500">Тільки перевірені гаджети</p></div>
						</div>
						<div className="flex items-center gap-4 group">
							<div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-500 "><RefreshCw size={24} /></div>
							<div><h4 className="font-bold text-slate-900 text-sm">Повернення</h4><p className="text-xs text-slate-500">14 днів на тест</p></div>
						</div>
						<div className="flex items-center gap-4 group">
							<div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-500 "><Headphones size={24} /></div>
							<div><h4 className="font-bold text-slate-900 text-sm">Підтримка</h4><p className="text-xs text-slate-500">Наші контакти у кінці сторінки</p></div>
						</div>
					</div>
				</div>
			</section>

			{/* === CATEGORIES GRID SECTION  === */}
			<section className="py-20 bg-white">
				<div className="container mx-auto px-6 lg:px-12">
					<div className="mb-12">
						<h2 className="text-3xl font-bold text-slate-900 uppercase tracking-tight">Категорії</h2>
						<div className="w-20 h-1.5 bg-sky-500 mt-2 rounded-full"></div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-12 gap-6">
						{/* Велика картка - Клавіатури */}
						<Link to="/catalog/keyboards" className="md:col-span-8 group relative overflow-hidden rounded-3xl bg-slate-50 border border-slate-100 h-[300px] md:h-[400px]">
							<div className="absolute top-0 right-[-50px] w-2/3 h-full overflow-hidden">
								<img
									src={attachSharkX68HE}
									className="w-full h-full object-cover opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700"
									alt="Keyboards"
								/>
							</div>
							<div className="relative h-full p-10 flex flex-col justify-center z-10 w-full md:w-1/2">
								<div className="w-14 h-14 bg-white shadow-sm border border-slate-100 rounded-2xl flex items-center justify-center text-sky-500 mb-6 group-hover:scale-110 transition-transform">
									<Keyboard size={30} />
								</div>
								<h3 className="text-4xl font-black text-slate-900 mb-4">Клавіатури</h3>
								<p className="text-slate-500">Знайдеться своя клава кожному.</p>
								<div className="mt-6 flex items-center gap-2 text-sky-600 font-bold group-hover:gap-4 transition-all">
									Переглянути <ArrowRight size={18} />
								</div>
							</div>
						</Link>

						{/* Права колонка - Миші та Аудіо */}
						<div className="md:col-span-4 grid grid-rows-2 gap-6">
							{/* Миші */}
							<Link to="/catalog/mice" className="group relative overflow-hidden rounded-3xl bg-sky-50 border border-sky-100">
								<div className="absolute -right-4 -bottom-4 p-8 text-sky-500/10 group-hover:text-sky-500/20 group-hover:scale-125 transition-all duration-500">
									<MousePointer2 size={120} />
								</div>
								<div className="relative h-full p-8 flex flex-col justify-center z-10">
									<h3 className="text-2xl font-black text-slate-900 mb-1">Миші</h3>
									<p className="text-slate-500 text-sm mb-4">Легкість та сенсори нового покоління.</p>
									<div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-sky-500 shadow-sm border border-sky-100 group-hover:bg-sky-500 group-hover:text-white transition-colors">
										<ArrowRight size={16} />
									</div>
								</div>
							</Link>

							{/* Аудіо */}
							<Link to="/catalog/audio" className="group relative overflow-hidden rounded-3xl bg-indigo-50 border border-indigo-100">
								<div className="absolute -right-4 -bottom-4 p-8 text-indigo-500/10 group-hover:text-indigo-500/20 group-hover:scale-125 transition-all duration-500">
									<AudioIcon size={120} />
								</div>
								<div className="relative h-full p-8 flex flex-col justify-center z-10">
									<h3 className="text-2xl font-black text-slate-900 mb-1">Аудіо</h3>
									<p className="text-slate-500 text-sm mb-4">Почуй кожен рух суперника.</p>
									<div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-indigo-500 shadow-sm border border-indigo-100 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
										<ArrowRight size={16} />
									</div>
								</div>
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* === TRENDING PRODUCTS (REAL DATA) === */}
			<section className="py-20 bg-slate-50">
				<div className="container mx-auto px-6 lg:px-12">
					<div className="flex justify-between items-end mb-12">
						<div>
							<h2 className="text-3xl font-bold text-slate-900 uppercase tracking-tight">В Тренді</h2>
							<p className="text-slate-500 mt-2 italic">Найкраще обладнання цього сезону</p>
						</div>
						<Link to="/catalog" className="text-sky-600 font-bold hover:text-slate-900 transition-colors flex items-center gap-1">
							Дивитись всі <ArrowRight size={16} />
						</Link>
					</div>

					{isLoading ? (
						<div className="flex justify-center py-20">
							<Loader2 className="w-10 h-10 text-sky-500 animate-spin" />
						</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
							{trendingProducts.length > 0 ? (
								trendingProducts.map((product) => (
									<Link to={`/product/${product.slug}`} key={product.id} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 group relative flex flex-col">

										{/* Image Container */}
										<div className="relative bg-gray-50 rounded-xl h-52 flex items-center justify-center mb-5 overflow-hidden">
											<img
												src={product.image}
												alt={product.name}
												className={`h-36 object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500 ${!product.inStock && 'grayscale opacity-60'}`}
											/>

											{/* Add to Cart Button */}
											{product.inStock && (
												<button
													onClick={(e) => handleAddToCart(e, product)}
													className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-900 hover:bg-sky-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0"
												>
													<ShoppingCart size={20} />
												</button>
											)}
										</div>

										{/* Content */}
										<div className="space-y-3 flex-grow flex flex-col justify-end">
											<p className="text-[10px] font-black text-sky-500 uppercase tracking-widest">{product.category}</p>
											<h3 className="font-bold text-slate-900 text-lg leading-tight group-hover:text-sky-600 transition-colors line-clamp-2">
												{product.name}
											</h3>

											<div className="flex justify-between items-center pt-2">
												<span className="text-2xl font-black text-slate-900">{product.price} ₴</span>
												<div className="flex items-center gap-1 text-yellow-400 text-sm font-bold bg-yellow-50 px-2 py-1 rounded-lg">
													<Star size={14} fill="currentColor" /> {product.rating}
												</div>
											</div>
										</div>
									</Link>
								))
							) : (
								<div className="col-span-4 text-center text-slate-500 py-10">
									Товарів поки немає. Загляньте в каталог!
								</div>
							)}
						</div>
					)}
				</div>
			</section>
		</div>
	);
}