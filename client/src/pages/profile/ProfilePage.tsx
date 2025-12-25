import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Package, LogOut, MapPin, ChevronRight, Loader2, Phone } from 'lucide-react';
import { useAtom, useSetAtom } from 'jotai';
import { userAtom, logoutAtom } from '../../store/authAtoms';

// Типи для замовлень
interface OrderItem {
	id: number;
	quantity: number;
	price: number;
	product: {
		name: string;
		image: string;
		slug: string;
	};
}

interface Order {
	id: number;
	createdAt: string;
	status: string;
	total: number;
	items: OrderItem[];
}

const ProfilePage = () => {
	const navigate = useNavigate();

	const [user, setUserAtomData] = useAtom(userAtom);
	const logout = useSetAtom(logoutAtom);

	const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
	const [orders, setOrders] = useState<Order[]>([]);
	const [loadingOrders, setLoadingOrders] = useState(false);

	// --- СТАН ФОРМИ ---
	// Початково поля порожні, щоб не показувати "undefined" або фейкові дані
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '',
		address: ''
	});
	const [isSaving, setIsSaving] = useState(false);

	// 1. Перевірка авторизації
	useEffect(() => {
		if (!user) {
			navigate('/login');
		}
	}, [user, navigate]);

	// 2. Завантаження даних профілю з сервера
	useEffect(() => {
		const fetchProfile = async () => {
			const token = localStorage.getItem('token');
			if (!token) return;

			try {
				const response = await fetch('http://localhost:5000/api/user/profile', {
					headers: { 'Authorization': `Bearer ${token}` }
				});

				if (response.ok) {
					const data = await response.json();
					// Заповнюємо форму даними з бази
					setFormData({
						name: data.name || '',
						email: data.email || '',
						phone: data.phone || '',     // Якщо в базі null -> буде пустий рядок
						address: data.address || ''  // Якщо в базі null -> буде пустий рядок
					});
				}
			} catch (error) {
				console.error('Error fetching profile:', error);
			}
		};

		if (user) {
			// Встановлюємо початкові значення з атома (щоб ім'я з'явилось одразу)
			setFormData(prev => ({ ...prev, name: user.name, email: user.email }));
			// Потім довантажуємо решту з сервера
			fetchProfile();
		}
	}, [user]);

	// 3. Завантаження замовлень
	useEffect(() => {
		const fetchOrders = async () => {
			if (activeTab !== 'orders') return;

			setLoadingOrders(true);
			const token = localStorage.getItem('token');
			try {
				const response = await fetch('http://localhost:5000/api/user/orders', {
					headers: { 'Authorization': `Bearer ${token}` }
				});
				if (response.ok) {
					const data = await response.json();
					setOrders(data);
				}
			} catch (error) {
				console.error('Error fetching orders:', error);
			} finally {
				setLoadingOrders(false);
			}
		};

		fetchOrders();
	}, [activeTab]);

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	const handleSaveProfile = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSaving(true);
		const token = localStorage.getItem('token');

		try {
			const response = await fetch('http://localhost:5000/api/user/profile', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify({
					name: formData.name,
					phone: formData.phone,
					address: formData.address
				})
			});

			if (response.ok) {
				const updatedUser = await response.json();
				// Оновлюємо ім'я в глобальному стейті, щоб воно оновилось в хедері
				setUserAtomData(prev => prev ? { ...prev, name: updatedUser.name } : null);
				alert('Дані успішно збережено!');
			} else {
				alert('Помилка при збереженні');
			}
		} catch (error) {
			console.error('Error saving profile:', error);
			alert('Помилка з\'єднання');
		} finally {
			setIsSaving(false);
		}
	};

	if (!user) return null;

	return (
		<div className="min-h-screen bg-slate-50 py-12">
			<div className="container mx-auto px-4 max-w-5xl">
				<h1 className="text-3xl font-black text-slate-900 mb-8">Особистий кабінет</h1>

				<div className="flex flex-col lg:flex-row gap-8">

					{/* --- ЛІВА КОЛОНКА: МЕНЮ --- */}
					<div className="lg:w-1/4">
						<div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden sticky top-24">

							<div className="p-6 border-b border-slate-100 flex items-center gap-4">
								<div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center font-bold text-lg uppercase shrink-0">
									{formData.name ? formData.name.charAt(0) : <User size={20} />}
								</div>
								<div className="overflow-hidden">
									<p className="font-bold text-slate-900 truncate">{formData.name || 'Користувач'}</p>
									<p className="text-xs text-slate-500 truncate">{formData.email}</p>
								</div>
							</div>

							<nav className="p-2 space-y-1">
								<button
									onClick={() => setActiveTab('profile')}
									className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'profile' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
								>
									<User size={18} /> Особисті дані
								</button>
								<button
									onClick={() => setActiveTab('orders')}
									className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'orders' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'}`}
								>
									<Package size={18} /> Мої замовлення
								</button>
								<button
									onClick={handleLogout}
									className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-rose-500 hover:bg-rose-50 transition-colors mt-2"
								>
									<LogOut size={18} /> Вийти
								</button>
							</nav>
						</div>
					</div>

					{/* --- ПРАВА КОЛОНКА: КОНТЕНТ --- */}
					<div className="lg:w-3/4">

						{activeTab === 'profile' && (
							<div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
								<h2 className="text-xl font-bold text-slate-900 mb-6">Налаштування профілю</h2>
								<form onSubmit={handleSaveProfile} className="space-y-6">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

										{/* Name */}
										<div className="space-y-1.5">
											<label className="text-sm font-bold text-slate-700">Ім'я</label>
											<div className="relative">
												<User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
												<input
													type="text"
													value={formData.name}
													onChange={e => setFormData({ ...formData, name: e.target.value })}
													className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-sky-500 outline-none transition-all"
												/>
											</div>
										</div>

										{/* Email (Disabled) */}
										<div className="space-y-1.5">
											<label className="text-sm font-bold text-slate-700">Email</label>
											<input
												type="email"
												disabled
												value={formData.email}
												className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
											/>
										</div>

										{/* Phone */}
										<div className="space-y-1.5">
											<label className="text-sm font-bold text-slate-700">Телефон</label>
											<div className="relative">
												<Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
												<input
													type="tel"
													value={formData.phone}
													onChange={e => setFormData({ ...formData, phone: e.target.value })}
													placeholder="+380..."
													className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-sky-500 outline-none transition-all"
												/>
											</div>
										</div>

										{/* Address */}
										<div className="space-y-1.5">
											<label className="text-sm font-bold text-slate-700">Адреса доставки</label>
											<div className="relative">
												<MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
												<input
													type="text"
													value={formData.address}
													onChange={e => setFormData({ ...formData, address: e.target.value })}
													placeholder="Введіть адресу"
													className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-sky-500 outline-none transition-all"
												/>
											</div>
										</div>
									</div>

									<div className="pt-4 border-t border-slate-100 flex justify-end">
										<button
											type="submit"
											disabled={isSaving}
											className="bg-slate-900 text-white font-bold py-3 px-8 rounded-xl hover:bg-sky-500 transition-colors shadow-lg shadow-slate-200 flex items-center gap-2 disabled:opacity-70"
										>
											{isSaving ? <Loader2 className="animate-spin w-5 h-5" /> : 'Зберегти зміни'}
										</button>
									</div>
								</form>
							</div>
						)}

						{activeTab === 'orders' && (
							<div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
								<h2 className="text-xl font-bold text-slate-900 mb-2">Історія замовлень</h2>

								{loadingOrders ? (
									<div className="flex justify-center py-10"><Loader2 className="w-8 h-8 text-sky-500 animate-spin" /></div>
								) : orders.length === 0 ? (
									<div className="bg-white p-8 rounded-2xl border border-dashed border-slate-300 text-center text-slate-500">
										Ви ще нічого не замовляли
									</div>
								) : (
									orders.map((order) => (
										<div key={order.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-sky-200 transition-colors group">
											<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
												<div className="flex items-center gap-3">
													<div className="p-2 bg-slate-100 rounded-lg group-hover:bg-sky-100 group-hover:text-sky-600 transition-colors">
														<Package size={24} />
													</div>
													<div>
														<p className="font-bold text-slate-900">Замовлення #{order.id}</p>
														<p className="text-xs text-slate-500">
															від {new Date(order.createdAt).toLocaleDateString()}
														</p>
													</div>
												</div>
												<div className="flex items-center gap-3">
													<span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
														}`}>
														{order.status === 'delivered' ? 'Доставлено' :
															order.status === 'processing' ? 'В обробці' : order.status}
													</span>
													<span className="font-black text-lg text-slate-900">{order.total.toLocaleString()} ₴</span>
												</div>
											</div>

											<div className="pl-[52px]">
												{order.items.map((item, idx) => (
													<p key={idx} className="text-sm text-slate-600 mb-1 flex justify-between items-center border-b border-dashed border-slate-100 last:border-0 pb-1 last:pb-0">
														<span>{item.product.name} (x{item.quantity})</span>
														{/* Можна додати ціну за одиницю, якщо треба */}
													</p>
												))}
											</div>
										</div>
									))
								)}
							</div>
						)}

					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfilePage;