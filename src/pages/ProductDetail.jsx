import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import StarRating from '../components/StarRating';
import ProductCard from '../components/ProductCard';
import { products as localProducts } from '../data/products';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { requestAddToCart, setCartOpen } = useCart();
  const { formatPrice } = useCurrency();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedImg, setSelectedImg] = useState(0);
  const [sizeError, setSizeError] = useState(false);
  const [colorError, setColorError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setSelectedSize(null); setSelectedColor(null); setSelectedImg(0);

    const applyProduct = (prod, allProds) => {
      setProduct(prod);
      const rel = allProds
        .filter(p => String(p._id || p.id) !== String(prod._id || prod.id) &&
          p.category?.some(c => prod.category?.includes(c)))
        .slice(0, 4);
      setRelated(rel);
    };

    fetch(`${BASE}/products/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.product) {
          return fetch(`${BASE}/products`)
            .then(r => r.json())
            .then(all => {
              applyProduct(data.product, all.success ? all.products : localProducts);
            });
        }
        // Server responded but no product — try local
        const local = localProducts.find(p => String(p.id) === String(id) || String(p._id) === String(id));
        if (local) applyProduct(local, localProducts);
      })
      .catch(() => {
        // Server down — use local data
        const local = localProducts.find(p => String(p.id) === String(id) || String(p._id) === String(id));
        if (local) applyProduct(local, localProducts);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '32px', height: '32px', border: '2px solid #f0f0f0', borderTopColor: '#000', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!product) return (
    <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
      <h2 style={{ fontWeight: 800, fontSize: '1.5rem' }}>Product not found</h2>
      <button onClick={() => navigate('/products')} style={{ color: '#aaa', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline' }}>Browse Products</button>
    </div>
  );

  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : null;
  const images = product.images?.length > 0 ? product.images : [product.image];

  const handleAddToCart = () => {
    if (!selectedSize) { setSizeError(true); return; }
    if (!selectedColor) { setColorError(true); return; }
    setSizeError(false); setColorError(false);
    requestAddToCart(product, selectedSize, selectedColor);
  };

  const btnStyle = (selected, error) => ({
    padding: '8px 16px', borderRadius: '2px', border: '1px solid',
    borderColor: error ? '#ef4444' : selected ? '#000' : '#e5e5e5',
    background: selected ? '#000' : '#fff',
    color: selected ? '#fff' : '#555',
    cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
    transition: 'all 0.15s',
  });

  return (
    <div style={{ background: '#fff', minHeight: '100vh', paddingTop: '64px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Breadcrumb */}
        <nav style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '2rem', fontSize: '0.75rem', color: '#aaa' }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: 0 }}
            onMouseEnter={e => e.target.style.color = '#000'} onMouseLeave={e => e.target.style.color = '#aaa'}>Home</button>
          <span>/</span>
          <button onClick={() => navigate('/products')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: 0 }}
            onMouseEnter={e => e.target.style.color = '#000'} onMouseLeave={e => e.target.style.color = '#aaa'}>Shop</button>
          <span>/</span>
          <span style={{ color: '#000', fontWeight: 500 }}>{product.name}</span>
        </nav>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginBottom: '5rem' }} className="product-grid">

          {/* Images */}
          <div>
            <div style={{ aspectRatio: '4/5', overflow: 'hidden', background: '#f8f8f8', marginBottom: '8px' }}>
              <img src={images[selectedImg] || product.image} alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
            </div>
            {images.length > 1 && (
              <div style={{ display: 'flex', gap: '6px' }}>
                {images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImg(i)}
                    style={{ width: '72px', height: '88px', overflow: 'hidden', border: '2px solid', borderColor: selectedImg === i ? '#000' : '#e5e5e5', background: '#f8f8f8', padding: 0, cursor: 'pointer', borderRadius: '2px' }}>
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              {product.isNew && <span style={{ background: '#000', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '3px 10px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>NEW</span>}
              {discount && <span style={{ background: '#f5f5f5', color: '#000', fontSize: '10px', fontWeight: 700, padding: '3px 10px', letterSpacing: '0.08em' }}>-{discount}% OFF</span>}
              {!product.inStock && <span style={{ background: '#f5f5f5', color: '#888', fontSize: '10px', fontWeight: 700, padding: '3px 10px', letterSpacing: '0.08em' }}>SOLD OUT</span>}
            </div>

            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#000', lineHeight: 1.2, marginBottom: '10px' }}>{product.name}</h1>
            <div style={{ marginBottom: '16px' }}><StarRating rating={product.rating} reviews={product.reviews} size="md" /></div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '6px' }}>
              <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#000' }}>{formatPrice(product.price)}</span>
              {product.originalPrice && <span style={{ fontSize: '1rem', color: '#aaa', textDecoration: 'line-through' }}>{formatPrice(product.originalPrice)}</span>}
            </div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: product.inStock ? '#22c55e' : '#ef4444', marginBottom: '24px', letterSpacing: '0.06em' }}>
              {product.inStock ? '● In Stock' : '● Out of Stock'}
            </div>

            {/* Color */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Color {selectedColor && <span style={{ fontWeight: 400, color: '#888' }}>— {selectedColor}</span>}
                </label>
                {colorError && <span style={{ color: '#ef4444', fontSize: '0.72rem' }}>Select a color</span>}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {product.colors?.map(color => (
                  <button key={color} onClick={() => { setSelectedColor(color); setColorError(false); }}
                    style={btnStyle(selectedColor === color, colorError && !selectedColor)}>
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Size {selectedSize && <span style={{ fontWeight: 400, color: '#888' }}>— {selectedSize}</span>}
                </label>
                {sizeError && <span style={{ color: '#ef4444', fontSize: '0.72rem' }}>Select a size</span>}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {product.sizes?.map(size => (
                  <button key={size} onClick={() => { setSelectedSize(size); setSizeError(false); }}
                    style={{ ...btnStyle(selectedSize === size, sizeError && !selectedSize), minWidth: '48px' }}>
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
              <button onClick={handleAddToCart} disabled={!product.inStock}
                style={{ flex: 1, background: '#000', color: '#fff', border: 'none', padding: '14px', fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: product.inStock ? 'pointer' : 'not-allowed', borderRadius: '2px', opacity: product.inStock ? 1 : 0.4, transition: 'opacity 0.2s' }}
                onMouseEnter={e => { if (product.inStock) e.target.style.opacity = '0.85'; }}
                onMouseLeave={e => { if (product.inStock) e.target.style.opacity = '1'; }}>
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button onClick={() => setCartOpen(true)}
                style={{ padding: '14px 20px', border: '1px solid #e5e5e5', background: '#fff', color: '#555', cursor: 'pointer', borderRadius: '2px', fontSize: '0.82rem', fontWeight: 600, transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.target.style.borderColor = '#000'}
                onMouseLeave={e => e.target.style.borderColor = '#e5e5e5'}>
                View Cart
              </button>
            </div>

            {/* Description */}
            <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '20px' }}>
              <h3 style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>Details</h3>
              <p style={{ color: '#666', fontSize: '0.85rem', lineHeight: 1.7 }}>{product.description}</p>
            </div>
            {product.tags?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '14px' }}>
                {product.tags.map(tag => (
                  <span key={tag} style={{ background: '#f5f5f5', color: '#888', fontSize: '10px', padding: '4px 10px', borderRadius: '2px', textTransform: 'capitalize', letterSpacing: '0.06em' }}>{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '3rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>You May Also Like</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
              {related.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        )}
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media(max-width: 767px) { .product-grid { grid-template-columns: 1fr !important; gap: 2rem !important; } }
      `}</style>
    </div>
  );
}