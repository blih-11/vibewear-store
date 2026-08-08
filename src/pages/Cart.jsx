import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();
  const { formatPrice } = useCurrency();
  const shipping = cartTotal >= 200 ? 0 : 10;
  const grandTotal = cartTotal + shipping;

  return (
    <div style={{ background: '#fff', minHeight: '100vh', paddingTop: '64px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#000', marginBottom: '2rem' }}>Your Cart</h1>

        {cartItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <div style={{ width: '64px', height: '64px', border: '1.5px solid #e5e5e5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <svg width="24" height="24" fill="none" stroke="#ccc" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </div>
            <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '6px' }}>Your cart is empty</h3>
            <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '1.5rem' }}>Start exploring our collection</p>
            <button onClick={() => navigate('/products')}
              style={{ background: '#000', color: '#fff', border: 'none', padding: '12px 28px', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '2px' }}>
              Browse Products
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '3rem', alignItems: 'start' }} className="cart-grid">

            {/* Items */}
            <div>
              {cartItems.map(item => (
                <div key={item.key} style={{ display: 'flex', gap: '16px', padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}>
                  <img src={item.image} alt={item.name}
                    onClick={() => navigate(`/products/${item.id}`)}
                    style={{ width: '80px', height: '100px', objectFit: 'cover', borderRadius: '2px', cursor: 'pointer', background: '#f5f5f5', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontWeight: 600, fontSize: '0.88rem', color: '#000', marginBottom: '4px', cursor: 'pointer' }}
                      onClick={() => navigate(`/products/${item.id}`)}>
                      {item.name}
                    </h4>
                    <p style={{ color: '#aaa', fontSize: '0.78rem', marginBottom: '6px' }}>{item.size} · {item.color}</p>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{formatPrice(item.price)}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                      <button onClick={() => updateQuantity(item.key, item.quantity - 1)}
                        style={{ width: '30px', height: '30px', border: '1px solid #e5e5e5', background: '#fff', borderRadius: '2px', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                      <span style={{ fontSize: '0.88rem', fontWeight: 600, minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.key, item.quantity + 1)}
                        style={{ width: '30px', height: '30px', border: '1px solid #e5e5e5', background: '#fff', borderRadius: '2px', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                      <button onClick={() => removeFromCart(item.key)}
                        style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', padding: '4px' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                        onMouseLeave={e => e.currentTarget.style.color = '#ccc'}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
              <button onClick={clearCart}
                style={{ marginTop: '12px', background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                onMouseLeave={e => e.currentTarget.style.color = '#aaa'}>
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7M4 7h16" /></svg>
                Clear Cart
              </button>
            </div>

            {/* Summary */}
            <div style={{ border: '1px solid #f0f0f0', borderRadius: '4px', padding: '1.5rem', position: 'sticky', top: '80px' }}>
              <h2 style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '0.06em', marginBottom: '1.25rem' }}>Order Summary</h2>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ color: '#888', fontSize: '0.85rem' }}>Subtotal</span>
                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{formatPrice(cartTotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span style={{ color: '#888', fontSize: '0.85rem' }}>Shipping</span>
                <span style={{ fontWeight: 600, fontSize: '0.85rem', color: shipping === 0 ? '#22c55e' : '#000' }}>
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </span>
              </div>
              <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '1rem', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Total</span>
                <span style={{ fontWeight: 800, fontSize: '1.3rem' }}>{formatPrice(grandTotal)}</span>
              </div>
              <button onClick={() => navigate('/checkout')}
                style={{ width: '100%', background: '#000', color: '#fff', border: 'none', padding: '14px', fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '2px', marginBottom: '10px', transition: 'opacity 0.2s' }}
                onMouseEnter={e => e.target.style.opacity = '0.85'}
                onMouseLeave={e => e.target.style.opacity = '1'}>
                Proceed to Checkout
              </button>
              <button onClick={() => navigate('/products')}
                style={{ width: '100%', background: '#fff', color: '#555', border: '1px solid #e5e5e5', padding: '12px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', borderRadius: '2px', transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.target.style.borderColor = '#000'}
                onMouseLeave={e => e.target.style.borderColor = '#e5e5e5'}>
                Continue Shopping
              </button>
              <p style={{ color: '#aaa', fontSize: '0.72rem', textAlign: 'center', marginTop: '10px' }}>
                Secure checkout via Flutterwave
              </p>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @media(max-width: 767px) {
          .cart-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
