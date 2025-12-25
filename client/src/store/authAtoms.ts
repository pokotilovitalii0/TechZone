import { atom } from 'jotai';

// Експортуємо інтерфейс, щоб використовувати його в інших файлах
export interface User {
	id: number;
	email: string;
	name: string;
	role: string;
}

// Отримуємо дані з localStorage безпечно
const getUserFromStorage = (): User | null => {
	const stored = localStorage.getItem('user');
	if (!stored) return null;
	try {
		return JSON.parse(stored);
	} catch (e) {
		console.error("Error parsing user from storage", e);
		return null;
	}
};

const initialUser = getUserFromStorage();

// --- ATOMS ---

// 1. Головний атом користувача (Writable - можна записувати)
export const userAtom = atom<User | null>(initialUser);

// 2. Атом перевірки авторизації (Read-only - тільки читати)
export const isAuthenticatedAtom = atom((get) => !!get(userAtom));

// 3. Атом для входу (Action Atom)
export const loginAtom = atom(
	null, // Перший аргумент null, бо це write-only атом
	(get, set, data: { user: User; token: string }) => {
		set(userAtom, data.user); // Тепер TypeScript знає, що userAtom можна змінювати
		localStorage.setItem('user', JSON.stringify(data.user));
		localStorage.setItem('token', data.token);
	}
);

// 4. Атом для виходу (Action Atom)
export const logoutAtom = atom(
	null,
	(get, set) => {
		set(userAtom, null);
		localStorage.removeItem('user');
		localStorage.removeItem('token');
	}
);