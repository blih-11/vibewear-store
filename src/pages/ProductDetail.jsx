import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import ProductCard from '../components/ProductCard';
import PageLoader from '../components/PageLoader';
import Seo from '../components/Seo';
import { optimizeImage } from '../lib/optimizeImage';

const SITE_URL = 'https://vibewear.online';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const ALL_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const BRAND_LABEL = 'Vibe Wear';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { requestAddToCart } = useCart();
  const { formatPrice } = useCurrency();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImg, setSelectedImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const imgRefs = useRef([]);

  useEffect(() => {
    setLoading(true);
    setSelectedSize(null); setSelectedImg(0); setQuantity(1);

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
              applyProduct(data.product, all.success ? all.products : []);
            });
        }
        setProduct(null);
      })
      .catch(() => {
        setProduct(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageLoader />;

  if (!product) return (
    <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
      <Seo title="Product Not Found" path={`/products/${id}`} noindex />
      <h2 style={{ fontWeight: 800, fontSize: '1.5rem' }}>Product not found</h2>
      <button onClick={() => navigate('/products')} style={{ color: '#aaa', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline' }}>Browse Products</button>
    </div>
  );

  const images = product.images?.length > 0 ? product.images : [product.image];

  const jumpToImage = (i) => {
    setSelectedImg(i);
    imgRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleAddToCart = () => {
    requestAddToCart(product, selectedSize, null, quantity);
  };

  // Bullet-point description lines, e.g. "*100% Cotton" / "*Boxy Fit" — split on newlines,
  // falling back to sentence-splitting if the admin entered it as one paragraph.
  const descLines = (product.description || '')
    .split(/\r?\n/)
    .flatMap(line => line.trim() ? line.split(/(?<=[.])\s+(?=[A-Z*])/) : [])
    .map(l => l.trim())
    .filter(Boolean);

  const productId = product._id || product.id;
  const productImage = images[0]?.startsWith('http') ? images[0] : `${SITE_URL}${images[0]}`;
  const plainDescription = (product.description || `${product.name} — available now at Vibewear.`).slice(0, 160);

  return (
    <div style={{ background: '#fff', minHeight: '100vh', paddingTop: '64px' }}>
      <Seo
        title={product.name}
        description={plainDescription}
        path={`/products/${productId}`}
        image={productImage}
      />
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem 1.5rem 0' }}>
        {/* Breadcrumb */}
        <nav style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '1.5rem', fontSize: '0.75rem', color: '#aaa' }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: 0 }}
            onMouseEnter={e => e.target.style.color = '#000'} onMouseLeave={e => e.target.style.color = '#aaa'}>Home</button>
          <span>/</span>
          <button onClick={() => navigate('/products')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: 0 }}
            onMouseEnter={e => e.target.style.color = '#000'} onMouseLeave={e => e.target.style.color = '#aaa'}>Shop</button>
          <span>/</span>
          <span style={{ color: '#000', fontWeight: 500 }}>{product.name}</span>
        </nav>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem 5rem' }}>
        <div className="pd-grid">

          {/* ── Desktop gallery: vertical thumbnail rail (one per photo) + stacked full images ── */}
          <div className="pd-gallery pd-gallery-desktop">
            {images.length > 1 && (
              <div className="pd-thumbs">
                {images.map((img, i) => (
                  <button key={i} onClick={() => jumpToImage(i)}
                    style={{
                      width: '100%', aspectRatio: '3/4', overflow: 'hidden', padding: 0, cursor: 'pointer',
                      border: '2px solid', borderColor: selectedImg === i ? '#000' : '#e5e5e5', background: '#f8f8f8',
                    }}>
                    <img src={optimizeImage(img, { width: 300 })} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                  </button>
                ))}
              </div>
            )}

            <div className="pd-main-images">
              {images.map((img, i) => (
                <div key={i} ref={el => imgRefs.current[i] = el}
                  style={{ aspectRatio: '4/5', overflow: 'hidden', background: '#f8f8f8' }}>
                  <img src={optimizeImage(img, { width: 1000 })} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                </div>
              ))}
            </div>
          </div>

          {/* ── Mobile gallery: one large main image + horizontal thumbnail strip below ── */}
          <div className="pd-gallery-mobile">
            <div style={{ aspectRatio: '4/5', overflow: 'hidden', background: '#f8f8f8' }}>
              <img src={optimizeImage(images[selectedImg] || product.image, { width: 900 })} alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
            </div>
            {images.length > 1 && (
              <div className="pd-thumbs-mobile">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImg(i)}
                    style={{
                      width: '64px', height: '80px', flexShrink: 0, overflow: 'hidden', padding: 0, cursor: 'pointer',
                      border: '2px solid', borderColor: selectedImg === i ? '#000' : '#e5e5e5', background: '#f8f8f8',
                    }}>
                    <img src={optimizeImage(img, { width: 200 })} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Info ── */}
          <div className="pd-info">
            <p style={{ fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#888', marginBottom: '6px' }}>{BRAND_LABEL}</p>
            <h1 style={{ fontSize: '1.15rem', fontWeight: 700, letterSpacing: '0.02em', textTransform: 'uppercase', color: '#000', lineHeight: 1.3, marginBottom: '10px' }}>{product.name}</h1>
            <p style={{ fontSize: '1rem', color: '#000', marginBottom: '18px' }}>
              {formatPrice(product.price)}
            </p>

            <div style={{ borderTop: '1px solid #eee', marginBottom: '20px' }} />

            {/* Size */}
            {product.sizes?.length > 0 && (
              <div style={{ marginBottom: '22px' }}>
                <p style={{ fontSize: '0.8rem', color: '#000', marginBottom: '10px' }}>
                  Size{selectedSize ? `: ${selectedSize}` : ''} <span style={{ color: '#aaa' }}>(optional)</span>
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {ALL_SIZES.map(size => {
                    const available = product.sizes.includes(size);
                    const selected = selectedSize === size;
                    return (
                      <button key={size} disabled={!available}
                        onClick={() => setSelectedSize(size)}
                        style={{
                          position: 'relative', width: '48px', height: '40px',
                          border: '1px solid', borderColor: selected ? '#000' : '#e5e5e5',
                          background: selected ? '#000' : '#fff',
                          color: available ? (selected ? '#fff' : '#000') : '#ccc',
                          fontSize: '0.8rem', fontWeight: 500,
                          cursor: available ? 'pointer' : 'not-allowed',
                          overflow: 'hidden',
                        }}>
                        {size}
                        {!available && (
                          <span style={{
                            position: 'absolute', left: '-4px', top: '50%', width: '58px', height: '1px',
                            background: '#ccc', transform: 'rotate(-24deg)',
                          }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div style={{ marginBottom: '22px' }}>
              <p style={{ fontSize: '0.8rem', color: '#000', marginBottom: '10px' }}>Quantity</p>
              <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid #e5e5e5' }}>
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  style={{ width: '38px', height: '38px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1rem', color: '#000' }}>−</button>
                <span style={{ width: '36px', textAlign: 'center', fontSize: '0.9rem', color: '#000' }}>{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)}
                  style={{ width: '38px', height: '38px', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1rem', color: '#000' }}>+</button>
              </div>
            </div>

            {/* Add to cart */}
            <button onClick={handleAddToCart} disabled={!product.inStock}
              style={{
                width: '100%', background: '#000', color: '#fff', border: 'none', padding: '15px',
                fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                cursor: product.inStock ? 'pointer' : 'not-allowed', opacity: product.inStock ? 1 : 0.4,
                marginBottom: '10px', transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => { if (product.inStock) e.target.style.opacity = '0.85'; }}
              onMouseLeave={e => { if (product.inStock) e.target.style.opacity = '1'; }}>
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
            <button onClick={() => navigate('/cart')}
              style={{ width: '100%', padding: '13px', border: '1px solid #e5e5e5', background: '#fff', color: '#555', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, marginBottom: '28px' }}
              onMouseEnter={e => e.target.style.borderColor = '#000'}
              onMouseLeave={e => e.target.style.borderColor = '#e5e5e5'}>
              View Cart
            </button>

            {/* Description — bullet lines */}
            {descLines.length > 0 && (
              <div style={{ borderTop: '1px solid #eee', paddingTop: '18px' }}>
                {descLines.map((line, i) => (
                  <p key={i} style={{ fontSize: '0.82rem', color: '#555', lineHeight: 1.9 }}>
                    {line.startsWith('*') ? line : `*${line}`}
                  </p>
                ))}
              </div>
            )}
            {product.tags?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '14px' }}>
                {product.tags.map(tag => (
                  <span key={tag} style={{ background: '#f5f5f5', color: '#888', fontSize: '10px', padding: '4px 10px', textTransform: 'capitalize', letterSpacing: '0.06em' }}>{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '3rem', marginTop: '4rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>You May Also Like</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
              {related.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }

        .pd-grid {
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 4rem;
          align-items: start;
        }
        /* Flex, not grid — a single child (main images) must be free to take the
           full width when there's no thumbnail rail (single-image products).
           With a 2-column grid, a lone child gets auto-placed into the first
           (80px) track and the image effectively disappears. */
        .pd-gallery {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }
        .pd-thumbs {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 0 0 80px;
          position: sticky;
          top: 84px;
        }
        .pd-main-images {
          flex: 1 1 0%;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .pd-info {
          position: sticky;
          top: 84px;
        }

        /* Mobile gallery hidden on desktop by default */
        .pd-gallery-mobile { display: none; }

        @media (max-width: 900px) {
          .pd-grid { grid-template-columns: 1fr; gap: 2rem; }
          .pd-info { position: static; }
        }

        @media (max-width: 640px) {
          .pd-gallery-desktop { display: none; }
          .pd-gallery-mobile { display: block; }
          .pd-thumbs-mobile {
            display: flex;
            gap: 8px;
            margin-top: 10px;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            padding-bottom: 2px;
          }
          .pd-thumbs-mobile::-webkit-scrollbar { display: none; }
        }
      `}</style>
    </div>
  );
}