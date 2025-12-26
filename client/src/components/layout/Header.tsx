import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, Heart, X, ChevronRight, Loader2 } from 'lucide-react';
import { useAtomValue, useSetAtom } from 'jotai';
import { cartTotalItemsAtom } from '../../store/cartAtoms';
import { isMobileMenuOpenAtom } from '../../store/uiAtoms';
import { isAuthenticatedAtom } from '../../store/authAtoms';
import { wishlistAtom } from '../../store/wishlistAtoms';
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
	const navigate = useNavigate();

	// --- STATE ---
	const [searchTerm, setSearchTerm] = useState('');
	const [suggestions, setSuggestions] = useState<any[]>([]); // Дані тепер приходять з API
	const [isSearchFocused, setIsSearchFocused] = useState(false);
	const [isSearching, setIsSearching] = useState(false); // Індикатор завантаження
	const searchRef = useRef<HTMLDivElement>(null);

	// --- ATOMS ---
	const totalItems = useAtomValue(cartTotalItemsAtom);
	const wishlistItems = useAtomValue(wishlistAtom);
	const setIsMobileMenuOpen = useSetAtom(isMobileMenuOpenAtom);
	const isAuthenticated = useAtomValue(isAuthenticatedAtom);

	// --- LOGIC ---

	// 1. Живий пошук (Debounce 300ms)
	useEffect(() => {
		// Якщо поле пусте — очищаємо результати
		if (!searchTerm.trim()) {
			setSuggestions([]);
			return;
		}

		// Затримка перед запитом, щоб не перевантажувати сервер
		const delayDebounceFn = setTimeout(async () => {
			setIsSearching(true);
			try {
				// Запит на сервер з параметром q
				const response = await fetch(`http://localhost:5000/api/products?q=${encodeURIComponent(searchTerm)}`);
				if (response.ok) {
					const data = await response.json();
					setSuggestions(data.slice(0, 5)); // Показуємо тільки перші 5
				}
			} catch (error) {
				console.error("Search error:", error);
			} finally {
				setIsSearching(false);
			}
		}, 300);

		return () => clearTimeout(delayDebounceFn);
	}, [searchTerm]);

	// 2. Закриття при кліку поза межами
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
				setIsSearchFocused(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleSearchSubmit = (e?: React.KeyboardEvent) => {
		if ((!e || e.key === 'Enter') && searchTerm.trim()) {
			navigate(`/catalog?q=${encodeURIComponent(searchTerm)}`);
			setIsSearchFocused(false);
			setSuggestions([]);
		}
	};

	const handleSuggestionClick = (slug: string) => {
		navigate(`/product/${slug}`);
		setSearchTerm('');
		setIsSearchFocused(false);
	};

	return (
		<>
			<header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
				<div className="container mx-auto px-4 h-20 flex items-center justify-between">

					{/* LOGO */}
					<Link to="/" className="flex items-center gap-2 group">
						<img src={logoImg} alt="TechZone Logo" className="h-10 w-auto" />
						<span className="text-2xl font-bold tracking-tight text-slate-900">
							Tech<span className="text-sky-500">Zone</span>
						</span>
					</Link>

					{/* NAV */}
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

					{/* ACTIONS */}
					<div className="flex items-center gap-4">

						{/* --- SEARCH BAR --- */}
						<div ref={searchRef} className="hidden lg:block relative z-50">
							<div className={`flex items-center bg-gray-100 rounded-2xl px-4 py-2.5 transition-all duration-300 w-64 focus-within:w-80 focus-within:ring-2 focus-within:ring-sky-500/20 focus-within:bg-white focus-within:shadow-lg ${isSearchFocused ? 'bg-white shadow-lg w-80' : ''}`}>
								{isSearching ? (
									<Loader2 className="w-4 h-4 animate-spin text-sky-500" />
								) : (
									<Search className={`w-4 h-4 transition-colors ${isSearchFocused ? 'text-sky-500' : 'text-gray-400'}`} />
								)}
								<input
									type="text"
									placeholder="Пошук..."
									value={searchTerm}
									onFocus={() => setIsSearchFocused(true)}
									onChange={(e) => setSearchTerm(e.target.value)}
									onKeyDown={handleSearchSubmit}
									className="bg-transparent border-none outline-none text-sm ml-3 w-full text-slate-900 placeholder:text-gray-400"
								/>
								{searchTerm && (
									<button onClick={() => setSearchTerm('')} className="text-slate-400 hover:text-slate-600">
										<X size={14} />
									</button>
								)}
							</div>

							{/* --- SUGGESTIONS DROPDOWN --- */}
							{isSearchFocused && searchTerm.length > 0 && (
								<div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
									{suggestions.length > 0 ? (
										<>
											<div className="py-2">
												<div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Товари</div>
												{suggestions.map((item) => (
													<button
														key={item.id}
														onClick={() => handleSuggestionClick(item.slug)}
														className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-3 transition-colors group"
													>
														<div className="w-10 h-10 rounded-lg bg-white border border-slate-100 p-1 flex items-center justify-center shrink-0">
															<img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
														</div>
														<div className="flex-1 min-w-0">
															<p className="text-sm font-bold text-slate-900 truncate group-hover:text-sky-600 transition-colors">{item.name}</p>
															<p className="text-xs text-slate-500">{item.category}</p>
														</div>
														<span className="text-xs font-bold text-slate-900">{item.price} ₴</span>
													</button>
												))}
											</div>
											<div className="border-t border-slate-100 p-2 bg-slate-50">
												<button
													onClick={() => handleSearchSubmit()}
													className="w-full flex items-center justify-center gap-2 text-sm font-bold text-sky-600 hover:text-sky-700 py-2 rounded-xl hover:bg-sky-50 transition-colors"
												>
													Всі результати для "{searchTerm}" <ChevronRight size={14} />
												</button>
											</div>
										</>
									) : (
										!isSearching && (
											<div className="p-6 text-center text-slate-500">
												<Search className="w-8 h-8 mx-auto mb-2 text-slate-300 opacity-50" />
												<p className="text-sm">Нічого не знайдено</p>
											</div>
										)
									)}
								</div>
							)}
						</div>

						<div className="flex items-center gap-2">
							{/* Wishlist */}
							<Link to="/wishlist" className="p-2 hover:bg-gray-100 rounded-full transition-colors relative hidden sm:block" aria-label="Бажане">
								<Heart className="w-6 h-6 text-slate-700 hover:text-rose-500 transition-colors" />
								{wishlistItems.length > 0 && (
									<span className="absolute top-0 right-0 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full animate-in zoom-in">
										{wishlistItems.length}
									</span>
								)}
							</Link>

							{/* Cart */}
							<Link to="/cart" className="p-2 hover:bg-gray-100 rounded-full transition-colors relative" aria-label="Кошик">
								<ShoppingCart className="w-6 h-6 text-slate-700 hover:text-sky-500 transition-colors" />
								{totalItems > 0 && (
									<span className="absolute top-0 right-0 w-4 h-4 bg-sky-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full animate-in zoom-in duration-200">
										{totalItems}
									</span>
								)}
							</Link>

							{/* Profile */}
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