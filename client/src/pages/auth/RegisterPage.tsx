import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle, AlertCircle, Phone } from 'lucide-react'; // Додано Phone

const RegisterPage = () => {
	const navigate = useNavigate();

	// --- СТАНИ ---
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		phone: '', // Додано поле телефону
		password: '',
		confirmPassword: ''
	});

	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	// --- ЛОГІКА ---
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
		setError(null);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		// 1. Валідація
		if (!formData.name || !formData.email || !formData.phone || !formData.password) {
			setError('Будь ласка, заповніть всі поля, включаючи телефон');
			setIsLoading(false);
			return;
		}

		if (formData.password !== formData.confirmPassword) {
			setError('Паролі не співпадають');
			setIsLoading(false);
			return;
		}

		if (formData.password.length < 6) {
			setError('Пароль має містити мінімум 6 символів');
			setIsLoading(false);
			return;
		}

		// 2. Імітація запиту
		setTimeout(() => {
			console.log('User Registered:', formData);
			setIsLoading(false);
			setSuccess(true);

			setTimeout(() => {
				navigate('/login');
			}, 2000);
		}, 1500);
	};

	return (
		<div className="min-h-screen flex bg-slate-50">

			{/* --- LEFT SIDE: IMAGE & BRANDING --- */}
			<div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center">
				<div className="absolute top-0 left-0 w-full h-full opacity-20">
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-sky-500 rounded-full blur-[120px]"></div>
				</div>

				<div className="relative z-10 p-12 text-white max-w-lg">
					<div className="mb-8">
						<span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider border border-sky-500/30">
							Join the Community
						</span>
					</div>
					<h1 className="text-5xl font-black mb-6 leading-tight">
						Розкрий свій <br />
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">
							Потенціал
						</span>
					</h1>
					<p className="text-slate-400 text-lg leading-relaxed mb-8">
						Створи акаунт, щоб отримати доступ до ексклюзивних знижок, історії замовлень та персональних рекомендацій.
					</p>

					<div className="space-y-4">
						<div className="flex items-center gap-3 text-slate-300">
							<div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400"><CheckCircle size={16} /></div>
							<span>Швидке оформлення замовлення</span>
						</div>
						<div className="flex items-center gap-3 text-slate-300">
							<div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400"><CheckCircle size={16} /></div>
							<span>Відстеження статусу доставки</span>
						</div>
						<div className="flex items-center gap-3 text-slate-300">
							<div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400"><CheckCircle size={16} /></div>
							<span>Накопичувальна система бонусів</span>
						</div>
					</div>
				</div>
			</div>

			{/* --- RIGHT SIDE: FORM --- */}
			<div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
				<Link to="/" className="absolute top-8 right-8 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors">
					На головну
				</Link>

				<div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
					<div className="text-center">
						<h2 className="text-3xl font-black text-slate-900">Реєстрація</h2>
						<p className="mt-2 text-slate-500">Вже маєте акаунт? <Link to="/login" className="text-sky-500 font-bold hover:underline">Увійти</Link></p>
					</div>

					{error && (
						<div className="bg-rose-50 text-rose-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 border border-rose-100">
							<AlertCircle size={18} /> {error}
						</div>
					)}
					{success && (
						<div className="bg-green-50 text-green-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 border border-green-100">
							<CheckCircle size={18} /> Акаунт успішно створено! Перенаправлення...
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-5">

						{/* Name Input */}
						<div className="space-y-1.5">
							<label className="text-sm font-bold text-slate-700 ml-1">Ім'я та Прізвище</label>
							<div className="relative group">
								<User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" size={20} />
								<input
									type="text"
									name="name"
									value={formData.name}
									onChange={handleChange}
									placeholder="Олександр Геймер"
									className="w-full bg-white border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 font-medium text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all placeholder:text-slate-400"
								/>
							</div>
						</div>

						{/* Email Input */}
						<div className="space-y-1.5">
							<label className="text-sm font-bold text-slate-700 ml-1">Email</label>
							<div className="relative group">
								<Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" size={20} />
								<input
									type="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									placeholder="alex@example.com"
									className="w-full bg-white border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 font-medium text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all placeholder:text-slate-400"
								/>
							</div>
						</div>

						{/* Phone Input (NEW) */}
						<div className="space-y-1.5">
							<label className="text-sm font-bold text-slate-700 ml-1">Телефон</label>
							<div className="relative group">
								<Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" size={20} />
								<input
									type="tel"
									name="phone"
									value={formData.phone}
									onChange={handleChange}
									placeholder="+380 99 123 45 67"
									className="w-full bg-white border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 font-medium text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all placeholder:text-slate-400"
								/>
							</div>
						</div>

						{/* Password Input */}
						<div className="space-y-1.5">
							<label className="text-sm font-bold text-slate-700 ml-1">Пароль</label>
							<div className="relative group">
								<Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" size={20} />
								<input
									type={showPassword ? "text" : "password"}
									name="password"
									value={formData.password}
									onChange={handleChange}
									placeholder="••••••••"
									className="w-full bg-white border border-slate-200 rounded-xl py-3.5 pl-12 pr-12 font-medium text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all placeholder:text-slate-400"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
								>
									{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
								</button>
							</div>
						</div>

						{/* Confirm Password Input */}
						<div className="space-y-1.5">
							<label className="text-sm font-bold text-slate-700 ml-1">Повторіть пароль</label>
							<div className="relative group">
								<Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors" size={20} />
								<input
									type={showPassword ? "text" : "password"}
									name="confirmPassword"
									value={formData.confirmPassword}
									onChange={handleChange}
									placeholder="••••••••"
									className="w-full bg-white border border-slate-200 rounded-xl py-3.5 pl-12 pr-12 font-medium text-slate-900 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all placeholder:text-slate-400"
								/>
							</div>
						</div>

						{/* Terms Checkbox */}
						<div className="flex items-start gap-3 pt-2">
							<div className="flex items-center h-5">
								<input
									id="terms"
									name="terms"
									type="checkbox"
									className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
								/>
							</div>
							<label htmlFor="terms" className="text-sm text-slate-500 leading-tight">
								Я погоджуюсь з <a href="#" className="text-sky-500 font-bold hover:underline">Умовами використання</a> та <a href="#" className="text-sky-500 font-bold hover:underline">Політикою конфіденційності</a>
							</label>
						</div>

						<button
							type="submit"
							disabled={isLoading}
							className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-sky-500 hover:shadow-lg hover:shadow-sky-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
						>
							{isLoading ? (
								<span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
							) : (
								<>
									Створити акаунт <ArrowRight size={20} />
								</>
							)}
						</button>
					</form>

					{/* Social Auth Divider */}
					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-slate-200"></div>
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="px-4 bg-slate-50 text-slate-400">Або увійдіть через</span>
						</div>
					</div>

					{/* Social Buttons */}
					<div className="grid grid-cols-2 gap-4">
						<button className="flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 rounded-xl hover:border-slate-400 hover:bg-slate-50 transition-all text-slate-700 font-bold text-sm">
							<img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
							Google
						</button>
						<button className="flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 rounded-xl hover:border-slate-400 hover:bg-slate-50 transition-all text-slate-700 font-bold text-sm">
							<img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-5 h-5" alt="Facebook" />
							Facebook
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RegisterPage;