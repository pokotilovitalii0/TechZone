import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';


export interface WishlistItem {
	id: number;
	name: string;
	price: number;
	oldPrice?: number | null;
	image: string;
	inStock: boolean;
	category: string;
}

// зберігає масив у localStorage під ключем 'techzone_wishlist'
export const wishlistAtom = atomWithStorage<WishlistItem[]>('techzone_wishlist', []);

//Атом для перевірки
export const isInWishlistAtom = atom(
	(get) => (id: number) => {
		const items = get(wishlistAtom);
		return items.some((item) => item.id === id);
	}
);

// Атом-дія для перемикання (додати/видалити)
export const toggleWishlistAtom = atom(
	null,
	(get, set, item: WishlistItem) => {
		const current = get(wishlistAtom);
		const exists = current.find((i) => i.id === item.id);

		if (exists) {
			set(wishlistAtom, current.filter((i) => i.id !== item.id));
		} else {
			set(wishlistAtom, [...current, item]);
		}
	}
);