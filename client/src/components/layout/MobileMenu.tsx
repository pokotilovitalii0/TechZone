import { Link } from 'react-router-dom';
import { X, ChevronRight, LogIn, ShoppingCart } from 'lucide-react';
import { useAtom } from 'jotai';
import { isMobileMenuOpenAtom } from '../../store/uiAtoms'; // Імпорт твого атома
import logoImg from '@/assets/logo/logo.png';

// Дублюємо навігацію або виносимо її в окремий файл констант (краще винести)
const NAV_ITEMS = [
	{ label: 'Каталог', path: '/catalog' },
	{ label: 'Миші', path: '/catalog/mice' },
	{ label: 'Клавіатури', path: '/catalog/keyboards' },
	{ label: 'Аудіо', path: '/catalog/audio' },
	{ label: 'Аксесуари', path: '/catalog/accessories' },
];

const MobileMenu = () => {
	// useAtom дає і значення, і функцію зміни (як useState)
	const [isOpen, setIsOpen] = useAtom(isMobileMenuOpenAtom);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-[100] lg:hidden">
			{/* 1. Затенення фону (Backdrop) */}
			<div
				className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
				onClick={() => setIsOpen(false)} // Закриваємо при кліку на фон
			/>

			{/* 2. Сама панель меню (Drawer) */}
			<div className="absolute top-0 right-0 h-full w-[280px] bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

				{/* Header меню */}
				<div className="p-5 border-b border-slate-100 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<img src={logoImg} alt="Logo" className="h-8 w-auto" />
						<span className="font-bold text-slate-900">Menu</span>
					</div>
					<button
						onClick={() => setIsOpen(false)}
						className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
					>
						<X size={24} />
					</button>
				</div>

				{/* Список посилань */}
				<div className="flex-1 overflow-y-auto py-4">
					<nav className="flex flex-col">
						{NAV_ITEMS.map((item) => (
							<Link
								key={item.path}
								to={item.path}
								onClick={() => setIsOpen(false)} // Закриваємо меню при переході
								className="px-6 py-4 text-slate-700 font-medium hover:bg-slate-50 hover:text-sky-500 flex items-center justify-between border-b border-slate-50 transition-colors"
							>
								{item.label}
								<ChevronRight size={16} className="text-slate-300" />
							</Link>
						))}
					</nav>
				</div>

				{/* Footer меню (Кнопки дій) */}
				<div className="p-5 border-t border-slate-100 bg-slate-50 space-y-3">
					<Link
						to="/cart"
						onClick={() => setIsOpen(false)}
						className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:border-slate-300 transition-all"
					>
						<ShoppingCart size={18} /> Кошик
					</Link>
					<Link
						to="/login"
						onClick={() => setIsOpen(false)}
						className="flex items-center justify-center gap-2 w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-sky-500 transition-all shadow-lg shadow-slate-200"
					>
						<LogIn size={18} /> Увійти
					</Link>
				</div>
			</div>
		</div>
	);
};

export default MobileMenu;