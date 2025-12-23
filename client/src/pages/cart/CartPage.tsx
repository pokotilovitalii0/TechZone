import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ArrowRight, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { cartAtom, cartTotalPriceAtom, removeFromCartAtom, updateQuantityAtom } from '../../store/cartAtoms';

const CartPage = () => {
	// Читаємо список товарів
	const [cartItems] = useAtom(cartAtom);
	// Читаємо загальну ціну
	const totalPrice = useAtomValue(cartTotalPriceAtom);

	// Отримуємо функції для зміни стану
	const removeFromCart = useSetAtom(removeFromCartAtom);
	const updateQuantity = useSetAtom(updateQuantityAtom);

	if (cartItems.length === 0) {
		return (
			<div className="min-h-[60vh] flex flex-col items-center justify-center bg-slate-50 px-4">
				<div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mb-6 text-slate-400">
					<ShoppingBag size={48} />
				</div>
				<h2 className="text-2xl font-bold text-slate-900 mb-2">Ваш кошик порожній</h2>
				<p className="text-slate-500 mb-8 text-center max-w-md">Схоже, ви ще нічого не додали. Перегляньте наш каталог, там багато цікавого!</p>
				<Link to="/catalog" className="bg-sky-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-sky-600 transition-colors flex items-center gap-2">
					<ArrowLeft size={20} /> Повернутися до покупок
				</Link>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-slate-50 py-12">
			<div className="container mx-auto px-4 max-w-6xl">
				<h1 className="text-3xl font-black text-slate-900 mb-8">Кошик <span className="text-slate-400 font-medium text-lg ml-2">({cartItems.length} товари)</span></h1>

				<div className="flex flex-col lg:flex-row gap-8">
					{/* Список товарів */}
					<div className="lg:w-2/3 space-y-4">
						{cartItems.map((item) => (
							<div key={item.id} className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-6 relative group">
								<button
									onClick={() => removeFromCart(item.id)}
									className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 transition-colors p-2"
									title="Видалити"
								>
									<Trash2 size={20} />
								</button>

								<div className="w-24 h-24 shrink-0 bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden">
									<img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
								</div>

								<div className="flex-1 text-center sm:text-left w-full">
									<h3 className="font-bold text-slate-900 text-lg mb-1 leading-tight pr-8">{item.name}</h3>
									{item.selectedColor && <p className="text-sm text-slate-500 mb-2">Колір: {item.selectedColor}</p>}
									<div className="font-black text-xl text-slate-900 sm:hidden mt-2">{item.price * item.quantity} ₴</div>
								</div>

								<div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
									<div className="flex items-center bg-slate-100 rounded-lg p-1">
										<button
											onClick={() => updateQuantity({ id: item.id, quantity: item.quantity - 1 })}
											className="p-2 text-slate-500 hover:bg-white hover:text-slate-900 rounded-md transition-all disabled:opacity-50"
										>
											<Minus size={16} />
										</button>
										<span className="text-black w-8 text-center font-bold text-sm">{item.quantity}</span>
										<button
											onClick={() => updateQuantity({ id: item.id, quantity: item.quantity + 1 })}
											className="p-2 text-slate-500 hover:bg-white hover:text-slate-900 rounded-md transition-all"
										>
											<Plus size={16} />
										</button>
									</div>
									<div className="font-black text-xl text-slate-900 hidden sm:block w-24 text-right">{item.price * item.quantity} ₴</div>
								</div>
							</div>
						))}
					</div>

					{/* Підсумок */}
					<div className="lg:w-1/3">
						<div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-24">
							<h3 className="text-xl font-bold text-slate-900 mb-6">Підсумок замовлення</h3>

							<div className="space-y-3 mb-6">
								<div className="flex justify-between text-slate-600">
									<span>Вартість товарів</span>
									<span className="font-bold">{totalPrice} ₴</span>
								</div>
								<div className="flex justify-between text-slate-600">
									<span>Доставка</span>
									<span className="font-bold text-sky-600">Безкоштовно</span>
								</div>
							</div>

							<div className="border-t border-slate-100 pt-4 mb-8">
								<div className="flex justify-between items-center">
									<span className="font-bold text-slate-900 text-lg">До сплати</span>
									<span className="font-black text-3xl text-slate-900">{totalPrice} ₴</span>
								</div>
							</div>

							<button className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-sky-500 hover:shadow-lg hover:shadow-sky-200 transition-all flex items-center justify-center gap-2">
								Оформити замовлення <ArrowRight size={20} />
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CartPage;