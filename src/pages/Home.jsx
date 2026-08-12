import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import HeroSlider from '../components/HeroSlider';
import ProductCard from '../components/ProductCard';
import InstagramEmbed from '../components/InstagramEmbed';
import StoreShowcase from '../components/StoreShowcase';
import CategoryShowcase from '../components/CategoryShowcase';
import FeaturedEditorial from '../components/FeaturedEditorial';
import { heroSlides, products as localProducts, igSliderImages } from '../data/products';
import { fetchProducts, fetchInstagramPosts } from '../lib/api';

const normalisedLocal = localProducts.map(p => ({ ...p, _id: p._id || String(p.id) }));

// ═══════════════════════════════════════════════════════════════════════════
// STORE SHOWCASE PHOTO — edit this path, not StoreShowcase.jsx.
// File must exist in /public/images/. Leave as null to show the placeholder.
// ═══════════════════════════════════════════════════════════════════════════
const SHOWCASE_1_IMAGE = '/images/store.jpg';

const IG_GRID_DESKTOP = igSliderImages.slice(0, 12);

// Manual (no autoplay) paged slider — drag/swipe or click the dots to move between pages.
// Used for the Instagram section on both mobile (1 item/page) and desktop (3 items/page).
function IgSlider({ items, pageSize, columns, renderItem }) {
  const pages = [];
  for (let i = 0; i < items.length; i += pageSize) pages.push(items.slice(i, i + pageSize));

  const [index, setIndex] = useState(0);
  const dragRef = useRef({ startX: 0, dragging: false, delta: 0, pointerId: null });
  const wasDragging = useRef(false);

  useEffect(() => {
    if (index > pages.length - 1) setIndex(Math.max(0, pages.length - 1));
  }, [pages.length]); // eslint-disable-line react-hooks/exhaustive-deps

  if (pages.length === 0) return null;

  const clamp = (i) => Math.max(0, Math.min(pages.length - 1, i));

  // Pointer Events + setPointerCapture so dragging keeps tracking even if the cursor leaves
  // the track's bounds mid-swipe — plain onMouseLeave-based drags break for mouse users
  // (touch doesn't have this problem, which is why it can look like "only touch works").
  const onPointerDown = (e) => {
    if (pages.length <= 1) return;
    dragRef.current = { startX: e.clientX, dragging: true, delta: 0, pointerId: e.pointerId };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragRef.current.dragging) return;
    dragRef.current.delta = e.clientX - dragRef.current.startX;
  };
  const endDrag = (e) => {
    if (!dragRef.current.dragging) return;
    const { delta, pointerId } = dragRef.current;
    dragRef.current.dragging = false;
    wasDragging.current = Math.abs(delta) > 8;
    if (Math.abs(delta) > 40) setIndex(i => clamp(i + (delta < 0 ? 1 : -1)));
    try { e.currentTarget.releasePointerCapture(pointerId); } catch { /* already released */ }
  };
  const onClickCapture = (e) => {
    if (wasDragging.current) { e.preventDefault(); e.stopPropagation(); wasDragging.current = false; }
  };

  return (
    <div style={{ overflow: 'hidden' }}>
      <div
        onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={endDrag} onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        onDragStart={e => e.preventDefault()}
        style={{
          display: 'flex',
          transform: `translateX(-${index * 100}%)`,
          transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)',
          cursor: pages.length > 1 ? 'grab' : 'default',
          touchAction: 'pan-y',
          userSelect: 'none',
        }}
      >
        {pages.map((page, pi) => (
          <div key={pi} style={{
            flexShrink: 0, width: '100%',
            display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: columns === 1 ? 0 : '16px',
          }}>
            {page.map((item, ii) => renderItem(item, `${pi}-${ii}`))}
          </div>
        ))}
      </div>
      {pages.length > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', marginTop: '14px' }}>
          <button onClick={() => setIndex(i => clamp(i - 1))} disabled={index === 0}
            aria-label="Previous"
            style={{
              width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #ddd',
              background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: index === 0 ? 'default' : 'pointer', opacity: index === 0 ? 0.3 : 1,
              transition: 'opacity 0.2s', flexShrink: 0, padding: 0,
            }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
          </button>

          <div style={{ display: 'flex', gap: '6px' }}>
            {pages.map((_, i) => (
              <button key={i} onClick={() => setIndex(i)}
                style={{
                  width: i === index ? '20px' : '6px',
                  height: '6px',
                  borderRadius: '3px',
                  border: 'none',
                  background: i === index ? '#000' : '#ccc',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>

          <button onClick={() => setIndex(i => clamp(i + 1))} disabled={index === pages.length - 1}
            aria-label="Next"
            style={{
              width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #ddd',
              background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: index === pages.length - 1 ? 'default' : 'pointer', opacity: index === pages.length - 1 ? 0.3 : 1,
              transition: 'opacity 0.2s', flexShrink: 0, padding: 0,
            }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState(normalisedLocal);
  const [serverLoaded, setServerLoaded] = useState(false);

  const [igPosts, setIgPosts] = useState([]); // real posts added via the admin panel

  useEffect(() => {
    fetchProducts()
      .then(data => {
        if (data.success && data.products?.length > 0) {
          setProducts(data.products);
          setServerLoaded(true);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchInstagramPosts()
      .then(data => { if (data.success) setIgPosts(data.posts || []); })
      .catch(() => {}); // fall back to the static placeholder grid below
  }, []);

  const newArrivals = products.filter(p => p.isNew);
  const saleItems = products.filter(p => p.isSale);

  const padToFive = (arr) => {
    const rem = arr.length % 5;
    return rem === 0 ? arr : [...arr, ...Array(5 - rem).fill(null)];
  };

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>

      {/* Hero */}
      <HeroSlider slides={heroSlides} />

      {!serverLoaded && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '8px', background: '#f8f8f8', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ width: '12px', height: '12px', border: '1.5px solid #ccc', borderTopColor: '#000', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <span style={{ fontSize: '11px', color: '#aaa', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Syncing inventory...</span>
        </div>
      )}

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2.5rem 1.5rem 0' }}>
        {/* New Arrivals */}
        {newArrivals.length > 0 && (
          <div style={{ marginBottom: '3.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#000' }}>New Arrivals</h2>
              <button onClick={() => navigate('/products?filter=new-arrivals')}
                style={{ fontSize: '0.72rem', color: '#888', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'underline' }}>
                View All
              </button>
            </div>
            <div className="product-grid-5">
              {padToFive(newArrivals.slice(0, 10)).map((p, i) => p
                ? <ProductCard key={p._id} product={p} />
                : <div key={`ph-${i}`} className="ghost-card" />
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Store showcase #1 — between New Arrivals and Latest. Edit image/text/link via props. ── */}
      <StoreShowcase
        imageSide="left"
        imageWidth={60}
        image={SHOWCASE_1_IMAGE}
        title="VISIT US IN PERSON"
        lines={[
          'In-person shopping experience — add your store address here.',
          'Add your opening hours here.',
        ]}
        buttonLabel="INSTAGRAM"
        buttonHref="https://instagram.com/vibewear_"
      />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2.5rem 1.5rem 0' }}>
        {/* Latest */}
        {saleItems.length > 0 && (
          <div style={{ marginBottom: '3.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#000' }}>Latest</h2>
              <button onClick={() => navigate('/products?filter=sale')}
                style={{ fontSize: '0.72rem', color: '#888', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'underline' }}>
                View All
              </button>
            </div>
            <div className="product-grid-5">
              {padToFive(saleItems.slice(0, 5)).map((p, i) => p
                ? <ProductCard key={p._id} product={p} />
                : <div key={`ph-${i}`} className="ghost-card" />
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Featured editorial — 2x2 product grid + lifestyle banner. Before "Explore the Collection". ── */}
      <FeaturedEditorial products={products.slice(0, 4)} bannerImage={'image s/store2.jpg'} bannerTitle="ZERO TO THE WORLD" bannerLink="/products" />

      {/* ── Category showcase — between Latest and All Products. Edit categories/text via props. ── */}
      <CategoryShowcase dark />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2.5rem 1.5rem 0' }}>
        {/* All Products */}
        <div style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#000' }}>All Products</h2>
            <button onClick={() => navigate('/products')}
              style={{ fontSize: '0.72rem', color: '#888', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'underline' }}>
              Shop All
            </button>
          </div>
          <div className="product-grid-5">
            {padToFive(products.slice(0, 10)).map((p, i) => p
              ? <ProductCard key={p._id} product={p} />
              : <div key={`ph-${i}`} className="ghost-card" />
            )}
          </div>
        </div>
      </div>

      {/* ── Follow Us on Instagram ── */}
      <section style={{ borderTop: '1px solid #f0f0f0', padding: '4rem 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#aaa', fontFamily: 'var(--font-mono)', marginBottom: '6px' }}>Social</p>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#000', marginBottom: '6px' }}>Follow Us on Instagram</h2>
            <a href="https://instagram.com/vibewear_" target="_blank" rel="noreferrer"
              style={{ color: '#aaa', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', textDecoration: 'none', letterSpacing: '0.1em' }}
              onMouseEnter={e => e.target.style.color = '#000'}
              onMouseLeave={e => e.target.style.color = '#aaa'}>
              @vibewear_
            </a>
          </div>

          {(() => {
            const hasRealPosts = igPosts.length > 0;
            const igItems = hasRealPosts ? igPosts : IG_GRID_DESKTOP;
            const renderIgItem = (item, key) => hasRealPosts ? (
              <div key={key} style={{ background: '#f5f5f5', padding: '8px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
                <InstagramEmbed url={item.url} />
              </div>
            ) : (
              <a key={key} href="https://instagram.com/vibewear_" target="_blank" rel="noreferrer" draggable={false}
                style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden', display: 'block', background: '#f5f5f5' }}>
                <img src={item} alt="Instagram" draggable={false}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }}
                />
              </a>
            );
            return (
              <>
                {/* Desktop: 3-per-page grid, drag or dots to see more */}
                <div className="ig-desktop-grid">
                  <IgSlider items={igItems} pageSize={3} columns={3} renderItem={renderIgItem} />
                </div>
                {/* Mobile: 1-per-page, drag or dots to see more */}
                <div className="ig-mobile-slider">
                  <IgSlider items={igItems} pageSize={1} columns={1} renderItem={renderIgItem} />
                </div>
              </>
            );
          })()}

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <a href="https://instagram.com/vibewear_" target="_blank" rel="noreferrer" className="btn-outline"
              style={{ fontSize: '0.72rem', letterSpacing: '0.12em', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Follow
            </a>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Hide scrollbar for category slider */

        /* 5-col on desktop, 2-col on mobile */
        .product-grid-5 {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 16px;
          margin-bottom: 4rem;
        }
        .ghost-card {
          visibility: hidden;
        }

        /* IG — IgSlider handles its own per-page grid layout inline; these just toggle visibility */
        .ig-desktop-grid { display: block; }
        .ig-mobile-slider { display: none; }

        @media (max-width: 1024px) {
          .product-grid-5 {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 767px) {
          .product-grid-5 {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          .ig-desktop-grid { display: none; }
          .ig-mobile-slider { display: block; }
        }
      `}</style>
    </div>
  );
}