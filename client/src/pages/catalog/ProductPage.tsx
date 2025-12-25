import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Heart, ArrowLeft, Truck, ShieldCheck, RefreshCw, Minus, Plus, CheckCircle, Share2, ChevronRight, User, Loader2, X } from 'lucide-react';

// --- JOTAI IMPORTS ---
import { useSetAtom, useAtomValue } from 'jotai';
import { addToCartAtom } from '../../store/cartAtoms';
import { wishlistAtom, toggleWishlistAtom } from '../../store/wishlistAtoms';

// --- ТИПИ (Збігаються з API) ---
interface Product {
	id: number;
	name: string;
	slug: string;
	price: number;
	oldPrice?: number | null;
	category: string;
	rating: number;
	reviews: number; // З бази приходить кількість
	inStock: boolean;
	description: string;
	image: string;
	images: string[];
	colors?: any; // JSON
	specs?: any;  // JSON
	sku?: string; // Якщо є в базі, або згенеруємо
}

// Мокові відгуки (поки бекенд зберігає тільки їх кількість)
const MOCK_REVIEWS = [
	{ id: 1, user: 'Олександр К.', rating: 5, text: 'Найкраща покупка за останній час. Якість на висоті!', date: '12.10.2023' },
	{ id: 2, user: 'Марина С.', rating: 4, text: 'Все супер, але доставка трохи затрималась.', date: '05.11.2023' }
];

