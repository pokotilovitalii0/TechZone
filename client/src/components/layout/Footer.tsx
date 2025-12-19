import { Link } from 'react-router-dom';
import { Instagram, Send, Music2Icon } from 'lucide-react';

const Footer = () => {
	const socialIcons = [
		{ Icon: Instagram, href: "#", label: "Instagram" },
		{ Icon: Send, href: "https://t.me/techzone_welcome", label: "Telegram" },
		{ Icon: Music2Icon, href: "https://www.tiktok.com/@tech_zone2315?is_from_webapp=1&sender_device=pc", label: "TikTok" },
	];

	return (
		<footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
			<div className="container mx-auto px-4">

				<div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
					{/* Колонка 1: Про нас */}
					<div className="col-span-1 md:col-span-1">
						<h3 className="text-lg font-bold text-white mb-4">Tech<span className="text-sky-500">Zone</span></h3>
						<p className="text-sm leading-relaxed opacity-80 mb-6">
							Твій провідник у світ професійної периферії. Ми продаємо не просто залізо, ми продаємо перевагу у грі та комфорт у роботі.
						</p>
						<div className="flex gap-4">
							{/* 2. Рендеримо іконки */}
							{socialIcons.map(({ Icon, href, label }, i) => (
								<a
									key={i}
									href={href}
									className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all duration-300"
									aria-label={label}
								>
									<Icon size={18} />
								</a>
							))}
						</div>
					</div>

					{/* Колонка 2: Магазин */}
					<div>
						<h4 className="text-white font-bold mb-6">Магазин</h4>
						<ul className="space-y-3 text-sm">
							{['Всі товари', 'Миші', 'Клавіатури', 'Навушники', 'Крісла'].map((item) => (
								<li key={item}><Link to={`/catalog/${item.toLowerCase()}`} className="hover:text-sky-400 transition-colors">{item}</Link></li>
							))}
						</ul>
					</div>

					{/* Колонка 3: Клієнтам */}
					<div>
						<h4 className="text-white font-bold mb-6">Клієнтам</h4>
						<ul className="space-y-3 text-sm">
							{['Про нас', 'Контакти', 'Доставка та оплата', 'Гарантія', 'Повернення'].map((item) => (
								<li key={item}><a href="#" className="hover:text-sky-400 transition-colors">{item}</a></li>
							))}
						</ul>
					</div>

					{/* Колонка 4: Розсилка */}
					<div>
						<h4 className="text-white font-bold mb-6">Будь в курсі</h4>
						<p className="text-xs mb-4 opacity-70">Підпишись на знижки та новини.</p>
						<div className="flex">
							<input
								type="email"
								placeholder="Твій email"
								className="bg-slate-800 text-white text-sm px-4 py-2 rounded-l-md outline-none focus:ring-1 focus:ring-sky-500 w-full"
							/>
							<button className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-r-md transition-colors">
								<Send size={18} />
							</button>
						</div>
					</div>

				</div>

				<div className="border-t border-slate-800 pt-8 text-center text-xs opacity-50">
					&copy; {new Date().getFullYear()} TechZone. Built for gamers.
				</div>
			</div>
		</footer>
	);
};

export default Footer;