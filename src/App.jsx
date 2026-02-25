import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import SearchModal from './components/SearchModal';
import ConfirmModal from './components/ConfirmModal';

import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import About from './pages/About';
import Contact from './pages/Contact';
import FindStore from './pages/FindStore';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Auth from './pages/Auth';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function AppContent() {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/"              element={<Home />} />
          <Route path="/products"      element={<Products />} />
          <Route path="/products/:id"  element={<ProductDetail />} />
          <Route path="/cart"          element={<Cart />} />
          <Route path="/checkout"      element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/auth"          element={<Auth />} />
          <Route path="/about"         element={<About />} />
          <Route path="/contact"       element={<Contact />} />
          <Route path="/find-store"    element={<FindStore />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer />
      <SearchModal />
      <ConfirmModal />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CurrencyProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </CurrencyProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
