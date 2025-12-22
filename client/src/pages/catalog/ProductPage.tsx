import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // Для навігації
import { Star, ShoppingCart, Heart, ArrowLeft, Truck, ShieldCheck, RefreshCw, Minus, Plus, CheckCircle, Share2, ChevronRight } from 'lucide-react';

// --- РОЗШИРЕНІ МОКОВІ ДАНІ (Імітація API) ---
// В реальному проекті ти будеш завантажувати це по ID
const PRODUCT_DETAILS = {
	id: 1,
	name: 'Logitech G Pro X Superlight Black',
	price: 5999,
	oldPrice: 6499,
	category: 'Мишки',
	rating: 4.9,
	reviewsCount: 128,
	inStock: true,
	sku: 'LOG-GPX-BLK-001',
	description: 'Logitech G PRO X Superlight — це найлегша і найшвидша бездротова ігрова миша серії PRO. Вона важить менше 63 грамів і забезпечує ковзання майже без тертя. Розроблена у співпраці з провідними кіберспортсменами світу, вона створена для перемоги.',
	specs: [
		{ label: 'Сенсор', value: 'HERO 25K' },
		{ label: 'DPI', value: '100 - 25 600' },
		{ label: 'Вага', value: '63 г' },
		{ label: 'Час роботи', value: '70 годин' },
		{ label: 'З\'єднання', value: 'LIGHTSPEED Wireless' },
		{ label: 'Кількість кнопок', value: '5' },
	],
	images: [
		'https://content1.rozetka.com.ua/goods/images/big/309983933.jpg', // Головне
		'https://content2.rozetka.com.ua/goods/images/big/309983934.jpg', // Збоку
		'https://content1.rozetka.com.ua/goods/images/big/309983940.jpg', // Знизу
		'https://content2.rozetka.com.ua/goods/images/big/309983955.jpg', // В руці
	],
	colors: [
		{ name: 'Black', hex: '#000000' },
		{ name: 'White', hex: '#ffffff' },
		{ name: 'Magenta', hex: '#ff0055' }
	],
	reviews: [
		{ user: 'Олександр К.', rating: 5, text: 'Найкраща мишка, яку я тримав у руках. Заряд тримає вічність.', date: '12.10.2023' },
		{ user: 'Марина С.', rating: 4, text: 'Дуже легка, спочатку незвично, але потім кайф.', date: '05.11.2023' }
	]
};

