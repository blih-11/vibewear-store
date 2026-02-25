import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer() {
  const { cartOpen, setCartOpen, cartItems, cartTotal, removeFromCart, updateQuantity } = useCart();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();

  return (
    <>
      <div className={`fixed inset-0 bg-black/60 z-[60] transition-opacity duration-300 ${cartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setCartOpen(false)} />

<div className={`fixed top-0  right-0 h-full w-full max-w-md bg-brand-bg z-[70] shadow-2xl transition-transform duration-300 flex flex-col pb-[70px] ${cartOpen ? 'translate-x-0' : 'translate-x-full'}`}>        {/* Header */}
        <div className="flex mt-12 items-center justify-between p-5 border-b border-white/8">
          <h2 className="text-lg font-bold text-brand-cream">
            Your Cart {cartItems.length > 0 && <span className="text-brand-muted font-normal text-sm">({cartItems.length})</span>}
          </h2>
          <button onClick={() => setCartOpen(false)} className="p-2 text-brand-muted hover:text-brand-cream transition-colors rounded-lg hover:bg-white/5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center">
                <svg className="w-7 h-7 text-brand-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              </div>
              <div>
                <p className="text-brand-cream font-semibold">Your cart is empty</p>
                <p className="text-brand-muted text-sm mt-1">Add some items to get started</p>
              </div>
              <button onClick={() => { setCartOpen(false); navigate('/products'); }} className="bg-black text-white border border-white/20 font-medium px-6 py-2.5 rounded-lg text-sm hover:bg-white hover:text-black transition-all">
                Browse Products
              </button>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.key} className="flex gap-3 p-3 bg-white/4 rounded-xl border border-white/6">
                <img src={item.image} alt={item.name} className="w-18 h-22 w-[72px] h-[86px] object-cover rounded-lg flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-brand-cream text-sm font-medium leading-snug truncate">{item.name}</h4>
                  <p className="text-brand-muted text-xs mt-0.5">{item.size} · {item.color}</p>
                  <p className="text-brand-cream font-bold mt-1">{formatPrice(item.price)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQuantity(item.key, item.quantity - 1)} className="w-7 h-7 rounded-full border border-white/15 flex items-center justify-center text-brand-cream hover:border-brand-accent text-sm">−</button>
                    <span className="text-brand-cream text-sm w-5 text-center font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.key, item.quantity + 1)} className="w-7 h-7 rounded-full border border-white/15 flex items-center justify-center text-brand-cream hover:border-brand-accent text-sm">+</button>
                    <button onClick={() => removeFromCart(item.key)} className="ml-auto text-brand-muted hover:text-red-400 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-5 border-t  border-white/8 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-brand-muted text-sm">Subtotal</span>
              <span className="text-brand-cream font-bold text-xl">{formatPrice(cartTotal)}</span>
            </div>
            <button onClick={() => { setCartOpen(false); navigate('/cart'); }} className="w-full bg-black text-white border border-white/20 font-semibold py-3.5 rounded-xl hover:bg-white hover:text-black transition-all">
              View Cart & Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
