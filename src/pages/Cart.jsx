import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, removeFromCart, updateQuantity } = useCart();
  const { formatPrice } = useCurrency();
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState('');

  if (cartItems.length === 0) {
    return (
      <div className="bg-white min-h-screen pt-16">
        <div className="max-w-[1100px] mx-auto px-6 py-20 text-center">
          <div className="w-16 h-16 border border-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="24" height="24" fill="none" stroke="#ccc" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          </div>
          <h3 className="font-bold text-lg mb-1.5">Your cart is empty</h3>
          <p className="text-gray-400 text-sm mb-6">Start exploring our collection</p>
          <button onClick={() => navigate('/products')}
            className="bg-black text-white font-bold text-xs uppercase tracking-[0.08em] px-7 py-3 hover:opacity-85 transition-opacity">
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 sm:py-10">

        {/* Header row — spans full width on both breakpoints */}
        <div className="flex items-center justify-between pb-5 border-b border-gray-200">
          <h1 className="text-xl sm:text-2xl text-black">
            Cart <span className="text-gray-400">({cartItems.length})</span>
          </h1>
          <button onClick={() => navigate('/products')}
            className="border border-black text-black text-[11px] sm:text-xs font-semibold uppercase tracking-[0.08em] px-3 sm:px-5 py-2 sm:py-2.5 hover:bg-black hover:text-white transition-colors">
            Continue Shopping
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-0 md:gap-12">

          {/* ── Items ── */}
          <div className="flex-1 min-w-0">
            {cartItems.map(item => (
              <div key={item.key} className="flex gap-4 py-5 border-b border-gray-200">
                <img
                  src={item.image}
                  alt={item.name}
                  onClick={() => navigate(`/products/${item._id || item.id}`)}
                  className="w-20 h-24 sm:w-28 sm:h-32 object-cover bg-gray-50 flex-shrink-0 cursor-pointer"
                />

                <div className="flex-1 min-w-0 flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div className="min-w-0">
                    <h4
                      onClick={() => navigate(`/products/${item._id || item.id}`)}
                      className="text-black text-[15px] font-medium leading-snug cursor-pointer hover:opacity-70 transition-opacity"
                    >
                      {item.name}
                    </h4>

                    {/* Price — shown here on mobile only, right column handles desktop */}
                    <p className="md:hidden text-black text-sm mt-1">{formatPrice(item.price)}</p>

                    <p className="text-gray-500 text-sm mt-2 md:mt-1">Size: {item.size}</p>
                    {item.color && <p className="text-gray-500 text-sm">Color: {item.color}</p>}

                    {/* Qty + Remove — mobile position, right under size/color */}
                    <div className="md:hidden flex items-center gap-4 mt-3">
                      <div className="flex items-center border border-gray-300">
                        <button onClick={() => updateQuantity(item.key, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-black hover:bg-gray-50">−</button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.key, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-black hover:bg-gray-50">+</button>
                      </div>
                      <button onClick={() => removeFromCart(item.key)} className="text-black text-xs uppercase tracking-[0.06em] underline">
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Price + qty + remove — desktop-only right-aligned column */}
                  <div className="hidden md:flex flex-col items-end gap-3 flex-shrink-0">
                    <p className="text-black text-[15px]">{formatPrice(item.price)}</p>
                    <div className="flex items-center border border-gray-300">
                      <button onClick={() => updateQuantity(item.key, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-black hover:bg-gray-50">−</button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.key, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-black hover:bg-gray-50">+</button>
                    </div>
                    <button onClick={() => removeFromCart(item.key)} className="text-black text-xs uppercase tracking-[0.06em] underline">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Sidebar ── */}
          <div className="md:w-[320px] md:border-l md:border-gray-200 md:pl-10 flex-shrink-0">
            <div className="flex justify-between items-center py-5 border-b border-gray-200 md:pt-0">
              <span className="text-gray-500 text-xs uppercase tracking-[0.1em]">Subtotal</span>
              <span className="text-black text-base font-medium">{formatPrice(cartTotal)}</span>
            </div>

            <button
              onClick={() => setNoteOpen(o => !o)}
              className="w-full flex justify-between items-center py-4 border-b border-gray-200 text-left"
            >
              <span className="text-black text-sm">Leave A Note</span>
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${noteOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {noteOpen && (
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Add a note (optional)"
                rows={3}
                className="w-full mt-3 border border-gray-300 p-3 text-sm text-black outline-none focus:border-black resize-none"
              />
            )}

            <button
              onClick={() => navigate('/checkout')}
              className="w-full mt-5 flex items-center justify-center gap-2 bg-black text-white font-semibold text-xs uppercase tracking-[0.12em] py-3.5 hover:opacity-85 transition-opacity"
            >
              <svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              Check Out
            </button>

            <p className="text-gray-400 text-[11px] italic mt-3">
              Shipping, taxes, and discount codes are calculated at checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}