const ProductPage = () => {
	// Використовуємо slug для URL (SEO-friendly), але підтримуємо і id якщо треба
	const { slug } = useParams();
	const navigate = useNavigate();

	// --- ATOMS ---
	const addToCart = useSetAtom(addToCartAtom);
	const wishlistItems = useAtomValue(wishlistAtom);
	const toggleWishlist = useSetAtom(toggleWishlistAtom);

	// --- СТАНИ ---
	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [selectedImage, setSelectedImage] = useState(0);
	const [selectedColor, setSelectedColor] = useState(0);
	const [quantity, setQuantity] = useState(1);
	const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');
	const [toast, setToast] = useState<string | null>(null);

	// Стан для відгуків (локальний)
	const [reviewsList, setReviewsList] = useState(MOCK_REVIEWS);
	const [newReviewUser, setNewReviewUser] = useState('');
	const [newReviewText, setNewReviewText] = useState('');
	const [newReviewRating, setNewReviewRating] = useState(0);
	const [hoverRating, setHoverRating] = useState(0);

	// --- ЗАВАНТАЖЕННЯ ДАНИХ ---
	useEffect(() => {
		const fetchProduct = async () => {
			setLoading(true);
			try {
				// Запит на сервер по SLUG
				const response = await fetch(`http://localhost:5000/api/products/slug/${slug}`);

				if (!response.ok) {
					throw new Error('Товар не знайдено');
				}

				const data = await response.json();
				setProduct(data);

				// Якщо у товара немає SKU в базі, генеруємо фейковий для краси
				if (!data.sku) data.sku = `TZ-${data.id.toString().padStart(6, '0')}`;

			} catch (err) {
				console.error(err);
				setError('Не вдалося завантажити товар');
			} finally {
				setLoading(false);
			}
		};

		if (slug) fetchProduct();
	}, [slug]);

	// --- ЛОГІКА ---

	const isInWishlist = (productId: number) => wishlistItems.some(item => item.id === productId);

	const showToast = (msg: string) => {
		setToast(msg);
		setTimeout(() => setToast(null), 3000);
	};

	const handleQuantityChange = (type: 'inc' | 'dec') => {
		if (type === 'dec' && quantity > 1) setQuantity(prev => prev - 1);
		if (type === 'inc' && quantity < 10) setQuantity(prev => prev + 1);
	};

	const handleAddToCart = () => {
		if (!product) return;

		// Безпечне отримання назви кольору
		let colorName = 'Default';
		if (product.colors && Array.isArray(product.colors) && product.colors[selectedColor]) {
			colorName = product.colors[selectedColor].name || product.colors[selectedColor].hex;
		}

		addToCart({
			id: product.id,
			name: product.name,
			price: product.price,
			image: product.image, // Головне фото для кошика
			quantity: quantity,
			selectedColor: colorName
		});
		showToast(`Додано в кошик: ${quantity} шт.`);
	};

	const handleToggleWishlist = () => {
		if (!product) return;

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
			showToast('Додано до списку бажань');
		} else {
			showToast('Видалено зі списку бажань');
		}
	};

	const handleSubmitReview = (e: React.FormEvent) => {
		e.preventDefault();
		if (!newReviewUser.trim() || !newReviewText.trim() || newReviewRating === 0) {
			showToast('Будь ласка, заповніть всі поля та поставте оцінку');
			return;
		}

		const newReview = {
			id: Date.now(),
			user: newReviewUser,
			rating: newReviewRating,
			text: newReviewText,
			date: new Date().toLocaleDateString('uk-UA')
		};

		setReviewsList([newReview, ...reviewsList]);
		setNewReviewUser('');
		setNewReviewText('');
		setNewReviewRating(0);
		showToast('Дякуємо за ваш відгук!');
	};

	// --- RENDER LOADING / ERROR ---
	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-slate-50">
				<Loader2 className="w-12 h-12 text-sky-500 animate-spin" />
			</div>
		);
	}

	if (error || !product) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
				<div className="bg-rose-50 p-4 rounded-full">
					<X className="w-8 h-8 text-rose-500" />
				</div>
				<h2 className="text-xl font-bold text-slate-800">Товар не знайдено</h2>
				<button onClick={() => navigate('/catalog')} className="px-6 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-700 transition-colors">
					Повернутися в каталог
				</button>
			</div>
		);
	}

	// Безпечний доступ до specs та colors (якщо раптом null)
	const specsList = Array.isArray(product.specs) ? product.specs : product.specs ? Object.entries(product.specs).map(([k, v]) => ({ label: k, value: v })) : [];
	const colorsList = Array.isArray(product.colors) ? product.colors : [];
	// Якщо масив картинок порожній, використовуємо головну
	const displayImages = (product.images && product.images.length > 0) ? product.images : [product.image];

	return (
		<div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20">

			{/* --- TOAST --- */}
			{toast && (
				<div className="fixed top-24 right-4 z-50 animate-in slide-in-from-right duration-300">
					<div className="bg-slate-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700">
						<div className="bg-green-500 rounded-full p-1">
							<CheckCircle size={16} className="text-white" />
						</div>
						<span className="font-medium text-sm">{toast}</span>
					</div>
				</div>
			)}

			{/* --- HEADER BREADCRUMBS --- */}
			<div className="bg-white border-b border-slate-200">
				<div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-sky-600 transition-colors text-sm font-medium mb-4">
						<ArrowLeft size={16} /> Назад
					</button>
					<div className="flex items-center gap-2 text-sm text-slate-400 overflow-hidden whitespace-nowrap">
						<Link to="/" className="hover:text-slate-600">Головна</Link>
						<ChevronRight size={14} />
						<Link to="/catalog" className="hover:text-slate-600">Каталог</Link>
						<ChevronRight size={14} />
						<span className="hover:text-slate-600 cursor-pointer">{product.category}</span>
						<ChevronRight size={14} />
						<span className="text-slate-900 font-medium truncate">{product.name}</span>
					</div>
				</div>
			</div>

			<div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

				{/* --- PRODUCT GRID --- */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

					{/* LEFT: Images */}
					<div className="space-y-4">
						<div className="bg-white rounded-3xl border border-slate-200 p-8 h-[400px] sm:h-[500px] flex items-center justify-center relative group">

							{/* WISHLIST BUTTON */}
							<button
								onClick={handleToggleWishlist}
								className={`absolute top-4 right-4 p-2.5 rounded-full transition-all duration-300 shadow-sm ${isInWishlist(product.id)
									? 'bg-rose-50 text-rose-500 scale-110'
									: 'bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50'
									}`}
								title={isInWishlist(product.id) ? "Видалити з бажаного" : "Додати в бажане"}
							>
								<Heart size={24} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
							</button>

							<img
								src={displayImages[selectedImage]}
								alt={product.name}
								className="w-full h-full object-contain mix-blend-multiply transition-all duration-500 group-hover:scale-105"
							/>
						</div>

						{displayImages.length > 1 && (
							<div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
								{displayImages.map((img: string, idx: number) => (
									<button
										key={idx}
										onClick={() => setSelectedImage(idx)}
										className={`bg-white rounded-xl border-2 p-2 h-20 sm:h-24 flex items-center justify-center transition-all ${selectedImage === idx ? 'border-sky-500 shadow-md scale-95 ring-2 ring-sky-100' : 'border-slate-100 hover:border-slate-300'}`}
									>
										<img src={img} alt="Thumbnail" className="w-full h-full object-contain" />
									</button>
								))}
							</div>
						)}
					</div>

					{/* RIGHT: Info */}
					<div className="flex flex-col">
						<div className="mb-6">
							<div className="flex items-center justify-between mb-2">
								<span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${product.inStock ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-600'}`}>
									{product.inStock ? 'В наявності' : 'Закінчився'}
								</span>
								{product.sku && <span className="text-slate-400 text-sm">Код: {product.sku}</span>}
							</div>
							<h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 leading-tight">{product.name}</h1>
							<div className="flex items-center gap-4">
								<div className="flex items-center gap-1 text-amber-400">
									{[...Array(5)].map((_, i) => (
										<Star key={i} size={18} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} className={i >= Math.floor(product.rating) ? "text-slate-300" : ""} />
									))}
								</div>
								<button
									onClick={() => setActiveTab('reviews')}
									className="text-sm font-medium text-slate-500 underline decoration-slate-300 underline-offset-4 cursor-pointer hover:text-sky-600 transition-colors"
								>
									{reviewsList.length} відгуків
								</button>
							</div>
						</div>

						<div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-8">
							<div className="flex items-end gap-3 mb-6">
								<span className="text-4xl font-black text-slate-900">{product.price.toLocaleString()} <span className="text-2xl text-slate-500">₴</span></span>
								{product.oldPrice && <span className="text-lg text-slate-400 line-through mb-1">{product.oldPrice.toLocaleString()} ₴</span>}
							</div>

							<div className="space-y-6">
								{/* Colors */}
								{colorsList.length > 0 && (
									<div>
										<span className="text-sm font-bold text-slate-700 block mb-3">
											Колір: <span className="text-slate-500 font-normal">{colorsList[selectedColor]?.name || 'Стандарт'}</span>
										</span>
										<div className="flex gap-3">
											{colorsList.map((color: any, idx: number) => (
												<button
													key={idx}
													onClick={() => setSelectedColor(idx)}
													className={`w-10 h-10 rounded-full shadow-sm ring-2 ring-offset-2 transition-all ${selectedColor === idx ? 'ring-sky-500 scale-110' : 'ring-transparent hover:ring-slate-300'}`}
													style={{ backgroundColor: color.hex || color, border: (color.hex === '#ffffff' || color === '#ffffff') ? '1px solid #e2e8f0' : 'none' }}
													title={color.name}
												/>
											))}
										</div>
									</div>
								)}

								<div className="h-px bg-slate-100" />

								<div className="flex flex-col sm:flex-row gap-4">
									<div className="flex items-center bg-slate-100 rounded-xl p-1 w-fit">
										<button onClick={() => handleQuantityChange('dec')} className="p-3 text-slate-500 hover:bg-white hover:text-slate-900 rounded-lg transition-all disabled:opacity-50"><Minus size={18} /></button>
										<span className="w-12 text-center font-bold text-lg">{quantity}</span>
										<button onClick={() => handleQuantityChange('inc')} className="p-3 text-slate-500 hover:bg-white hover:text-slate-900 rounded-lg transition-all"><Plus size={18} /></button>
									</div>
									<button
										onClick={handleAddToCart}
										disabled={!product.inStock}
										className="flex-1 bg-slate-900 text-white font-bold text-lg py-3 px-8 rounded-xl hover:bg-sky-500 hover:shadow-lg hover:shadow-sky-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
										<ShoppingCart size={20} /> {product.inStock ? 'Купити' : 'Немає'}
									</button>
									<button className="p-4 rounded-xl border-2 border-slate-200 text-slate-400 hover:border-slate-900 hover:text-slate-900 transition-all"><Share2 size={20} /></button>
								</div>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-slate-100">
								<Truck className="text-sky-500 shrink-0" size={24} />
								<div><h4 className="font-bold text-sm text-slate-900">Безкоштовна доставка</h4><p className="text-xs text-slate-500 mt-0.5">Для замовлень від 2000 ₴</p></div>
							</div>
							<div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-slate-100">
								<ShieldCheck className="text-sky-500 shrink-0" size={24} />
								<div><h4 className="font-bold text-sm text-slate-900">Гарантія 12 міс.</h4><p className="text-xs text-slate-500 mt-0.5">Офіційна від виробника</p></div>
							</div>
							<div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-slate-100">
								<RefreshCw className="text-sky-500 shrink-0" size={24} />
								<div><h4 className="font-bold text-sm text-slate-900">Повернення</h4><p className="text-xs text-slate-500 mt-0.5">Протягом 14 днів</p></div>
							</div>
						</div>
					</div>
				</div>

				{/* --- TABS --- */}
				<div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
					<div className="flex border-b border-slate-200 overflow-x-auto">
						{['desc', 'specs', 'reviews'].map((tab) => (
							<button
								key={tab}
								onClick={() => setActiveTab(tab as any)}
								className={`px-8 py-5 font-bold text-sm uppercase tracking-wide transition-all relative whitespace-nowrap ${activeTab === tab ? 'text-sky-600' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
							>
								{tab === 'desc' && 'Опис'}
								{tab === 'specs' && 'Характеристики'}
								{tab === 'reviews' && `Відгуки (${reviewsList.length})`}
								{activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-500" />}
							</button>
						))}
					</div>

					<div className="p-8 lg:p-12 min-h-[300px]">
						{activeTab === 'desc' && (
							<div className="prose prose-slate max-w-none animate-in fade-in duration-300">
								<h3 className="text-xl font-bold mb-4">Про товар {product.name}</h3>
								<p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">{product.description}</p>
							</div>
						)}

						{activeTab === 'specs' && (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 animate-in fade-in duration-300">
								{specsList.map((spec: any, idx: number) => (
									<div key={idx} className="flex justify-between py-3 border-b border-slate-100 last:border-0">
										<span className="text-slate-500 font-medium capitalize">{spec.label || Object.keys(spec)[0]}</span>
										<span className="text-slate-900 font-bold text-right">{spec.value || Object.values(spec)[0] as string}</span>
									</div>
								))}
								{specsList.length === 0 && <p className="text-slate-400">Характеристики відсутні</p>}
							</div>
						)}

						{activeTab === 'reviews' && (
							<div className="animate-in fade-in duration-300 grid grid-cols-1 lg:grid-cols-3 gap-12">
								{/* Список відгуків */}
								<div className="lg:col-span-2 space-y-6">
									<h3 className="text-xl font-bold text-slate-900 mb-6">Відгуки покупців</h3>
									{reviewsList.length > 0 ? (
										reviewsList.map((review) => (
											<div key={review.id} className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
												<div className="flex items-center justify-between mb-3">
													<div className="flex items-center gap-3">
														<div className="w-10 h-10 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center font-bold">
															{review.user.charAt(0).toUpperCase()}
														</div>
														<div>
															<h4 className="font-bold text-slate-900">{review.user}</h4>
															<div className="flex text-amber-400 text-xs mt-0.5">
																{[...Array(5)].map((_, i) => (
																	<Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} className={i >= review.rating ? "text-slate-300" : ""} />
																))}
															</div>
														</div>
													</div>
													<span className="text-xs text-slate-400">{review.date}</span>
												</div>
												<p className="text-slate-600 leading-relaxed">{review.text}</p>
											</div>
										))
									) : (
										<div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
											<p className="text-slate-500">Ще немає відгуків. Будьте першим!</p>
										</div>
									)}
								</div>

								{/* Форма додавання відгуку */}
								<div className="lg:col-span-1">
									<div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
										<h3 className="text-lg font-bold text-slate-900 mb-4">Залишити відгук</h3>
										<form onSubmit={handleSubmitReview} className="space-y-4">
											<div className="flex flex-col gap-1.5">
												<label className="text-sm font-bold text-slate-700">Ваша оцінка</label>
												<div className="flex gap-1">
													{[1, 2, 3, 4, 5].map((star) => (
														<button
															key={star}
															type="button"
															onMouseEnter={() => setHoverRating(star)}
															onMouseLeave={() => setHoverRating(0)}
															onClick={() => setNewReviewRating(star)}
															className="focus:outline-none transition-transform hover:scale-110"
														>
															<Star
																size={24}
																className={star <= (hoverRating || newReviewRating) ? "text-amber-400 fill-amber-400" : "text-slate-300"}
															/>
														</button>
													))}
												</div>
											</div>

											<div className="flex flex-col gap-1.5">
												<label className="text-sm font-bold text-slate-700">Ваше ім'я</label>
												<div className="relative">
													<input
														type="text"
														value={newReviewUser}
														onChange={(e) => setNewReviewUser(e.target.value)}
														placeholder="Іван Іванов"
														className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all text-sm"
													/>
													<User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
												</div>
											</div>

											<div className="flex flex-col gap-1.5">
												<label className="text-sm font-bold text-slate-700">Коментар</label>
												<textarea
													rows={4}
													value={newReviewText}
													onChange={(e) => setNewReviewText(e.target.value)}
													placeholder="Розкажіть про свої враження..."
													className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all text-sm resize-none"
												/>
											</div>

											<button
												type="submit"
												className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-sky-500 transition-colors shadow-lg shadow-slate-200 hover:shadow-sky-200"
											>
												Надіслати відгук
											</button>
										</form>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>

			</div>
		</div>
	);
};

export default ProductPage;