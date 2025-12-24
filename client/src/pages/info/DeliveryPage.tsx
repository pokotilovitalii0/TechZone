import React from 'react';
import { Truck, CreditCard, Banknote } from 'lucide-react';

const DeliveryPage = () => {
	return (
		<div className="min-h-screen bg-slate-50 py-12">
			<div className="container mx-auto px-4 max-w-4xl">
				<h1 className="text-4xl font-black text-slate-900 mb-8">Доставка та Оплата</h1>

				<div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm mb-8 space-y-6">
					<h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
						<Truck className="text-sky-500" /> Способи доставки
					</h2>
					<ul className="space-y-4">
						<li className="flex gap-4">
							<div className="w-2 h-2 mt-2 rounded-full bg-slate-300 shrink-0" />
							<div>
								<h4 className="font-bold text-slate-900">Нова Пошта (відділення)</h4>
								<p className="text-slate-600">Термін доставки: 1-3 дні. Вартість: за тарифами перевізника (безкоштовно від 2000 грн).</p>
							</div>
						</li>
						<li className="flex gap-4">
							<div className="w-2 h-2 mt-2 rounded-full bg-slate-300 shrink-0" />
							<div>
								<h4 className="font-bold text-slate-900">Кур'єр Нова Пошта</h4>
								<p className="text-slate-600">Адресна доставка до дверей.</p>
							</div>
						</li>
						<li className="flex gap-4">
							<div className="w-2 h-2 mt-2 rounded-full bg-slate-300 shrink-0" />
							<div>
								<h4 className="font-bold text-slate-900">Самовивіз</h4>
								<p className="text-slate-600">З нашого шоуруму в Києві (вул. Хрещатик, 1).</p>
							</div>
						</li>
					</ul>
				</div>

				<div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
					<h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
						<CreditCard className="text-sky-500" /> Способи оплати
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="p-4 border border-slate-100 rounded-xl bg-slate-50">
							<h4 className="font-bold text-slate-900 mb-2">Оплата карткою онлайн</h4>
							<p className="text-sm text-slate-500">Apple Pay, Google Pay, Visa/Mastercard без комісії.</p>
						</div>
						<div className="p-4 border border-slate-100 rounded-xl bg-slate-50">
							<h4 className="font-bold text-slate-900 mb-2">Післяплата</h4>
							<p className="text-sm text-slate-500">Оплата при отриманні у відділенні Нової Пошти.</p>
						</div>
						<div className="p-4 border border-slate-100 rounded-xl bg-slate-50">
							<h4 className="font-bold text-slate-900 mb-2">Оплата частинами</h4>
							<p className="text-sm text-slate-500">ПриватБанк та Monobank (до 4 платежів).</p>
						</div>
						<div className="p-4 border border-slate-100 rounded-xl bg-slate-50">
							<h4 className="font-bold text-slate-900 mb-2">Безготівковий розрахунок</h4>
							<p className="text-sm text-slate-500">Для юридичних осіб (з ПДВ).</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DeliveryPage;