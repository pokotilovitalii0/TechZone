import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFoundPage = () => {
	const navigate = useNavigate();

	return (
		<div className="min-h-[80vh] flex items-center justify-center bg-slate-50 p-4">
			<div className="text-center max-w-lg w-full">

				{/* Visual Error Code */}
				<div className="relative">
					<h1 className="text-[150px] font-black text-slate-200 leading-none select-none">404</h1>
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100 rotate-[-10deg]">
						<span className="text-xl font-bold text-slate-900">Упс! 🙈</span>
					</div>
				</div>

				<h2 className="text-3xl font-black text-slate-900 mb-4 mt-[-20px] relative z-10">
					Сторінку не знайдено
				</h2>

				<p className="text-slate-500 text-lg mb-8 leading-relaxed">
					Схоже, ви намагаєтесь знайти девайс, який ще не винайшли, або сторінка була переміщена.
				</p>

				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<button
						onClick={() => navigate(-1)}
						className="px-8 py-3.5 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-white hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50 transition-all flex items-center justify-center gap-2"
					>
						<ArrowLeft size={20} /> Назад
					</button>

					<Link
						to="/"
						className="px-8 py-3.5 rounded-xl bg-slate-900 font-bold text-white hover:bg-sky-500 hover:shadow-lg hover:shadow-sky-500/30 transition-all flex items-center justify-center gap-2"
					>
						<Home size={20} /> На головну
					</Link>
				</div>

				{/* Quick Links */}
				<div className="mt-12 pt-12 border-t border-slate-200/60">
					<p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Можливо ви шукали</p>
					<div className="flex flex-wrap justify-center gap-3">
						{['Мишки', 'Клавіатури', 'Навушники', 'Аксесуари'].map((cat) => (
							<Link
								key={cat}
								to={`/catalog/${cat === 'Аксесуари' ? 'accessories' : cat === 'Мишки' ? 'mice' : cat === 'Клавіатури' ? 'keyboards' : 'audio'}`}
								className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:border-sky-500 hover:text-sky-500 transition-colors"
							>
								{cat}
							</Link>
						))}
					</div>
				</div>

			</div>
		</div>
	);
};

export default NotFoundPage;