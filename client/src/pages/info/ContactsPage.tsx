import React from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

const ContactsPage = () => {
	return (
		<div className="min-h-screen bg-slate-50 py-12">
			<div className="container mx-auto px-4 max-w-6xl">
				<h1 className="text-4xl font-black text-slate-900 mb-12 text-center">Контакти</h1>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

					{/* Info Cards */}
					<div className="lg:col-span-1 space-y-6">
						<div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
							<div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center shrink-0">
								<Phone size={24} />
							</div>
							<div>
								<h3 className="font-bold text-slate-900 text-lg mb-1">Телефон</h3>
								<p className="text-slate-500 mb-1">+380 99 123 45 67</p>
								<p className="text-slate-500">+380 97 890 12 34</p>
								<p className="text-xs text-sky-500 font-bold mt-2">Telegram / Viber</p>
							</div>
						</div>

						<div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
							<div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center shrink-0">
								<Mail size={24} />
							</div>
							<div>
								<h3 className="font-bold text-slate-900 text-lg mb-1">Email</h3>
								<p className="text-slate-500">support@techzone.ua</p>
								<p className="text-slate-500">b2b@techzone.ua</p>
							</div>
						</div>

						<div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
							<div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center shrink-0">
								<Clock size={24} />
							</div>
							<div>
								<h3 className="font-bold text-slate-900 text-lg mb-1">Графік роботи</h3>
								<p className="text-slate-500">Пн-Пт: 09:00 - 20:00</p>
								<p className="text-slate-500">Сб-Нд: 10:00 - 18:00</p>
							</div>
						</div>

						<div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
							<div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center shrink-0">
								<MapPin size={24} />
							</div>
							<div>
								<h3 className="font-bold text-slate-900 text-lg mb-1">Офіс / Шоурум</h3>
								<p className="text-slate-500">м. Київ, вул. Хрещатик, 1</p>
								<p className="text-xs text-slate-400 mt-1">*Самовивіз доступний</p>
							</div>
						</div>
					</div>

					{/* Map & Form */}
					<div className="lg:col-span-2 space-y-6">
						{/* Fake Map Image */}
						<div className="bg-slate-200 rounded-2xl overflow-hidden h-[300px] relative border border-slate-300">
							<img
								src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1748&auto=format&fit=crop"
								alt="Map Location"
								className="w-full h-full object-cover grayscale opacity-60 hover:grayscale-0 transition-all duration-700"
							/>
							<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 py-2 rounded-xl shadow-lg font-bold text-slate-900 flex items-center gap-2">
								<MapPin size={18} className="text-rose-500" /> Ми тут
							</div>
						</div>

						{/* Contact Form */}
						<div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
							<h3 className="text-xl font-bold text-slate-900 mb-6">Напишіть нам</h3>
							<form className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-1.5">
									<label className="text-sm font-bold text-slate-700">Ваше ім'я</label>
									<input type="text" placeholder="Олександр" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-sky-500 outline-none transition-all" />
								</div>
								<div className="space-y-1.5">
									<label className="text-sm font-bold text-slate-700">Email</label>
									<input type="email" placeholder="alex@example.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-sky-500 outline-none transition-all" />
								</div>
								<div className="space-y-1.5 md:col-span-2">
									<label className="text-sm font-bold text-slate-700">Повідомлення</label>
									<textarea rows={4} placeholder="Яке у вас запитання?" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-sky-500 outline-none transition-all resize-none"></textarea>
								</div>
								<div className="md:col-span-2">
									<button className="bg-slate-900 text-white font-bold py-3 px-8 rounded-xl hover:bg-sky-500 transition-colors flex items-center gap-2">
										<Send size={18} /> Надіслати
									</button>
								</div>
							</form>
						</div>
					</div>

				</div>
			</div>
		</div>
	);
};

export default ContactsPage;