const ProductPage = () => {
	const { id } = useParams(); // Отримуємо ID з URL
	const navigate = useNavigate();

	// --- СТАНИ ---
	const [selectedImage, setSelectedImage] = useState(0);
	const [selectedColor, setSelectedColor] = useState(0);
	const [quantity, setQuantity] = useState(1);
	const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');
	const [toast, setToast] = useState<string | null>(null);

	// --- ЛОГІКА ---
	const product = PRODUCT_DETAILS; // Тут ми б шукали product по ID

	const handleQuantityChange = (type: 'inc' | 'dec') => {
		if (type === 'dec' && quantity > 1) setQuantity(prev => prev - 1);
		if (type === 'inc' && quantity < 10) setQuantity(prev => prev + 1);
	};

	const addToCart = () => {
		setToast(`Додано в кошик: ${quantity} шт.`);
		setTimeout(() => setToast(null), 3000);
	};

	// Якщо товару немає (для прикладу)
	if (!product) return <div>Товар не знайдено</div>;

	return (
		<div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">

			{/* --- TOAST NOTIFICATION --- */}
			{toast && (
				<div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-5 duration-300">
					<div className="bg-slate-900 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3">
						<CheckCircle size={18} className="text-green-400" />
						<span className="font-medium text-sm">{toast}</span>
					</div>
				</div>
			)}

			{/* --- HEADER / BREADCRUMBS --- */}
			<div className="bg-white border-b border-slate-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<button
						onClick={() => navigate(-1)}
						className="flex items-center gap-2 text-slate-500 hover:text-sky-600 transition-colors text-sm font-medium mb-4"
					>
						<ArrowLeft size={16} /> Назад до каталогу
					</button>

					<div className="flex items-center gap-2 text-sm text-slate-400 overflow-hidden whitespace-nowrap">
						<Link to="/" className="hover:text-slate-600">Головна</Link>
						<ChevronRight size={14} />
						<span className="hover:text-slate-600 cursor-pointer">{product.category}</span>
						<ChevronRight size={14} />
						<span className="text-slate-900 font-medium truncate">{product.name}</span>
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

				{/* --- MAIN GRID --- */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

					{/* LEFT COLUMN: IMAGES */}
					<div className="space-y-4">
						{/* Main Image */}
						<div className="bg-white rounded-3xl border border-slate-200 p-8 h-[400px] sm:h-[500px] flex items-center justify-center relative group">
							<button className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors">
								<Heart size={24} />
							</button>
							<img
								src={product.images[selectedImage]}
								alt={product.name}
								className="w-full h-full object-contain mix-blend-multiply transition-all duration-500"
							/>
						</div>

						{/* Thumbnails */}
						<div className="grid grid-cols-4 gap-4">
							{product.images.map((img, idx) => (
								<button
									key={idx}
									onClick={() => setSelectedImage(idx)}
									className={`bg-white rounded-xl border-2 p-2 h-24 flex items-center justify-center transition-all ${selectedImage === idx ? 'border-sky-500 shadow-md scale-95' : 'border-slate-100 hover:border-slate-300'
										}`}
								>
									<img src={img} alt="Thumbnail" className="w-full h-full object-contain" />
								</button>
							))}
						</div>
					</div>

					{/* RIGHT COLUMN: INFO */}
					<div className="flex flex-col">
						<div className="mb-6">
							<div className="flex items-center justify-between mb-2">
								<span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${product.inStock ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
									{product.inStock ? 'В наявності' : 'Закінчився'}
								</span>
								<span className="text-slate-400 text-sm">Код: {product.sku}</span>
							</div>
							<h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 leading-tight">{product.name}</h1>

							<div className="flex items-center gap-4">
								<div className="flex items-center gap-1 text-amber-400">
									{[...Array(5)].map((_, i) => (
										<Star key={i} size={18} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} className={i >= Math.floor(product.rating) ? "text-slate-300" : ""} />
									))}
								</div>
								<span className="text-sm font-medium text-slate-500 underline decoration-slate-300 underline-offset-4 cursor-pointer hover:text-sky-600 transition-colors">
									{product.reviewsCount} відгуків
								</span>
							</div>
						</div>

						{/* Price Block */}
						<div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-8">
							<div className="flex items-end gap-3 mb-6">
								<span className="text-4xl font-black text-slate-900">{product.price} <span className="text-2xl text-slate-500">₴</span></span>
								{product.oldPrice && (
									<span className="text-lg text-slate-400 line-through mb-1">{product.oldPrice} ₴</span>
								)}
							</div>

							<div className="space-y-6">
								{/* Color Selector */}
								<div>
									<span className="text-sm font-bold text-slate-700 block mb-3">Колір: <span className="text-slate-500 font-normal">{product.colors[selectedColor].name}</span></span>
									<div className="flex gap-3">
										{product.colors.map((color, idx) => (
											<button
												key={idx}
												onClick={() => setSelectedColor(idx)}
												className={`w-10 h-10 rounded-full shadow-sm ring-2 ring-offset-2 transition-all ${selectedColor === idx ? 'ring-sky-500 scale-110' : 'ring-transparent hover:ring-slate-300'}`}
												style={{ backgroundColor: color.hex, border: color.hex === '#ffffff' ? '1px solid #e2e8f0' : 'none' }}
												title={color.name}
											/>
										))}
									</div>
								</div>

								<div className="h-px bg-slate-100" />

								{/* Actions */}
								<div className="flex flex-col sm:flex-row gap-4">
									<div className="flex items-center bg-slate-100 rounded-xl p-1 w-fit">
										<button onClick={() => handleQuantityChange('dec')} className="p-3 text-slate-500 hover:bg-white hover:text-slate-900 rounded-lg transition-all disabled:opacity-50"><Minus size={18} /></button>
										<span className="w-12 text-center font-bold text-lg">{quantity}</span>
										<button onClick={() => handleQuantityChange('inc')} className="p-3 text-slate-500 hover:bg-white hover:text-slate-900 rounded-lg transition-all"><Plus size={18} /></button>
									</div>
									<button
										onClick={addToCart}
										className="flex-1 bg-sky-500 text-white font-bold text-lg py-3 px-8 rounded-xl hover:bg-slate-900 hover:shadow-lg hover:shadow-sky-200 transition-all flex items-center justify-center gap-2"
									>
										<ShoppingCart size={20} /> Купити
									</button>
									<button className="p-4 rounded-xl border-2 border-slate-200 text-slate-400 hover:border-slate-900 hover:text-slate-900 transition-all">
										<Share2 size={20} />
									</button>
								</div>
							</div>
						</div>

						{/* Features */}
						<div className="grid grid-cols-2 gap-4">
							<div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-slate-100">
								<Truck className="text-sky-500 shrink-0" size={24} />
								<div>
									<h4 className="font-bold text-sm text-slate-900">Безкоштовна доставка</h4>
									<p className="text-xs text-slate-500 mt-0.5">Для замовлень від 2000 ₴</p>
								</div>
							</div>
							<div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-slate-100">
								<ShieldCheck className="text-sky-500 shrink-0" size={24} />
								<div>
									<h4 className="font-bold text-sm text-slate-900">Гарантія 24 міс.</h4>
									<p className="text-xs text-slate-500 mt-0.5">Офіційна від виробника</p>
								</div>
							</div>
							<div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-slate-100">
								<RefreshCw className="text-sky-500 shrink-0" size={24} />
								<div>
									<h4 className="font-bold text-sm text-slate-900">Повернення</h4>
									<p className="text-xs text-slate-500 mt-0.5">Протягом 14 днів</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* --- TABS SECTION --- */}
				<div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
					<div className="flex border-b border-slate-200">
						{['desc', 'specs', 'reviews'].map((tab) => (
							<button
								key={tab}
								onClick={() => setActiveTab(tab as any)}
								className={`px-8 py-5 font-bold text-sm uppercase tracking-wide transition-all relative ${activeTab === tab ? 'text-sky-600' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
									}`}
							>
								{tab === 'desc' && 'Опис'}
								{tab === 'specs' && 'Характеристики'}
								{tab === 'reviews' && `Відгуки (${product.reviews.length})`}
								{activeTab === tab && (
									<div className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-500" />
								)}
							</button>
						))}
					</div>

					<div className="p-8 lg:p-12 min-h-[300px]">
						{activeTab === 'desc' && (
							<div className="prose prose-slate max-w-none animate-in fade-in duration-300">
								<h3 className="text-xl font-bold mb-4">Про товар {product.name}</h3>
								<p className="text-slate-600 leading-relaxed text-lg">{product.description}</p>
								{/* Тут можна додати більше тексту або картинки */}
							</div>
						)}

						{activeTab === 'specs' && (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 animate-in fade-in duration-300">
								{product.specs.map((spec, idx) => (
									<div key={idx} className="flex justify-between py-3 border-b border-slate-100 last:border-0">
										<span className="text-slate-500 font-medium">{spec.label}</span>
										<span className="text-slate-900 font-bold text-right">{spec.value}</span>
									</div>
								))}
							</div>
						)}

						{activeTab === 'reviews' && (
							<div className="space-y-6 animate-in fade-in duration-300">
								{product.reviews.map((review, idx) => (
									<div key={idx} className="bg-slate-50 p-6 rounded-2xl">
										<div className="flex items-center justify-between mb-3">
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center font-bold">
													{review.user.charAt(0)}
												</div>
												<div>
													<h4 className="font-bold text-slate-900">{review.user}</h4>
													<div className="flex text-amber-400 text-xs">
														{[...Array(5)].map((_, i) => (
															<Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} className={i >= review.rating ? "text-slate-300" : ""} />
														))}
													</div>
												</div>
											</div>
											<span className="text-xs text-slate-400">{review.date}</span>
										</div>
										<p className="text-slate-600">{review.text}</p>
									</div>
								))}
							</div>
						)}
					</div>
				</div>

			</div>
		</div>
	);
};

export default ProductPage;