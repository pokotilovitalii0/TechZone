import React from 'react';
import { RefreshCw, Check, XCircle, HelpCircle } from 'lucide-react';

const ReturnsPage = () => {
	return (
		<div className="min-h-screen bg-slate-50 py-12">
			<div className="container mx-auto px-4 max-w-4xl">
				<h1 className="text-4xl font-black text-slate-900 mb-8">Повернення товару</h1>

				<div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm mb-8">
					<div className="flex items-center gap-4 mb-6">
						<div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center shrink-0">
							<RefreshCw size={24} />
						</div>
						<div>
							<h2 className="text-2xl font-bold text-slate-900">14 днів на повернення</h2>
							<p className="text-slate-500">Згідно із Законом України «Про захист прав споживачів»</p>
						</div>
					</div>

					<p className="text-slate-600 leading-relaxed mb-6">
						Ви можете повернути або обміняти товар протягом 14 днів з моменту покупки. Це право гарантує вам можливість переконатися, що товар вам підходить і відповідає очікуванням.
					</p>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="bg-green-50 p-6 rounded-xl border border-green-100">
							<h3 className="font-bold text-green-800 mb-4 flex items-center gap-2">
								<Check size={20} /> Умови повернення
							</h3>
							<ul className="space-y-2 text-sm text-green-700">
								<li>• Товар не був у вживанні і не має слідів використання (подряпин, сколів, потертостей).</li>
								<li>• Товар повністю укомплектований і не порушена цілісність упаковки.</li>
								<li>• Збережені всі ярлики і заводське маркування.</li>
								<li>• Збережено розрахунковий документ (чек).</li>
							</ul>
						</div>

						<div className="bg-rose-50 p-6 rounded-xl border border-rose-100">
							<h3 className="font-bold text-rose-800 mb-4 flex items-center gap-2">
								<XCircle size={20} /> Не підлягають поверненню
							</h3>
							<ul className="space-y-2 text-sm text-rose-700">
								<li>• Товари, що були у використанні.</li>
								<li>• Товари з пошкодженою упаковкою або неповною комплектацією.</li>
								<li>• Вироби сангігієни та інші товари, визначені Постановою Кабінету Міністрів України.</li>
							</ul>
						</div>
					</div>
				</div>

				<div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
					<h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
						<HelpCircle className="text-sky-500" /> Як оформити повернення?
					</h3>
					<ol className="space-y-4 text-slate-600 list-decimal list-inside marker:font-bold marker:text-slate-900">
						<li>Переконайтеся, що товар відповідає умовам повернення.</li>
						<li>Зв'яжіться з нашим менеджером за телефоном або в месенджерах.</li>
						<li>Заповніть заяву на повернення (бланк надасть менеджер).</li>
						<li>Відправте товар нам «Новою Поштою» або принесіть у шоурум.</li>
						<li>Отримайте кошти на карту протягом 3-7 банківських днів після перевірки товару.</li>
					</ol>
				</div>
			</div>
		</div>
	);
};

export default ReturnsPage;