import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/home/HomePage';
import CatalogPage from './pages/catalog/CatalogPage';
import CartPage from './pages/cart/CartPage';
import AuthPage from './pages/auth/AuthPage';

function App() {
  return (
    <Routes>
      {/* Батьківський маршрут - Layout */}
      <Route path="/" element={<Layout />}>

        {/* Вкладені маршрути */}
        <Route index element={<HomePage />} />
        <Route path="catalog" element={<CatalogPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="auth" element={<AuthPage />} />

        {/* Сторінка 404 */}
        <Route path="*" element={<h1 className="text-red-500">404 - Not Found</h1>} />
      </Route>
    </Routes>
  );
}

export default App;