import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Package, LogOut, MapPin, ChevronRight } from 'lucide-react';
import { useSetAtom, useAtom } from 'jotai';
import { isAuthenticatedAtom, userAtom } from '../../store/authAtoms';

const MOCK_ORDERS = [
	{ id: 'TR-8842', date: '24.11.2023', status: 'delivered', total: 5999, items: ['Logitech G Pro X'] },
	{ id: 'TR-1290', date: '10.11.2023', status: 'processing', total: 1499, items: ['SteelSeries QcK Heavy', 'Keychron Wrist Rest'] },
];

const ProfilePage = () => {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');

	// Jotai hooks
	const setIsAuthenticated = useSetAtom(isAuthenticatedAtom);
	const [user, setUser] = useAtom(userAtom);

	// Ініціалізуємо форму даними з атома або дефолтними
	const [userData, setUserData] = useState({
		name: user.name || 'Гість',
		email: user.email || 'guest@example.com',
		phone: '+380 99 123 45 67',
		address: 'м. Київ, відділення №1'
	});

	const handleLogout = () => {
		setIsAuthenticated(false);
		setUser({ name: '', email: '' });
		navigate('/login');
	};

	const handleSaveProfile = (e: React.FormEvent) => {
		e.preventDefault();
		// В реальному додатку тут був би API запит
		setUser({ ...user, name: userData.name, email: userData.email }); // Оновлюємо атом
		alert('Дані збережено!');
	};

	return (
		<div className="min-h-screen bg-slate-50 py-12">
			<div className="container mx-auto px-4 max-w-5xl">
				<h1 className="text-3xl font-black text-slate-900 mb-8">Особистий кабінет</h1>

				<div className="flex flex-col lg:flex-row gap-8">

					{/* --- ЛІВА КОЛОНКА: МЕНЮ --- */}
					<div className="lg:w-1/4">
						<div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden sticky top-24">

							<div className="p-6 border-b border-slate-100 flex items-center gap-4">
								<div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center font-bold text-lg uppercase">
									{userData.name.charAt(0)}
								</div>
								<div className="overflow-hidden">
									<p className="font-bold text-slate-900 truncate">{userData.name}</p>
									<p className="text-xs text-slate-500 truncate">{userData.email}</p>
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
										<div className="space-y-1.5">
											<label className="text-sm font-bold text-slate-700">Ім'я</label>
											<div className="relative">
												<User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
												<input type="text" value={userData.name} onChange={e => setUserData({ ...userData, name: e.target.value })} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-sky-500 outline-none transition-all" />
											</div>
										</div>
										<div className="space-y-1.5">
											<label className="text-sm font-bold text-slate-700">Email</label>
											<input type="email" disabled value={userData.email} className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed" />
										</div>
										<div className="space-y-1.5">
											<label className="text-sm font-bold text-slate-700">Телефон</label>
											<input type="tel" value={userData.phone} onChange={e => setUserData({ ...userData, phone: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-sky-500 outline-none transition-all" />
										</div>
										<div className="space-y-1.5">
											<label className="text-sm font-bold text-slate-700">Адреса доставки</label>
											<div className="relative">
												<MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
												<input type="text" value={userData.address} onChange={e => setUserData({ ...userData, address: e.target.value })} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-sky-500 outline-none transition-all" />
											</div>
										</div>
									</div>

									<div className="pt-4 border-t border-slate-100 flex justify-end">
										<button className="bg-slate-900 text-white font-bold py-3 px-8 rounded-xl hover:bg-sky-500 transition-colors shadow-lg shadow-slate-200">
											Зберегти зміни
										</button>
									</div>
								</form>
							</div>
						)}

						{activeTab === 'orders' && (
							<div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
								<h2 className="text-xl font-bold text-slate-900 mb-2">Історія замовлень</h2>

								{MOCK_ORDERS.map((order) => (
									<div key={order.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-sky-200 transition-colors group cursor-pointer">
										<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
											<div className="flex items-center gap-3">
												<div className="p-2 bg-slate-100 rounded-lg group-hover:bg-sky-100 group-hover:text-sky-600 transition-colors">
													<Package size={24} />
												</div>
												<div>
													<p className="font-bold text-slate-900">Замовлення #{order.id}</p>
													<p className="text-xs text-slate-500">від {order.date}</p>
												</div>
											</div>
											<div className="flex items-center gap-3">
												<span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
													}`}>
													{order.status === 'delivered' ? 'Доставлено' : 'В обробці'}
												</span>
												<span className="font-black text-lg text-slate-900">{order.total} ₴</span>
											</div>
										</div>

										<div className="pl-[52px]">
											<p className="text-sm text-slate-600 mb-1">{order.items.join(', ')}</p>
											<div className="flex items-center gap-1 text-sky-500 text-sm font-bold group-hover:translate-x-1 transition-transform mt-2">
												Детальніше <ChevronRight size={16} />
											</div>
										</div>
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

export default ProfilePage;