import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// Тип товару в кошику
export interface CartItem {
	id: number;
	name: string;
	price: number;
	image: string;
	quantity: number;
	selectedColor?: string;
}

// Головний атом, який автоматично синхронізується з localStorage
// 'techzone_cart' - ключ у localStorage
export const cartAtom = atomWithStorage<CartItem[]>('techzone_cart', []);

// Загальна кількість товарів (для бейджика в хедері)
export const cartTotalItemsAtom = atom((get) => {
	const items = get(cartAtom);
	return items.reduce((total, item) => total + item.quantity, 0);
});

// Загальна вартість
export const cartTotalPriceAtom = atom((get) => {
	const items = get(cartAtom);
	return items.reduce((total, item) => total + item.price * item.quantity, 0);
});

// Атоми-дії для логіки маніпуляцій
// addToCart, removeFromCart, updateQuantity
export const addToCartAtom = atom(
	null, // перший аргумент null означає, що атом нічого не повертає при читанні
	(get, set, newItem: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
		const items = get(cartAtom);
		const existingItemIndex = items.findIndex((item) => item.id === newItem.id);
		const qtyToAdd = newItem.quantity || 1;

		if (existingItemIndex > -1) {
			// Якщо товар вже є, оновлюємо кількість
			const updatedItems = [...items];
			updatedItems[existingItemIndex] = {
				...updatedItems[existingItemIndex],
				quantity: updatedItems[existingItemIndex].quantity + qtyToAdd,
			};
			set(cartAtom, updatedItems);
		} else {
			// Якщо немає, додаємо новий
			set(cartAtom, [...items, { ...newItem, quantity: qtyToAdd }]);
		}
	}
);

export const removeFromCartAtom = atom(
	null,
	(get, set, id: number) => {
		const items = get(cartAtom);
		set(cartAtom, items.filter((item) => item.id !== id));
	}
);

export const updateQuantityAtom = atom(
	null,
	(get, set, { id, quantity }: { id: number; quantity: number }) => {
		const items = get(cartAtom);
		if (quantity < 1) return;
		set(cartAtom, items.map((item) => (item.id === id ? { ...item, quantity } : item)));
	}
);