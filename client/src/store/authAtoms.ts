import { atomWithStorage } from 'jotai/utils';

// Зберігає true/false в localStorage під ключем 'techzone_auth'
export const isAuthenticatedAtom = atomWithStorage('techzone_auth', false);

// Можна також зберігати дані юзера (ім'я, аватар)
export const userAtom = atomWithStorage('techzone_user', {
	name: '',
	email: ''
});