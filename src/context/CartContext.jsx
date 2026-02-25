import { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmItem, setConfirmItem] = useState(null); // item pending confirmation

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
    if (quantity <= 0) {
      setCartItems(prev => prev.filter(i => i.key !== key));
    } else {
      setCartItems(prev => prev.map(i => i.key === key ? { ...i, quantity } : i));
    }
  }, []);

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

  const cancelAdd = useCallback(() => {
    setConfirmItem(null);
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

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
