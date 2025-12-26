import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/home/HomePage';
import CatalogPage from './pages/catalog/CatalogPage';
import CartPage from './pages/cart/CartPage';
import ProductPage from './pages/catalog/ProductPage';
import RegisterPage from './pages/auth/RegisterPage';
import LoginPage from './pages/auth/LoginPage';
import CheckoutPage from './pages/checkout/CheckoutPage';
import ProfilePage from './pages/profile/ProfilePage';
import WishlistPage from './pages/wishlist/WishlistPage';
import NotFoundPage from './pages/NotFoundPage';
import AboutPage from './pages/info/AboutPage';
import ContactsPage from './pages/info/ContactsPage';
import DeliveryPage from './pages/info/DeliveryPage';
import WarrantyPage from './pages/info/WarrantyPage';
import ReturnsPage from './pages/info/ReturnsPage';
import ScrollToTop from './components/ScrollToTop'; // Імпортуємо наш новий компонент

function App() {
  return (
    <>
      {/* Компонент, що слідкує за зміною URL і крутить скрол вгору */}
      <ScrollToTop />

      <Routes>
        {/* Батьківський маршрут - Layout */}
        <Route path="/" element={<Layout />}>
          {/* Вкладені маршрути */}
          <Route index element={<HomePage />} />
          <Route path="catalog" element={<CatalogPage />} />
          <Route path="/catalog/:categorySlug" element={<CatalogPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="cart" element={<CartPage />} />

          <Route path="/product/:slug" element={<ProductPage />} />

          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/delivery" element={<DeliveryPage />} />
          <Route path="/warranty" element={<WarrantyPage />} />
          <Route path="/returns" element={<ReturnsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth" element={<RegisterPage />} />
      </Routes>
    </>
  );
}

export default App;