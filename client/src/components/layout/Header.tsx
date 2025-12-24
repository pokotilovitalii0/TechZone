import { Link } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu } from 'lucide-react';
import { useAtomValue, useSetAtom } from 'jotai';
import { cartTotalItemsAtom } from '../../store/cartAtoms';
import { isMobileMenuOpenAtom } from '../../store/uiAtoms';
import { isAuthenticatedAtom } from '../../store/authAtoms'; // Імпорт атома авторизації
import MobileMenu from './MobileMenu';
import logoImg from '@/assets/logo/logo.png';

const NAV_ITEMS = [
	{ label: 'Каталог', path: '/catalog' },
	{ label: 'Миші', path: '/catalog/mice' },
	{ label: 'Клавіатури', path: '/catalog/keyboards' },
	{ label: 'Аудіо', path: '/catalog/audio' },
	{ label: 'Аксесуари', path: '/catalog/accessories' },
];

const Header = () => {
	const totalItems = useAtomValue(cartTotalItemsAtom);
	const setIsMobileMenuOpen = useSetAtom(isMobileMenuOpenAtom);
	const isAuthenticated = useAtomValue(isAuthenticatedAtom); // Читаємо стан

	return (
		<>
			<header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
				<div className="container mx-auto px-4 h-20 flex items-center justify-between">

					<Link to="/" className="flex items-center gap-2 group">
						<img src={logoImg} alt="TechZone Logo" className="h-10 w-auto" />
						<span className="text-2xl font-bold tracking-tight text-slate-900">
							Tech<span className="text-sky-500">Zone</span>
						</span>
					</Link>

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

					<div className="flex items-center gap-4">

						<div className="hidden lg:flex items-center bg-gray-100 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-sky-500 transition-all">
							<Search className="w-4 h-4 text-gray-400" />
							<input
								type="text"
								placeholder="Пошук..."
								className="bg-transparent border-none outline-none text-sm ml-2 w-48 text-slate-900 placeholder:text-gray-400"
							/>
						</div>

						<div className="flex items-center gap-2">
							<Link to="/cart" className="p-2 hover:bg-gray-100 rounded-full transition-colors relative" aria-label="Кошик">
								<ShoppingCart className="w-6 h-6 text-slate-700 hover:text-sky-500 transition-colors" />
								{totalItems > 0 && (
									<span className="absolute top-0 right-0 w-4 h-4 bg-sky-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full animate-in zoom-in duration-200">
										{totalItems}
									</span>
								)}
							</Link>

							{/* Розумне посилання на профіль */}
							<Link
								to={isAuthenticated ? "/profile" : "/login"}
								className={`p-2 rounded-full transition-colors ${isAuthenticated
										? 'bg-sky-100 text-sky-600 hover:bg-sky-200'
										: 'hover:bg-gray-100 text-slate-700 hover:text-sky-500'
									}`}
								aria-label={isAuthenticated ? "Мій профіль" : "Увійти"}
							>
								<User className="w-6 h-6" />
							</Link>

							<button
								onClick={() => setIsMobileMenuOpen(true)}
								className="md:hidden p-2 text-slate-700 hover:bg-gray-100 rounded-full transition-colors"
								aria-label="Меню"
							>
								<Menu className="w-6 h-6" />
							</button>
						</div>
					</div>
				</div>
			</header>
			<MobileMenu />
		</>
	);
};

export default Header;