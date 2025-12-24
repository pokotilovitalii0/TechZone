import React from 'react';
import { Link } from 'react-router-dom';
import { useAtom, useSetAtom } from 'jotai';
import { wishlistAtom, toggleWishlistAtom } from '../../store/wishlistAtoms';
import { addToCartAtom } from '../../store/cartAtoms';
import { ShoppingCart, Trash2, Heart, ArrowLeft } from 'lucide-react';

const WishlistPage = () => {
	const [wishlist] = useAtom(wishlistAtom);
	const toggleWishlist = useSetAtom(toggleWishlistAtom);
	const addToCart = useSetAtom(addToCartAtom);

	// Функція для додавання в кошик зі сторінки бажань
	const handleAddToCart = (item: any) => {
		addToCart({
			id: item.id,
			name: item.name,
			price: item.price,
			image: item.image,
			quantity: 1
		});
		// Опціонально: можна видаляти зі списку бажань після додавання в кошик
		// toggleWishlist(item); 
	};

	if (wishlist.length === 0) {
		return (
			<div className="min-h-[60vh] flex flex-col items-center justify-center bg-slate-50 px-4">
				<div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center mb-6 text-rose-400">
					<Heart size={48} />
				</div>
				<h2 className="text-2xl font-bold text-slate-900 mb-2">Ваш список бажань порожній</h2>
				<p className="text-slate-500 mb-8 text-center max-w-md">Зберігайте товари, які вам сподобались, щоб не загубити їх.</p>
				<Link to="/catalog" className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-sky-500 transition-all flex items-center gap-2">
					<ArrowLeft size={20} /> До каталогу
				</Link>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-slate-50 py-12">
			<div className="container mx-auto px-4">
				<h1 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-3">
					Список бажань
					<span className="bg-rose-100 text-rose-600 text-lg px-3 py-1 rounded-full font-bold">{wishlist.length}</span>
				</h1>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
					{wishlist.map((product) => (
						<div key={product.id} className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col hover:shadow-xl transition-all duration-300 relative group">

							<button
								onClick={() => toggleWishlist(product)}
								className="absolute top-4 right-4 z-10 p-2 rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"
								title="Видалити зі списку"
							>
								<Trash2 size={18} />
							</button>

							<Link to={`/product/${product.id}`} className="h-48 w-full flex items-center justify-center mb-4 overflow-hidden rounded-xl bg-slate-50">
								<img src={product.image} alt={product.name} className="h-full w-auto object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110" />
							</Link>

							<div className="flex-grow flex flex-col">
								<div className="text-xs text-sky-500 font-bold uppercase tracking-wide mb-1">{product.category}</div>
								<Link to={`/product/${product.id}`} className="font-bold text-slate-900 mb-2 leading-snug hover:text-sky-600 transition-colors line-clamp-2">
									{product.name}
								</Link>

								<div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
									<div>
										{product.oldPrice && <div className="text-xs text-slate-400 line-through">{product.oldPrice} ₴</div>}
										<div className="font-black text-lg text-slate-900">{product.price} ₴</div>
									</div>

									{product.inStock ? (
										<button
											onClick={() => handleAddToCart(product)}
											className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white hover:bg-sky-500 transition-all"
											title="Купити"
										>
											<ShoppingCart size={18} />
										</button>
									) : (
										<span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">Немає</span>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default WishlistPage;