import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import StarRating from './StarRating';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { requestAddToCart } = useCart();
  const { formatPrice } = useCurrency();

  const price = Number(product?.price) || 0;
  const originalPrice = Number(product?.originalPrice) || null;
  const discount = originalPrice && price ? Math.round((1 - price / originalPrice) * 100) : null;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const size = product?.sizes?.[0] ?? 'One Size';
    const color = product?.colors?.[0] ?? 'Default';
    requestAddToCart(product, size, color);
  };

  return (
    <div
      onClick={() => navigate(`/products/${product._id || product.id}`)}
      style={{ cursor: 'pointer', background: '#fff', border: '1px solid #f0f0f0', borderRadius: '4px', overflow: 'hidden', transition: 'box-shadow 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: '#f8f8f8' }}>
        <img
          src={product?.image}
          alt={product?.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
          loading="lazy"
          onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
        />
        {/* Badges */}
        <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {product?.isNew && (
            <span style={{ background: '#000', color: '#fff', fontSize: '9px', fontWeight: 700, padding: '3px 8px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>NEW</span>
          )}
          {discount && (
            <span style={{ background: '#000', color: '#fff', fontSize: '9px', fontWeight: 700, padding: '3px 8px', letterSpacing: '0.08em' }}>-{discount}%</span>
          )}
          {!product?.inStock && (
            <span style={{ background: '#666', color: '#fff', fontSize: '9px', fontWeight: 700, padding: '3px 8px', letterSpacing: '0.08em' }}>SOLD OUT</span>
          )}
        </div>

        {/* Quick add + button */}
        {product?.inStock && (
          <button
            onClick={handleAddToCart}
            style={{
              position: 'absolute', bottom: '10px', right: '10px',
              width: '36px', height: '36px', borderRadius: '50%',
              background: '#000', color: '#fff', border: 'none',
              cursor: 'pointer', fontSize: '20px', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              transition: 'transform 0.2s, opacity 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            title="Quick Add"
          >
            +
          </button>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '12px 12px 14px' }}>
        <StarRating rating={product?.rating || 0} reviews={product?.reviews || 0} />
        <h3 style={{ color: '#000', fontSize: '0.82rem', fontWeight: 500, marginTop: '6px', marginBottom: '4px', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product?.name || 'Unnamed Product'}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#000', fontWeight: 700, fontSize: '0.9rem' }}>{formatPrice(price)}</span>
          {originalPrice && (
            <span style={{ color: '#aaa', fontSize: '0.8rem', textDecoration: 'line-through' }}>{formatPrice(originalPrice)}</span>
          )}
        </div>
        <div style={{ fontSize: '10px', fontWeight: 600, marginTop: '4px', color: product?.inStock ? '#22c55e' : '#ef4444', letterSpacing: '0.04em' }}>
          {product?.inStock ? '● In Stock' : '● Out of Stock'}
        </div>
      </div>
    </div>
  );
}