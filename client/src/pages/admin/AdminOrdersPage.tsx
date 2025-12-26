import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { userAtom } from '../../store/authAtoms';
import { Package, CheckCircle, XCircle, Truck, Clock, Loader2, MapPin, Phone, User as UserIcon } from 'lucide-react';

interface OrderItem {
	id: number;
	quantity: number;
	price: number;
	product: {
		name: string;
		image: string;
	};
}

interface Order {
	id: number;
	createdAt: string;
	status: string;
	total: number;
	name: string;
	phone: string;
	address: string;
	items: OrderItem[];
}

const AdminOrdersPage = () => {
	const navigate = useNavigate();
	const user = useAtomValue(userAtom);
	const [orders, setOrders] = useState<Order[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [updatingId, setUpdatingId] = useState<number | null>(null);

	// Перевірка прав доступу
	useEffect(() => {
		// Якщо користувач не завантажився або він не адмін - редірект
		// (Тут проста перевірка, на сервері є дублююча перевірка токена)
		if (user && user.role !== 'ADMIN') {
			navigate('/');
		}
	}, [user, navigate]);

	const fetchOrders = async () => {
		const token = localStorage.getItem('token');
		try {
			const response = await fetch('http://localhost:5000/api/admin/orders', {
				headers: { 'Authorization': `Bearer ${token}` }
			});

			if (response.ok) {
				const data = await response.json();
				setOrders(data);
			} else {
				console.error("Failed to fetch orders");
			}
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (user?.role === 'ADMIN') {
			fetchOrders();
		}
	}, [user]);

	const handleStatusChange = async (orderId: number, newStatus: string) => {
		setUpdatingId(orderId);
		const token = localStorage.getItem('token');
		try {
			const response = await fetch(`http://localhost:5000/api/admin/orders/${orderId}/status`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				body: JSON.stringify({ status: newStatus })
			});

			if (response.ok) {
				// Оновлюємо локальний стейт, щоб не робити зайвий запит
				setOrders(orders.map(order =>
					order.id === orderId ? { ...order, status: newStatus } : order
				));
			}
		} catch (error) {
			alert('Помилка оновлення статусу');
		} finally {
			setUpdatingId(null);
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-slate-50">
				<Loader2 className="w-10 h-10 text-sky-500 animate-spin" />
			</div>
		);
	}

	if (!user || user.role !== 'ADMIN') return null;

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
			case 'cancelled': return 'bg-rose-100 text-rose-700 border-rose-200';
			case 'shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
			default: return 'bg-amber-100 text-amber-700 border-amber-200';
		}
	};

	const getStatusLabel = (status: string) => {
		switch (status) {
			case 'delivered': return 'Доставлено';
			case 'cancelled': return 'Скасовано';
			case 'shipped': return 'Відправлено';
			case 'processing': return 'В обробці';
			default: return status;
		}
	};

	return (
		<div className="min-h-screen bg-slate-50 py-12">
			<div className="container mx-auto px-4 max-w-6xl">
				<div className="flex items-center justify-between mb-8">
					<h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
						<Package size={32} className="text-sky-500" />
						Панель Адміністратора
					</h1>
					<div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm font-medium text-slate-600">
						Всього замовлень: <span className="text-slate-900 font-bold">{orders.length}</span>
					</div>
				</div>

				<div className="space-y-6">
					{orders.length === 0 ? (
						<div className="text-center py-20 text-slate-500 bg-white rounded-3xl border border-slate-200 border-dashed">
							Замовлень поки немає
						</div>
					) : (
						orders.map((order) => (
							<div key={order.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
								<div className="flex flex-col lg:flex-row gap-6">

									{/* Ліва колонка: Інфо про замовлення */}
									<div className="lg:w-1/3 space-y-4">
										<div className="flex items-center justify-between">
											<h3 className="font-bold text-lg text-slate-900">Замовлення #{order.id}</h3>
											<span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(order.status)}`}>
												{getStatusLabel(order.status)}
											</span>
										</div>

										<div className="text-sm text-slate-500 flex items-center gap-2">
											<Clock size={14} /> {new Date(order.createdAt).toLocaleString()}
										</div>

										<div className="p-4 bg-slate-50 rounded-xl space-y-2 text-sm border border-slate-100">
											<div className="flex items-start gap-3">
												<UserIcon size={16} className="text-slate-400 mt-0.5" />
												<span className="font-medium text-slate-900">{order.name || 'Гість'}</span>
											</div>
											<div className="flex items-start gap-3">
												<Phone size={16} className="text-slate-400 mt-0.5" />
												<span className="text-slate-700">{order.phone}</span>
											</div>
											<div className="flex items-start gap-3">
												<MapPin size={16} className="text-slate-400 mt-0.5" />
												<span className="text-slate-700 leading-tight">{order.address}</span>
											</div>
										</div>
									</div>

									{/* Центральна колонка: Товари */}
									<div className="lg:w-1/3 flex flex-col">
										<h4 className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-wider">Товари</h4>
										<div className="flex-1 space-y-3 overflow-y-auto max-h-[200px] pr-2 scrollbar-thin">
											{order.items.map((item) => (
												<div key={item.id} className="flex items-center gap-3">
													<div className="w-10 h-10 bg-slate-50 rounded-lg p-1 border border-slate-100 flex-shrink-0">
														<img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain mix-blend-multiply" />
													</div>
													<div className="flex-1 min-w-0">
														<p className="text-sm font-medium text-slate-900 truncate">{item.product.name}</p>
														<p className="text-xs text-slate-500">{item.quantity} x {item.price} ₴</p>
													</div>
												</div>
											))}
										</div>
										<div className="border-t border-slate-100 mt-4 pt-3 flex justify-between items-center">
											<span className="text-sm text-slate-500">Сума:</span>
											<span className="font-black text-lg text-slate-900">{order.total} ₴</span>
										</div>
									</div>

									{/* Права колонка: Керування */}
									<div className="lg:w-1/3 flex flex-col gap-2 border-l border-slate-100 lg:pl-6">
										<h4 className="text-xs font-bold text-slate-400 uppercase mb-1 tracking-wider">Змінити статус</h4>

										<button
											onClick={() => handleStatusChange(order.id, 'processing')}
											disabled={updatingId === order.id || order.status === 'processing'}
											className={`flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-xl transition-all ${order.status === 'processing' ? 'bg-amber-100 text-amber-800' : 'bg-white border border-slate-200 text-slate-600 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200'}`}
										>
											<Clock size={16} /> В обробці
										</button>

										<button
											onClick={() => handleStatusChange(order.id, 'shipped')}
											disabled={updatingId === order.id || order.status === 'shipped'}
											className={`flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-xl transition-all ${order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : 'bg-white border border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200'}`}
										>
											<Truck size={16} /> Відправлено
										</button>

										<button
											onClick={() => handleStatusChange(order.id, 'delivered')}
											disabled={updatingId === order.id || order.status === 'delivered'}
											className={`flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-xl transition-all ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-white border border-slate-200 text-slate-600 hover:bg-green-50 hover:text-green-700 hover:border-green-200'}`}
										>
											<CheckCircle size={16} /> Доставлено
										</button>

										<button
											onClick={() => handleStatusChange(order.id, 'cancelled')}
											disabled={updatingId === order.id || order.status === 'cancelled'}
											className={`flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-xl transition-all ${order.status === 'cancelled' ? 'bg-rose-100 text-rose-800' : 'bg-white border border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200'}`}
										>
											<XCircle size={16} /> Скасовано
										</button>

										{updatingId === order.id && (
											<div className="text-center mt-2 text-xs text-slate-400 flex justify-center items-center gap-2">
												<Loader2 className="w-3 h-3 animate-spin" /> Оновлення...
											</div>
										)}
									</div>
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
};

export default AdminOrdersPage;