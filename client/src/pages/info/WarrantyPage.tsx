import React from 'react';
import { ShieldCheck, FileText, PenTool, AlertTriangle } from 'lucide-react';

const WarrantyPage = () => {
	return (
		<div className="min-h-screen bg-slate-50 py-12">
			<div className="container mx-auto px-4 max-w-4xl">
				<h1 className="text-4xl font-black text-slate-900 mb-8">Гарантія</h1>

				{/* Main Info */}
				<div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm mb-8">
					<div className="flex items-start gap-4 mb-6">
						<div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center shrink-0">
							<ShieldCheck size={24} />
						</div>
						<div>
							<h2 className="text-2xl font-bold text-slate-900 mb-2">Офіційна гарантія</h2>
							<p className="text-slate-600 leading-relaxed">
								На всі товари, придбані в магазині TechZone, надається гарантія, яка підтверджує зобов'язання по відсутності заводських дефектів. Термін гарантії вказаний в описі кожного товару та складає від 12 до 36 місяців.
							</p>
						</div>
					</div>

					<div className="h-px bg-slate-100 my-6" />

					<h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
						<FileText className="text-sky-500" size={20} /> Що потрібно для звернення?
					</h3>
					<ul className="space-y-3 text-slate-600 list-disc list-inside marker:text-sky-500">
						<li>Гарантійний талон (або чек) з датою продажу.</li>
						<li>Товар у повній комплектації.</li>
						<li>Оригінальна упаковка (бажано).</li>
					</ul>
				</div>

				{/* Service Centers */}
				<div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm mb-8">
					<h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
						<PenTool className="text-sky-500" size={20} /> Куди звертатися?
					</h3>
					<p className="text-slate-600 mb-4">
						Гарантійне обслуговування здійснюють авторизовані сервісні центри виробників. Адреси та телефони сервісних центрів ви можете знайти на гарантійному талоні або на офіційному сайті виробника.
					</p>
					<p className="text-slate-600">
						Також ви можете звернутися до нашого сервісного відділу за адресою: <span className="font-bold text-slate-900">м. Київ, вул. Хрещатик, 1.</span>
					</p>
				</div>

				{/* Exceptions */}
				<div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex gap-4">
					<AlertTriangle className="text-amber-500 shrink-0" size={24} />
					<div>
						<h4 className="font-bold text-amber-900 mb-2">Гарантія не надається, якщо:</h4>
						<ul className="space-y-1 text-sm text-amber-800/80">
							<li>• Порушено цілісність гарантійних пломб.</li>
							<li>• Є механічні або інші пошкодження, що виникли внаслідок умисних або необережних дій покупця.</li>
							<li>• Порушено правила використання, викладені в експлуатаційних документах.</li>
							<li>• Було несанкціоноване розкриття, ремонт або зміна внутрішніх комунікацій та компонентів.</li>
						</ul>
					</div>
				</div>

			</div>
		</div>
	);
};

export default WarrantyPage;