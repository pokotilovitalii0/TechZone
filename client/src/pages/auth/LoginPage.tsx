import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, LogIn, Loader2 } from 'lucide-react';
import { useSetAtom } from 'jotai';
import { loginAtom } from '../../store/authAtoms'; // Використовуємо loginAtom для запису

const LoginPage = () => {
	const navigate = useNavigate();

	// Використовуємо атом дії для входу
	const login = useSetAtom(loginAtom);

	// --- СТАНИ ---
	const [formData, setFormData] = useState({
		email: '',
		password: ''
	});

	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

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
		if (!formData.email || !formData.password) {
			setError('Введіть email та пароль');
			setIsLoading(false);
			return;
		}

		try {
			// 2. РЕАЛЬНИЙ ЗАПИТ НА СЕРВЕР
			const response = await fetch('http://localhost:5000/api/auth/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(formData),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Невірний логін або пароль');
			}

			// 3. Успішний вхід: Зберігаємо дані через Jotai (це оновить і localStorage)
			login({ user: data.user, token: data.token });

			// 4. Перенаправляємо на головну
			navigate('/');

		} catch (err: any) {
			console.error(err);
			setError(err.message || 'Сталася помилка при вході');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex bg-slate-50">

			{/* --- LEFT SIDE: WELCOME BACK MESSAGE --- */}
			<div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center">
				<div className="absolute top-0 left-0 w-full h-full opacity-20">
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500 rounded-full blur-[120px]"></div>
				</div>

				<div className="relative z-10 p-12 text-white max-w-lg">
					<div className="mb-8">
						<span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider border border-indigo-500/30">
							Welcome Back
						</span>
					</div>
					<h1 className="text-5xl font-black mb-6 leading-tight">
						З поверненням у <br />
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">
							TechZone
						</span>
					</h1>
					<p className="text-slate-400 text-lg leading-relaxed mb-8">
						Ми зберегли твій кошик та список бажань. Увійди, щоб продовжити покупки там, де ти зупинився.
					</p>

					<div className="flex gap-8 border-t border-slate-800 pt-8">
						<div>
							<p className="text-3xl font-bold text-white">10k+</p>
							<p className="text-slate-500 text-sm">Задоволених клієнтів</p>
						</div>
						<div>
							<p className="text-3xl font-bold text-white">4.9</p>
							<p className="text-slate-500 text-sm">Середній рейтинг</p>
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
						<div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center text-sky-600 mx-auto mb-4">
							<LogIn size={24} />
						</div>
						<h2 className="text-3xl font-black text-slate-900">Вхід в акаунт</h2>
						<p className="mt-2 text-slate-500">Ще не маєте акаунту? <Link to="/register" className="text-sky-500 font-bold hover:underline">Зареєструватися</Link></p>
					</div>

					{error && (
						<div className="bg-rose-50 text-rose-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 border border-rose-100">
							<AlertCircle size={18} /> {error}
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-5">

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

						<div className="space-y-1.5">
							<div className="flex justify-between items-center ml-1">
								<label className="text-sm font-bold text-slate-700">Пароль</label>
								<a href="#" className="text-sm text-sky-500 font-bold hover:underline">Забули пароль?</a>
							</div>
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

						<div className="flex items-center gap-3 pt-2">
							<div className="flex items-center h-5">
								<input
									id="remember"
									name="remember"
									type="checkbox"
									className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
								/>
							</div>
							<label htmlFor="remember" className="text-sm text-slate-600 font-medium">
								Запам'ятати мене
							</label>
						</div>

						<button
							type="submit"
							disabled={isLoading}
							className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-sky-500 hover:shadow-lg hover:shadow-sky-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
						>
							{isLoading ? (
								<Loader2 className="animate-spin w-5 h-5" />
							) : (
								<>
									Увійти <ArrowRight size={20} />
								</>
							)}
						</button>
					</form>

					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-slate-200"></div>
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="px-4 bg-slate-50 text-slate-400">Або увійдіть через</span>
						</div>
					</div>

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

export default LoginPage;