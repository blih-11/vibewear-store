import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { getSavedCart, saveCart, clearSavedCart } from '../lib/api';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cartItems, setCartItems]   = useState([]);
  const [cartOpen, setCartOpen]     = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmItem, setConfirmItem] = useState(null);
  const saveTimer = useRef(null);
  const prevUid   = useRef(null);

  // ── When user logs in → restore their saved cart ──────────────────────────
  useEffect(() => {
    if (!user) {
      // User logged out — clear cart (it's saved in DB)
      if (prevUid.current) setCartItems([]);
      prevUid.current = null;
      return;
    }
    if (user.uid === prevUid.current) return; // same user, skip
    prevUid.current = user.uid;

    getSavedCart(user.uid)
      .then(data => {
        if (data.success && data.items?.length > 0) {
          // Merge saved cart with any current guest items
          setCartItems(prev => {
            const merged = [...data.items];
            prev.forEach(guestItem => {
              const exists = merged.find(i => i.key === guestItem.key);
              if (!exists) merged.push(guestItem);
              else {
                const idx = merged.findIndex(i => i.key === guestItem.key);
                merged[idx] = { ...merged[idx], quantity: merged[idx].quantity + guestItem.quantity };
              }
            });
            return merged;
          });
        }
      })
      .catch(() => {});
  }, [user]);

  // ── Auto-save cart to DB when it changes (debounced 800ms) ───────────────
  useEffect(() => {
    if (!user) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveCart(user.uid, cartItems).catch(() => {});
    }, 800);
    return () => clearTimeout(saveTimer.current);
  }, [cartItems, user]);

  // ── Cart actions ──────────────────────────────────────────────────────────
  const addToCart = useCallback((product, size, color, quantity = 1) => {
    setCartItems(prev => {
      const key = `${product._id || product.id}-${size}-${color}`;
      const existing = prev.find(i => i.key === key);
      if (existing) {
        return prev.map(i => i.key === key ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { ...product, key, size, color, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((key) => {
    setCartItems(prev => prev.filter(i => i.key !== key));
  }, []);

  const updateQuantity = useCallback((key, quantity) => {
    if (quantity <= 0) setCartItems(prev => prev.filter(i => i.key !== key));
    else setCartItems(prev => prev.map(i => i.key === key ? { ...i, quantity } : i));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    if (user) clearSavedCart(user.uid).catch(() => {});
  }, [user]);

  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const requestAddToCart = useCallback((product, size, color) => {
    setConfirmItem({ product, size, color });
  }, []);

  const confirmAdd = useCallback(() => {
    if (confirmItem) {
      addToCart(confirmItem.product, confirmItem.size, confirmItem.color);
      setConfirmItem(null);
      setCartOpen(true);
    }
  }, [confirmItem, addToCart]);

  const cancelAdd = useCallback(() => setConfirmItem(null), []);

  return (
    <CartContext.Provider value={{
      cartItems, cartCount, cartTotal,
      cartOpen, setCartOpen,
      searchOpen, setSearchOpen,
      searchQuery, setSearchQuery,
      addToCart, removeFromCart, updateQuantity, clearCart,
      confirmItem, requestAddToCart, confirmAdd, cancelAdd,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
