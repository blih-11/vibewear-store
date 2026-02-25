import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();
  const { formatPrice } = useCurrency();
  const shipping = cartTotal >= 200 ? 0 : 10;
  const grandTotal = cartTotal + shipping;

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    navigate('/checkout');
  };

  return (
    <div className="bg-brand-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8 mt-5">
          {/* <span className="text-white text-xs font-semibold uppercase tracking-widest">Review</span> */}
          <h1 className="text-brand-cream text-3xl md:text-4xl font-bold mt-1">Your Cart</h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-5 text-center">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
              <svg className="w-8 h-8 text-brand-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </div>
            <div>
              <h3 className="text-brand-cream font-bold text-xl mb-1">Your cart is empty</h3>
              <p className="text-brand-muted text-sm">Start exploring our collection</p>
            </div>
            <button onClick={() => navigate('/products')} className="bg-black text-white border border-white/20 font-semibold px-8 py-3 rounded-xl hover:bg-white hover:text-black transition-all">
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_360px] gap-10">
            {/* Items */}
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.key} className="flex gap-4 p-4 bg-white/3 border border-white/7 rounded-2xl">
                  <img src={item.image} alt={item.name} onClick={() => navigate(`/products/${item.id}`)}
                    className="w-20 h-24 object-cover rounded-xl cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-brand-cream font-medium text-sm leading-snug cursor-pointer hover:text-white transition-colors" onClick={() => navigate(`/products/${item.id}`)}>
                      {item.name}
                    </h4>
                    <p className="text-brand-muted text-xs mt-0.5">{item.size} · {item.color}</p>
                    <p className="text-brand-cream font-bold mt-1">{formatPrice(item.price)}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <button onClick={() => updateQuantity(item.key, item.quantity - 1)} className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-brand-cream hover:border-white/50 text-sm">−</button>
                      <span className="text-brand-cream text-sm w-5 text-center font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.key, item.quantity + 1)} className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-brand-cream hover:border-white/50 text-sm">+</button>
                      <button onClick={() => removeFromCart(item.key)} className="ml-auto text-brand-muted hover:text-red-400 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                  <div className="hidden sm:block text-right flex-shrink-0">
                    <p className="text-brand-cream font-bold">{formatPrice(item.price * item.quantity)}</p>
                    {item.quantity > 1 && <p className="text-brand-muted text-xs">{formatPrice(item.price)} each</p>}
                  </div>
                </div>
              ))}
              <button onClick={clearCart} className="flex items-center gap-1.5 text-brand-muted hover:text-red-400 transition-colors text-xs mt-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7M4 7h16" /></svg>
                Clear Cart
              </button>
            </div>

            {/* Summary */}
            <div className="self-start lg:sticky lg:top-24">
              <div className="bg-white/4 border border-white/8 rounded-2xl p-6">
                <h2 className="text-brand-cream font-bold text-lg mb-5">Order Summary</h2>
                <div className="space-y-3 mb-5">
                  <div className="flex justify-between">
                    <span className="text-brand-muted text-sm">Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
                    <span className="text-brand-cream font-medium text-sm">{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-muted text-sm">Shipping</span>
                    <span className={`text-sm font-medium ${shipping === 0 ? 'text-green-400' : 'text-brand-cream'}`}>
                      {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                    </span>
                  </div>
                </div>
                <div className="border-t border-white/8 pt-4 mb-5">
                  <div className="flex justify-between items-center">
                    <span className="text-brand-cream font-semibold">Total</span>
                    <span className="text-brand-cream font-black text-2xl">{formatPrice(grandTotal)}</span>
                  </div>
                </div>
                <button onClick={handleCheckout} className="w-full bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-brand-cream transition-colors mb-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                  Proceed to Checkout
                </button>
                <p className="text-brand-muted text-xs text-center mb-4">Pay securely with card or bank transfer via Flutterwave.</p>
                <button onClick={() => navigate('/products')} className="w-full border border-white/12 text-brand-muted text-sm py-3 rounded-xl hover:border-white/30 hover:text-brand-cream transition-all">
                  Continue Shopping
                </button>
              </div>
              <div className="mt-4 space-y-2.5">
                {[['🔒', 'Secure Checkout', 'Your data is protected'], ['📦', 'Fast Delivery', '3–7 business days'], ['↩️', 'Easy Returns', '30-day return policy']].map(([icon, label, sub]) => (
                  <div key={label} className="flex items-center gap-3 text-brand-muted">
                    <span className="text-lg">{icon}</span>
                    <div><p className="text-brand-cream text-xs font-medium">{label}</p><p className="text-xs">{sub}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
