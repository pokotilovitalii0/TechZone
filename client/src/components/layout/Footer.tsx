import { Link } from 'react-router-dom';
import { Instagram, Send, Music2Icon, Mail } from 'lucide-react';

const Footer = () => {
	// 1. Соціальні мережі (зовнішні посилання)
	const socialIcons = [
		{ Icon: Instagram, href: "https://instagram.com", label: "Instagram" },
		{ Icon: Send, href: "https://t.me/techzone_welcome", label: "Telegram" },
		{ Icon: Music2Icon, href: "https://www.tiktok.com/@tech_zone2315", label: "TikTok" },
	];

	// 2. Навігація магазину (внутрішні посилання)
	const shopLinks = [
		{ label: 'Всі товари', path: '/catalog' },
		{ label: 'Миші', path: '/catalog/mice' },
		{ label: 'Клавіатури', path: '/catalog/keyboards' },
		{ label: 'Навушники', path: '/catalog/audio' },
		{ label: 'Аксесуари', path: '/catalog/accessories' }, // Виправлено з "Крісла" на те, що є в хедері
	];

	// 3. Інформація для клієнтів (внутрішні посилання на сторінки, які треба буде створити)
	const clientLinks = [
		{ label: 'Про нас', path: '/about' },
		{ label: 'Контакти', path: '/contacts' },
		{ label: 'Доставка та оплата', path: '/delivery' },
		{ label: 'Гарантія', path: '/warranty' },
		{ label: 'Повернення', path: '/returns' },
	];

	return (
		<footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
			<div className="container mx-auto px-4">

				<div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
					{/* Колонка 1: Бренд та Соцмережі */}
					<div className="col-span-1">
						<h3 className="text-xl font-bold text-white mb-4">Tech<span className="text-sky-500">Zone</span></h3>
						<p className="text-sm leading-relaxed opacity-70 mb-6 max-w-xs">
							Твій провідник у світ професійної периферії. Ми продаємо не просто залізо, ми продаємо перевагу у грі та комфорт у роботі.
						</p>
						<div className="flex gap-3">
							{socialIcons.map(({ Icon, href, label }, i) => (
								<a
									key={i}
									href={href}
									target="_blank" // Відкривати в новій вкладці
									rel="noopener noreferrer" // Безпека
									className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all duration-300 group"
									aria-label={label}
								>
									<Icon size={18} className="group-hover:scale-110 transition-transform" />
								</a>
							))}
						</div>
					</div>

					{/* Колонка 2: Магазин */}
					<div>
						<h4 className="text-white font-bold mb-6">Магазин</h4>
						<ul className="space-y-3 text-sm">
							{shopLinks.map((item) => (
								<li key={item.path}>
									<Link to={item.path} className="hover:text-sky-400 transition-colors opacity-80 hover:opacity-100">
										{item.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Колонка 3: Клієнтам */}
					<div>
						<h4 className="text-white font-bold mb-6">Клієнтам</h4>
						<ul className="space-y-3 text-sm">
							{clientLinks.map((item) => (
								<li key={item.path}>
									{/* Поки сторінок немає, можна залишити Link, але він вестиме на 404, або поставити заглушку */}
									<Link to={item.path} className="hover:text-sky-400 transition-colors opacity-80 hover:opacity-100">
										{item.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Колонка 4: Розсилка */}
					<div>
						<h4 className="text-white font-bold mb-6">Будь в курсі</h4>
						<p className="text-sm mb-4 opacity-70">Отримуй найкращі пропозиції та новини першим.</p>
						<form className="flex flex-col gap-3">
							<div className="relative">
								<Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
								<input
									type="email"
									placeholder="Твій email"
									className="bg-slate-800 text-white text-sm pl-10 pr-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-sky-500 w-full border border-slate-700 focus:border-transparent transition-all placeholder:text-slate-500"
								/>
							</div>
							<button className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-sky-500/20 active:scale-[0.98]">
								Підписатися
							</button>
						</form>
					</div>

				</div>

				<div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-50">
					<p>&copy; {new Date().getFullYear()} TechZone. Всі права захищено.</p>
					<div className="flex gap-6">
						<Link to="/privacy" className="hover:text-white transition-colors">Політика конфіденційності</Link>
						<Link to="/terms" className="hover:text-white transition-colors">Умови використання</Link>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;