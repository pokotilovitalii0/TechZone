import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAtom, useAtomValue } from 'jotai';
import { cartAtom, cartTotalPriceAtom } from '../../store/cartAtoms';
import { userAtom } from '../../store/authAtoms';
import { ArrowLeft, CheckCircle, Truck, CreditCard, Banknote, MapPin, User, Phone, Loader2 } from 'lucide-react';

const CheckoutPage = () => {
	const navigate = useNavigate();

	// Atoms
	const [cartItems, setCartItems] = useAtom(cartAtom);
	const totalPrice = useAtomValue(cartTotalPriceAtom);
	const [user] = useAtom(userAtom); // Читаємо юзера, але він необов'язковий

	// States
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		phone: '',
		city: '',
		warehouse: '',
		paymentMethod: 'card',
		deliveryMethod: 'nova_poshta'
	});

	const [isSuccess, setIsSuccess] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	// 1. Якщо кошик порожній, повертаємо назад
	useEffect(() => {
		if (cartItems.length === 0 && !isSuccess) {
			navigate('/catalog');
		}
	}, [cartItems, isSuccess, navigate]);

	// 2. Автозаповнення (тільки якщо юзер увійшов)
	useEffect(() => {
		if (user) {
			const names = (user.name || '').split(' ');
			setFormData(prev => ({
				...prev,
				firstName: names[0] || '',
				lastName: names.slice(1).join(' ') || '',
				// Якщо у юзера збережена пошта, можна було б додати, але у формі її немає
			}));
		}
	}, [user]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// --- ВИДАЛЕНО ПЕРЕВІРКУ НА !USER ---
		// Тепер дозволяємо йти далі навіть без акаунта

		setIsLoading(true);

		try {
			const token = localStorage.getItem('token');
			const fullAddress = `${formData.city}, ${formData.deliveryMethod === 'nova_poshta' ? 'Відділення ' + formData.warehouse : formData.warehouse}`;
			const fullName = `${formData.firstName} ${formData.lastName}`;

			// Формуємо заголовки
			const headers: HeadersInit = {
				'Content-Type': 'application/json',
			};

			// Додаємо токен ТІЛЬКИ якщо він є (користувач залогінений)
			if (token && user) {
				headers['Authorization'] = `Bearer ${token}`;
			}

			const response = await fetch('http://localhost:5000/api/orders', {
				method: 'POST',
				headers: headers,
				body: JSON.stringify({
					items: cartItems,
					total: totalPrice,
					contactInfo: {
						name: fullName,
						phone: formData.phone,
						address: fullAddress
					}
				})
			});

			if (!response.ok) {
				throw new Error('Не вдалося створити замовлення');
			}

			// Успіх
			setIsSuccess(true);
			setCartItems([]); // Очищаємо кошик
			window.scrollTo(0, 0);

		} catch (error) {
			console.error(error);
			alert('Помилка при оформленні. Спробуйте ще раз.');
		} finally {
			setIsLoading(false);
		}
	};

	// --- ЕКРАН УСПІХУ ---
	if (isSuccess) {
		return (
			<div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
				<div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center animate-in zoom-in duration-300">
					<div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
						<CheckCircle className="text-green-500 w-10 h-10" />
					</div>
					<h2 className="text-3xl font-black text-slate-900 mb-2">Дякуємо!</h2>
					<p className="text-slate-500 mb-8">
						Ваше замовлення успішно оформлено. Ми зв'яжемося з вами найближчим часом для підтвердження.
					</p>
					<div className="space-y-3">
						{/* Показуємо кнопку профілю тільки якщо юзер залогінений */}
						{user ? (
							<button
								onClick={() => navigate('/profile')}
								className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-sky-500 transition-all shadow-lg hover:shadow-sky-200"
							>
								Переглянути замовлення
							</button>
						) : (
							<div className="text-sm text-slate-400 pb-2">
								Створіть акаунт, щоб відстежувати історію покупок.
							</div>
						)}

						<button
							onClick={() => navigate('/')}
							className="w-full bg-white text-slate-900 font-bold py-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all"
						>
							На головну
						</button>
					</div>
				</div>
			</div>
		);
	}

	if (cartItems.length === 0) return null;

	return (
		<div className="min-h-screen bg-slate-50 py-8 lg:py-12">
			<div className="container mx-auto px-4 max-w-6xl">

				{/* Хедер сторінки */}
				<div className="flex items-center justify-between mb-8">
					<div className="flex items-center gap-4">
						<button onClick={() => navigate(-1)} className="p-2 bg-white border border-slate-200 rounded-full hover:bg-slate-100 transition-colors">
							<ArrowLeft size={20} className="text-slate-600" />
						</button>
						<h1 className="text-2xl sm:text-3xl font-black text-slate-900">Оформлення замовлення</h1>
					</div>

					{/* Підказка для гостей */}
					{!user && (
						<Link to="/login" className="hidden sm:inline-flex text-sm text-sky-600 font-bold hover:underline">
							Увійти в акаунт
						</Link>
					)}
				</div>

				<form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

					{/* --- ЛІВА КОЛОНКА: ДАНІ --- */}
					<div className="lg:col-span-2 space-y-6">

						{/* 1. Контактні дані */}
						<div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
							<h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
								<span className="w-8 h-8 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center text-sm">1</span>
								Контактні дані
							</h3>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div className="space-y-1.5">
									<label className="text-sm font-bold text-slate-700 ml-1">Ім'я</label>
									<div className="relative">
										<User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
										<input
											required
											name="firstName"
											value={formData.firstName}
											onChange={handleChange}
											type="text"
											placeholder="Іван"
											className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all placeholder:text-slate-400"
										/>
									</div>
								</div>
								<div className="space-y-1.5">
									<label className="text-sm font-bold text-slate-700 ml-1">Прізвище</label>
									<input
										required
										name="lastName"
										value={formData.lastName}
										onChange={handleChange}
										type="text"
										placeholder="Іванов"
										className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all placeholder:text-slate-400"
									/>
								</div>
								<div className="space-y-1.5 sm:col-span-2">
									<label className="text-sm font-bold text-slate-700 ml-1">Телефон</label>
									<div className="relative">
										<Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
										<input
											required
											name="phone"
											value={formData.phone}
											onChange={handleChange}
											type="tel"
											placeholder="+380 99 123 45 67"
											className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all placeholder:text-slate-400"
										/>
									</div>
								</div>
							</div>
						</div>

						{/* 2. Доставка */}
						<div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
							<h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
								<span className="w-8 h-8 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center text-sm">2</span>
								Доставка
							</h3>

							{/* Вибір методу */}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
								<label className={`cursor-pointer border-2 rounded-xl p-4 flex items-center gap-3 transition-all ${formData.deliveryMethod === 'nova_poshta' ? 'border-sky-500 bg-sky-50' : 'border-slate-100 hover:border-slate-300'}`}>
									<input type="radio" name="deliveryMethod" value="nova_poshta" checked={formData.deliveryMethod === 'nova_poshta'} onChange={handleChange} className="hidden" />
									<div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.deliveryMethod === 'nova_poshta' ? 'border-sky-500' : 'border-slate-300'}`}>
										{formData.deliveryMethod === 'nova_poshta' && <div className="w-2.5 h-2.5 bg-sky-500 rounded-full" />}
									</div>
									<span className="font-bold text-slate-700">Нова Пошта</span>
									<Truck size={20} className="ml-auto text-slate-400" />
								</label>
								<label className={`cursor-pointer border-2 rounded-xl p-4 flex items-center gap-3 transition-all ${formData.deliveryMethod === 'courier' ? 'border-sky-500 bg-sky-50' : 'border-slate-100 hover:border-slate-300'}`}>
									<input type="radio" name="deliveryMethod" value="courier" checked={formData.deliveryMethod === 'courier'} onChange={handleChange} className="hidden" />
									<div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.deliveryMethod === 'courier' ? 'border-sky-500' : 'border-slate-300'}`}>
										{formData.deliveryMethod === 'courier' && <div className="w-2.5 h-2.5 bg-sky-500 rounded-full" />}
									</div>
									<span className="font-bold text-slate-700">Кур'єр</span>
									<MapPin size={20} className="ml-auto text-slate-400" />
								</label>
							</div>

							{/* Поля адреси */}
							<div className="space-y-4">
								<div className="space-y-1.5">
									<label className="text-sm font-bold text-slate-700 ml-1">Місто</label>
									<input
										required
										name="city"
										value={formData.city}
										onChange={handleChange}
										type="text"
										placeholder="Київ"
										className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all placeholder:text-slate-400"
									/>
								</div>
								{formData.deliveryMethod === 'nova_poshta' ? (
									<div className="space-y-1.5">
										<label className="text-sm font-bold text-slate-700 ml-1">Відділення</label>
										<select
											name="warehouse"
											value={formData.warehouse}
											onChange={handleChange}
											className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-sky-500 outline-none transition-all appearance-none cursor-pointer"
										>
											<option value="">Оберіть відділення...</option>
											<option value="1">Відділення №1</option>
											<option value="2">Відділення №2</option>
											<option value="3">Поштомат №5432</option>
										</select>
									</div>
								) : (
									<div className="space-y-1.5">
										<label className="text-sm font-bold text-slate-700 ml-1">Адреса (Вулиця, дім, кв.)</label>
										<input
											required
											name="warehouse"
											value={formData.warehouse}
											onChange={handleChange}
											type="text"
											placeholder="вул. Хрещатик, 1"
											className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all placeholder:text-slate-400"
										/>
									</div>
								)}
							</div>
						</div>

						{/* 3. Оплата */}
						<div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
							<h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
								<span className="w-8 h-8 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center text-sm">3</span>
								Оплата
							</h3>
							<div className="space-y-3">
								<label className={`cursor-pointer border-2 rounded-xl p-4 flex items-center gap-3 transition-all ${formData.paymentMethod === 'card' ? 'border-sky-500 bg-sky-50' : 'border-slate-100 hover:border-slate-300'}`}>
									<input type="radio" name="paymentMethod" value="card" checked={formData.paymentMethod === 'card'} onChange={handleChange} className="hidden" />
									<div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === 'card' ? 'border-sky-500' : 'border-slate-300'}`}>
										{formData.paymentMethod === 'card' && <div className="w-2.5 h-2.5 bg-sky-500 rounded-full" />}
									</div>
									<div>
										<div className="font-bold text-slate-900">Оплата карткою онлайн</div>
										<div className="text-xs text-slate-500">Apple Pay, Google Pay, Visa/Mastercard</div>
									</div>
									<CreditCard size={24} className="ml-auto text-slate-400" />
								</label>

								<label className={`cursor-pointer border-2 rounded-xl p-4 flex items-center gap-3 transition-all ${formData.paymentMethod === 'cod' ? 'border-sky-500 bg-sky-50' : 'border-slate-100 hover:border-slate-300'}`}>
									<input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleChange} className="hidden" />
									<div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === 'cod' ? 'border-sky-500' : 'border-slate-300'}`}>
										{formData.paymentMethod === 'cod' && <div className="w-2.5 h-2.5 bg-sky-500 rounded-full" />}
									</div>
									<div>
										<div className="font-bold text-slate-900">Оплата при отриманні</div>
										<div className="text-xs text-slate-500">Готівкою або карткою у відділенні</div>
									</div>
									<Banknote size={24} className="ml-auto text-slate-400" />
								</label>
							</div>
						</div>

					</div>

					{/* --- ПРАВА КОЛОНКА: ПІДСУМОК --- */}
					<div className="lg:col-span-1">
						<div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
							<h3 className="text-lg font-bold text-slate-900 mb-4">Ваше замовлення</h3>

							{/* Список міні-товарів */}
							<div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
								{cartItems.map((item) => (
									<div key={item.id} className="flex gap-3 items-center">
										<div className="w-16 h-16 bg-slate-50 rounded-lg flex items-center justify-center shrink-0">
											<img src={item.image} alt={item.name} className="w-12 h-12 object-contain mix-blend-multiply" />
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-bold text-slate-900 truncate">{item.name}</p>
											<p className="text-xs text-slate-500">{item.quantity} x {item.price} ₴</p>
										</div>
										<div className="font-bold text-sm text-slate-900">
											{item.price * item.quantity} ₴
										</div>
									</div>
								))}
							</div>

							<div className="border-t border-slate-100 pt-4 space-y-2 mb-6">
								<div className="flex justify-between text-sm text-slate-600">
									<span>Товари</span>
									<span className="font-bold">{totalPrice} ₴</span>
								</div>
								<div className="flex justify-between text-sm text-slate-600">
									<span>Доставка</span>
									<span className="font-bold text-sky-600">За тарифами перевізника</span>
								</div>
							</div>

							<div className="flex justify-between items-center mb-6 pt-4 border-t border-slate-100">
								<span className="font-bold text-slate-900 text-lg">До сплати</span>
								<span className="font-black text-2xl text-slate-900">{totalPrice} ₴</span>
							</div>

							<button
								type="submit"
								disabled={isLoading}
								className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-sky-500 hover:shadow-lg hover:shadow-sky-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
							>
								{isLoading ? (
									<Loader2 className="animate-spin w-5 h-5" />
								) : (
									'Підтвердити замовлення'
								)}
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default CheckoutPage;