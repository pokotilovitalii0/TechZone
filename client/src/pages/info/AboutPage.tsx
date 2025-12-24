import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Users, Award, TrendingUp } from 'lucide-react';

const AboutPage = () => {
	return (
		<div className="min-h-screen bg-slate-50 py-12">
			<div className="container mx-auto px-4 max-w-5xl">

				{/* Hero Section */}
				<div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
					<h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-6">
						Ми — Tech<span className="text-sky-500">Zone</span>
					</h1>
					<p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
						Не просто магазин, а спільнота геймерів та ентузіастів. Ми допомагаємо створити ідеальне робоче та ігрове місце.
					</p>
				</div>

				{/* Stats Grid */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
					{[
						{ icon: Users, label: 'Задоволених клієнтів', value: '10,000+' },
						{ icon: Award, label: 'Років на ринку', value: '5' },
						{ icon: CheckCircle, label: 'Оригінальних товарів', value: '100%' },
						{ icon: TrendingUp, label: 'Щоденних замовлень', value: '150+' },
					].map((stat, idx) => (
						<div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center hover:border-sky-200 transition-colors">
							<div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center mx-auto mb-4">
								<stat.icon size={24} />
							</div>
							<div className="text-3xl font-black text-slate-900 mb-1">{stat.value}</div>
							<div className="text-sm text-slate-500 font-medium">{stat.label}</div>
						</div>
					))}
				</div>

				{/* Story Section */}
				<div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col md:flex-row mb-20">
					<div className="md:w-1/2 bg-slate-900 p-12 flex items-center justify-center text-white">
						<div>
							<h2 className="text-3xl font-bold mb-6">Наша місія</h2>
							<p className="text-slate-300 leading-relaxed text-lg mb-6">
								Ми віримо, що правильний девайс може змінити хід гри. Наша мета — надати українським геймерам доступ до найкращого світового обладнання за чесними цінами.
							</p>
							<p className="text-slate-300 leading-relaxed text-lg">
								Кожен товар у нашому каталозі перевірений нами особисто. Ми не продаємо те, чим не користувалися б самі.
							</p>
						</div>
					</div>
					<div className="md:w-1/2 relative min-h-[300px]">
						<img
							src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop"
							alt="Team working"
							className="absolute inset-0 w-full h-full object-cover"
						/>
					</div>
				</div>

				{/* CTA */}
				<div className="text-center">
					<h2 className="text-2xl font-bold text-slate-900 mb-6">Готові оновити свій сетап?</h2>
					<Link to="/catalog" className="inline-flex bg-slate-900 text-white font-bold py-4 px-8 rounded-xl hover:bg-sky-500 transition-all shadow-lg hover:shadow-sky-500/30">
						Перейти до каталогу
					</Link>
				</div>
			</div>
		</div>
	);
};

export default AboutPage;