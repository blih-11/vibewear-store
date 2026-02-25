import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CartProvider } from './context/CartContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import SearchModal from './components/SearchModal';
import ConfirmModal from './components/ConfirmModal';

import AuthGate from './pages/AuthGate';
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
import Orders from './pages/Orders';
import { trackActivity } from './lib/api';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// Get or create a persistent anonymous guest ID
function getGuestId() {
  let id = localStorage.getItem('vw_guest_id');
  if (!id) {
    id = 'guest_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem('vw_guest_id', id);
  }
  return id;
}

function AppContent() {
  const { user, loading } = useAuth();
  const [isGuest, setIsGuest] = useState(() => sessionStorage.getItem('vw_guest') !== 'false');

  // Track visit — logged-in user or guest
  useEffect(() => {
    if (loading) return;
    if (user) {
      trackActivity(user);
    } else if (isGuest) {
      const guestId = getGuestId();
      trackActivity({ uid: guestId, email: null, displayName: 'Guest' });
    }
  }, [user, loading, isGuest]);

  if (loading) return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center">
      <svg className="w-6 h-6 text-white/30 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
    </div>
  );

  if (!user && !isGuest) return (
    <AuthGate onContinueAsGuest={() => {
      sessionStorage.setItem('vw_guest', 'true');
      setIsGuest(true);
    }} />
  );

  if (user && isGuest) sessionStorage.removeItem('vw_guest');

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Navbar onSignOut={() => { setIsGuest(true); }} />
      <main className="flex-1">
        <Routes>
          <Route path="/"              element={<Home />} />
          <Route path="/products"      element={<Products />} />
          <Route path="/products/:id"  element={<ProductDetail />} />
          <Route path="/cart"          element={<Cart />} />
          <Route path="/checkout"      element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/auth"          element={<Auth />} />
          <Route path="/orders"        element={<Orders />} />
          <Route path="/about"         element={<About />} />
          <Route path="/contact"       element={<Contact />} />
          <Route path="/find-store"    element={<FindStore />} />
          <Route path="*"              element={<Navigate to="/" replace />} />
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
