import { Link } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu } from 'lucide-react';
import { useAtomValue, useSetAtom } from 'jotai'; // Хуки Jotai
import { cartTotalItemsAtom } from '../../store/cartAtoms'; // Атом кошика
import { isMobileMenuOpenAtom } from '../../store/uiAtoms'; // Атом UI
import MobileMenu from './MobileMenu'; // Компонент меню
import logoImg from '@/assets/logo/logo.png';

// Константа навігації (щоб легко змінювати пункти в одному місці)
const NAV_ITEMS = [
	{ label: 'Каталог', path: '/catalog' },
	{ label: 'Миші', path: '/catalog/mice' },
	{ label: 'Клавіатури', path: '/catalog/keyboards' },
	{ label: 'Аудіо', path: '/catalog/audio' },
	{ label: 'Аксесуари', path: '/catalog/accessories' },
];

const Header = () => {
	// 1. Читаємо кількість товарів (тільки значення)
	const totalItems = useAtomValue(cartTotalItemsAtom);

	// 2. Отримуємо функцію для відкриття мобільного меню
	const setIsMobileMenuOpen = useSetAtom(isMobileMenuOpenAtom);

	return (
		<>
			<header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
				<div className="container mx-auto px-4 h-20 flex items-center justify-between">

					{/* ЛОГОТИП */}
					<Link to="/" className="flex items-center gap-2 group">
						<img src={logoImg} alt="TechZone Logo" className="h-10 w-auto" />
						<span className="text-2xl font-bold tracking-tight text-slate-900">
							Tech<span className="text-sky-500">Zone</span>
						</span>
					</Link>

					{/* НАВІГАЦІЯ (Desktop) */}
					<nav className="hidden md:flex gap-8 font-medium text-slate-600">
						{NAV_ITEMS.map((item) => (
							<Link
								key={item.path}
								to={item.path}
								className="hover:text-sky-500 transition-colors relative group"
							>
								{item.label}
								<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sky-500 transition-all group-hover:w-full"></span>
							</Link>
						))}
					</nav>

					{/* ПРАВА ЧАСТИНА (Пошук, Кошик, Профіль, Меню) */}
					<div className="flex items-center gap-4">

						{/* Пошук (Тільки Desktop) */}
						<div className="hidden lg:flex items-center bg-gray-100 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-sky-500 transition-all">
							<Search className="w-4 h-4 text-gray-400" />
							<input
								type="text"
								placeholder="Пошук..."
								className="bg-transparent border-none outline-none text-sm ml-2 w-48 text-slate-900 placeholder:text-gray-400"
							/>
						</div>

						<div className="flex items-center gap-2">
							{/* Кнопка Кошика */}
							<Link to="/cart" className="p-2 hover:bg-gray-100 rounded-full transition-colors relative" aria-label="Кошик">
								<ShoppingCart className="w-6 h-6 text-slate-700 hover:text-sky-500 transition-colors" />

								{/* Бейджик з кількістю (показуємо, якщо > 0) */}
								{totalItems > 0 && (
									<span className="absolute top-0 right-0 w-4 h-4 bg-sky-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full animate-in zoom-in duration-200">
										{totalItems}
									</span>
								)}
							</Link>

							{/* Кнопка Профілю */}
							<Link to="/login" className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Увійти">
								<User className="w-6 h-6 text-slate-700 hover:text-sky-500 transition-colors" />
							</Link>

							{/* Кнопка Мобільного Меню (Тільки Mobile/Tablet) */}
							<button
								onClick={() => setIsMobileMenuOpen(true)} // Відкриваємо меню
								className="md:hidden p-2 text-slate-700 hover:bg-gray-100 rounded-full transition-colors"
								aria-label="Меню"
							>
								<Menu className="w-6 h-6" />
							</button>
						</div>
					</div>
				</div>
			</header>

			{/* Вставляємо компонент самого меню (воно приховане, поки isMobileMenuOpenAtom === false) */}
			<MobileMenu />
		</>
	);
};

export default Header;