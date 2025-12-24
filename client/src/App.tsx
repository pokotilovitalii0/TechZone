import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/home/HomePage';
import CatalogPage from './pages/catalog/CatalogPage';
import CartPage from './pages/cart/CartPage';
import AuthPage from './pages/auth/AuthPage';
import ProductPage from './pages/catalog/ProductPage';
import RegisterPage from './pages/auth/RegisterPage';
import LoginPage from './pages/auth/LoginPage';
import CheckoutPage from './pages/checkout/CheckoutPage';
import ProfilePage from './pages/profile/ProfilePage';
import WishlistPage from './pages/wishlist/WishlistPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      {/* Батьківський маршрут - Layout */}
      <Route path="/" element={<Layout />}>
        {/* Вкладені маршрути */}
        <Route index element={<HomePage />} />
        <Route path="catalog" element={<CatalogPage />} />
        <Route path="/catalog/:categorySlug" element={<CatalogPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth" element={<RegisterPage />} />
    </Routes>
  );
}

export default App;