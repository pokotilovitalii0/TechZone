import { ArrowRight, Star, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

// Тимчасові дані для карток (Mock Data)
const TRENDING_PRODUCTS = [
	{ id: 1, name: "Logitech G Pro X", category: "Миші", price: 4999, rating: 4.9, image: "https://resource.logitechg.com/w_692,c_lpad,ar_4:3,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/pro-x-superlight/pro-x-superlight-black-gallery-1.png?v=1" },
	{ id: 2, name: "Razer Huntsman V2", category: "Клавіатури", price: 7499, rating: 4.8, image: "https://assets3.razerzone.com/A-9X6a7i-77M6qF-77M6qF/razer-huntsman-v2-tenkeyless-linear-optical-switch-black-gallery-1.png" },
	{ id: 3, name: "SteelSeries Arctis 7", category: "Навушники", price: 6299, rating: 4.7, image: "https://media.steelseriescdn.com/thumbs/catalogue/products/01058-arctis-7-black-2019-edition/6563774130a8474ba499cecd7db4123e.png.350x280_q100_crop-fit_optimize.png" },
	{ id: 4, name: "HyperX QuadCast S", category: "Мікрофони", price: 5599, rating: 4.9, image: "https://row.hyperx.com/cdn/shop/products/hyperx_quadcast_s_black_1_front_900x.png?v=1660613669" },
];

const CATEGORIES = [
	{ name: "Ігрові Миші", image: "https://resource.logitech.com/w_692,c_lpad,ar_4:3,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/gaming/en/products/g502-lightspeed-gaming-mouse/g502-lightspeed-gallery-1.png?v=1" },
	{ name: "Механіка", image: "https://assets2.razerzone.com/images/pnx.assets/617255496df7e85986656a39/razer-blackwidow-v4-pro-500x500.png" },
	{ name: "Гарнітури", image: "https://media.steelseriescdn.com/thumbs/catalogue/products/01058-arctis-7-black-2019-edition/6563774130a8474ba499cecd7db4123e.png.350x280_q100_crop-fit_optimize.png" },
];

export default function HomePage() {
	return (
		<div className="bg-white min-h-screen">

			{/* === HERO SECTION === */}
			<section className="relative bg-slate-50 py-20 lg:py-32 overflow-hidden">
				<div className="container mx-auto px-4 flex flex-col lg:flex-row items-center">
					<div className="lg:w-1/2 z-10">
						<span className="inline-block py-1 px-3 rounded-full bg-sky-100 text-sky-600 text-xs font-bold uppercase tracking-wider mb-6">
							Нове надходження
						</span>
						<h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight mb-6">
							Level Up <br /> Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">Setup</span>
						</h1>
						<p className="text-lg text-slate-600 mb-8 max-w-md leading-relaxed">
							Найкраща периферія для кіберспорту та роботи.
							Швидкість, точність та комфорт у кожному девайсі.
						</p>
						<div className="flex gap-4">
							<Link to="/catalog" className="px-8 py-4 bg-sky-500 hover:bg-slate-900 text-white font-bold rounded-lg transition-all duration-300 shadow-lg shadow-sky-500/30 flex items-center gap-2">
								До Каталогу <ArrowRight size={20} />
							</Link>
							<button className="px-8 py-4 border border-slate-200 hover:border-slate-900 text-slate-900 font-bold rounded-lg transition-all duration-300">
								Дізнатись більше
							</button>
						</div>
					</div>

					{/* Декоративний елемент (Картинка) */}
					<div className="lg:w-1/2 mt-12 lg:mt-0 relative">
						<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-3xl"></div>
						<img
							src="https://assets2.razerzone.com/images/pnx.assets/81252a06657230a77977e23e37080d23/razer-cobra-pro-line-hero-mobile.png"
							alt="Hero Product"
							className="relative z-10 w-full max-w-lg mx-auto drop-shadow-2xl animate-float" // animate-float треба додати в tailwind config або css
						/>
					</div>
				</div>
			</section>

			{/* === CATEGORIES === */}
			<section className="py-20 container mx-auto px-4">
				<h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Популярні категорії</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{CATEGORIES.map((cat, i) => (
						<div key={i} className="group relative h-64 rounded-2xl overflow-hidden bg-slate-100 cursor-pointer">
							<div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent z-10"></div>
							<img src={cat.image} alt={cat.name} className="w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-110" />
							<div className="absolute bottom-6 left-6 z-20">
								<h3 className="text-xl font-bold text-white group-hover:text-sky-400 transition-colors">{cat.name}</h3>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* === TRENDING PRODUCTS === */}
			<section className="py-20 bg-slate-50">
				<div className="container mx-auto px-4">
					<div className="flex justify-between items-end mb-12">
						<div>
							<h2 className="text-3xl font-bold text-slate-900">В Тренді</h2>
							<p className="text-slate-500 mt-2">Вибір професіоналів цього тижня</p>
						</div>
						<Link to="/catalog" className="text-sky-600 font-bold hover:text-slate-900 transition-colors flex items-center gap-1">
							Дивитись всі <ArrowRight size={16} />
						</Link>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
						{TRENDING_PRODUCTS.map((product) => (
							// Картка товару
							<div key={product.id} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 group">
								<div className="relative bg-gray-50 rounded-lg h-48 flex items-center justify-center mb-4 overflow-hidden">
									<img src={product.image} alt={product.name} className="h-32 object-contain group-hover:scale-110 transition-transform duration-300" />
									<button className="absolute bottom-3 right-3 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-slate-900 hover:bg-sky-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
										<ShoppingCart size={18} />
									</button>
								</div>
								<div className="space-y-2">
									<p className="text-xs font-bold text-slate-400 uppercase">{product.category}</p>
									<h3 className="font-bold text-slate-900 text-lg leading-tight">{product.name}</h3>
									<div className="flex justify-between items-center mt-4">
										<span className="text-xl font-extrabold text-slate-900">{product.price} ₴</span>
										<div className="flex items-center gap-1 text-yellow-400 text-sm font-bold">
											<Star size={14} fill="currentColor" /> {product.rating}
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

		</div>
	);
}