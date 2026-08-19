import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer() {
  const { cartOpen, setCartOpen, cartItems, cartTotal, removeFromCart, updateQuantity } = useCart();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const [noteOpen, setNoteOpen] = useState(false);
  const [note, setNote] = useState('');
  const [agreed, setAgreed] = useState(false);

  return (
    <>
      <div className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${cartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setCartOpen(false)} />

      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl transition-transform duration-300 flex flex-col ${cartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-sm font-bold tracking-[0.15em] text-black uppercase">
            Cart {cartItems.length > 0 && <span className="text-gray-400 font-normal normal-case tracking-normal">({cartItems.length})</span>}
          </h2>
          <button onClick={() => setCartOpen(false)} className="p-1 text-black hover:opacity-60 transition-opacity">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="w-16 h-16 rounded-full border border-gray-200 flex items-center justify-center">
                <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              </div>
              <div>
                <p className="text-black font-semibold">Your cart is empty</p>
                <p className="text-gray-400 text-sm mt-1">Add some items to get started</p>
              </div>
              <button onClick={() => { setCartOpen(false); navigate('/products'); }} className="bg-black text-white font-medium px-6 py-2.5 text-sm hover:opacity-85 transition-opacity">
                Browse Products
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {cartItems.map(item => (
                <div key={item.key} className="flex gap-4 py-4 first:pt-0">
                  <img src={item.image} alt={item.name} className="w-[70px] h-[88px] object-cover flex-shrink-0 bg-gray-50" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] tracking-[0.1em] uppercase text-gray-400 mb-0.5">Vibe Wear</p>
                    <h4 className="text-black text-sm font-semibold leading-snug truncate">{item.name}</h4>
                    <p className="text-black text-sm font-medium mt-1">{formatPrice(item.price)}</p>
                    <p className="text-gray-400 text-[11px] tracking-[0.06em] uppercase mt-1">{item.color} / {item.size}</p>
                    <div className="flex items-center gap-3 mt-2.5">
                      <div className="flex items-center border border-gray-300">
                        <button onClick={() => updateQuantity(item.key, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center text-black hover:bg-gray-50 text-sm">−</button>
                        <span className="text-black text-sm w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.key, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center text-black hover:bg-gray-50 text-sm">+</button>
                      </div>
                      <button onClick={() => removeFromCart(item.key)} className="text-black text-xs underline hover:opacity-60 transition-opacity">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 px-5 py-4 flex-shrink-0 space-y-3">
            {/* Order note */}
            <div>
              <button onClick={() => setNoteOpen(o => !o)} className="text-xs text-black underline hover:opacity-60 transition-opacity">
                Add order note
              </button>
              {noteOpen && (
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="How can we help you?"
                  rows={2}
                  className="w-full mt-2 border border-gray-300 p-2.5 text-sm text-black outline-none focus:border-black resize-none"
                />
              )}
            </div>

            <p className="text-xs text-gray-400">Taxes and shipping calculated at checkout</p>

            <label className="flex items-start gap-2 text-xs text-black cursor-pointer">
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-0.5 accent-black" />
              I agree with the terms and conditions
            </label>

            <div className="flex justify-between items-center pt-1">
              <span className="text-sm text-gray-500">Subtotal</span>
              <span className="text-black font-bold text-lg">{formatPrice(cartTotal)}</span>
            </div>

            <button
              onClick={() => { setCartOpen(false); navigate('/cart'); }}
              className="w-full border border-black text-black font-semibold py-3 text-sm uppercase tracking-[0.08em] hover:bg-gray-50 transition-colors"
            >
              View Cart
            </button>
            <button
              onClick={() => { if (agreed) { setCartOpen(false); navigate('/checkout'); } }}
              disabled={!agreed}
              className={`w-full font-semibold py-3 text-sm uppercase tracking-[0.08em] transition-opacity ${agreed ? 'bg-black text-white hover:opacity-85 cursor-pointer' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
              Checkout · {formatPrice(cartTotal)}
            </button>
          </div>
        )}
      </div>
    </>
  );
}