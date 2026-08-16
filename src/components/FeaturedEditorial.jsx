import { Link } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';

function FeaturedItem({ product, dark, loading }) {
  const { formatPrice } = useCurrency();
  const dividerColor = dark ? 'rgba(255,255,255,0.2)' : '#ddd';
  const shimmerBase = dark ? '#1a1a1a' : '#ececec';
  const shimmerHighlight = dark ? '#262626' : '#f7f7f7';
  const nameColor = dark ? '#fff' : '#000';
  const priceColor = dark ? 'rgba(255,255,255,0.6)' : '#888';
  const soldOutColor = dark ? 'rgba(255,255,255,0.4)' : '#aaa';

  if (!product) {
    if (!loading) return null; // no placeholder box once we know there's genuinely no product to show
    return (
      <div>
        <div style={{ borderTop: `1px solid ${dividerColor}`, marginBottom: '14px' }} />
        <div className="featured-editorial-skeleton-img" style={{ aspectRatio: '3/4', marginBottom: '10px', background: shimmerBase, backgroundImage: `linear-gradient(90deg, ${shimmerBase} 25%, ${shimmerHighlight} 37%, ${shimmerBase} 63%)` }} />
        <div className="featured-editorial-skeleton-line" style={{ width: '70%', marginBottom: '6px', background: shimmerBase, backgroundImage: `linear-gradient(90deg, ${shimmerBase} 25%, ${shimmerHighlight} 37%, ${shimmerBase} 63%)` }} />
        <div className="featured-editorial-skeleton-line" style={{ width: '35%', background: shimmerBase, backgroundImage: `linear-gradient(90deg, ${shimmerBase} 25%, ${shimmerHighlight} 37%, ${shimmerBase} 63%)` }} />
      </div>
    );
  }
  return (
    <Link to={`/products/${product._id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
      <div style={{ borderTop: `1px solid ${dividerColor}`, marginBottom: '14px' }} />
      <div style={{ position: 'relative', aspectRatio: '3/4', background: 'transparent', marginBottom: '10px', overflow: 'hidden' }}>
        <img src={product.image} alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {!product.inStock && (
          <span style={{
            position: 'absolute', top: '10px', left: '10px',
            background: '#000', color: '#fff', fontSize: '0.65rem', fontWeight: 600,
            letterSpacing: '0.05em', textTransform: 'uppercase', padding: '4px 10px',
          }}>
            Sold Out
          </span>
        )}
      </div>
      <p style={{ fontSize: '0.82rem', color: nameColor, marginBottom: '3px', lineHeight: 1.3 }}>{product.name}</p>
      {product.inStock ? (
        <p style={{ fontSize: '0.82rem', color: priceColor }}>{formatPrice(product.price)}</p>
      ) : (
        <p style={{ fontSize: '0.82rem', color: soldOutColor }}>Sold Out</p>
      )}
    </Link>
  );
}

export default function FeaturedEditorial({
  products = [],       // up to 4 shown in the left grid
  bannerImage = null,  // right-side lifestyle photo — set to a real path, e.g. '/images/editorial/zero.jpg'
  bannerVideo = null,  // right-side autoplay video — set to a real path (e.g. '/videos/zero.mp4') to use a video instead of a photo.
                        // When set, the banner plays muted/looped/playsInline with no overlay title or button — just the video.
  bannerTitle = 'ZERO TO THE WORLD',
  bannerLink = '/products',
  dark = false,         // set true to render on a black background with white text
  noTopPadding = false, // set true when stacking directly under another dark section, to avoid a seam
  loading = false,      // set true while products are still being fetched — shows skeleton loaders instead of an "Add Product" placeholder
}) {
  const items = [...products.slice(0, 4)];
  while (items.length < 4) items.push(null);

  return (
    <section className="featured-editorial-section" style={{ background: dark ? '#000' : '#fff', padding: noTopPadding ? '0 1.5rem 2.5rem' : '2.5rem 1.5rem' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }} className="featured-editorial">
        {/* Left: 2x2 product grid */}
        <div className="featured-editorial-grid">
          {items.map((p, i) => <FeaturedItem key={p?._id || `ph-${i}`} product={p} dark={dark} loading={loading} />)}
        </div>

        {/* Right: same slot/size as before — now plays a video, no overlay, no link, autoplay/loop/muted */}
        {bannerVideo ? (
          <div className="featured-editorial-banner" style={{ position: 'relative', overflow: 'hidden', background: '#111' }}>
            <video
              src={bannerVideo}
              autoPlay
              muted
              loop
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        ) : (
          /* Fallback: original photo banner with title + button overlay, used only if no video is set */
          <Link to={bannerLink} className="featured-editorial-banner" style={{
            position: 'relative', display: 'block', overflow: 'hidden',
            background: bannerImage ? '#111' : '#f2f2f2', textDecoration: 'none',
          }}>
            {bannerImage ? (
              <img src={bannerImage} alt={bannerTitle}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <div style={{
                width: '100%', height: '100%', minHeight: '360px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px',
                background: 'repeating-linear-gradient(45deg, #ececec, #ececec 10px, #f2f2f2 10px, #f2f2f2 20px)',
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <path d="M21 15l-5-5L5 21"/>
                </svg>
                <span style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#aaa', fontWeight: 600 }}>
                  Add Banner Photo
                </span>
              </div>
            )}

            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '18px',
            }}>
              <h3 style={{
                color: bannerImage ? '#fff' : '#000',
                fontSize: 'clamp(1.2rem, 2.4vw, 1.7rem)', fontWeight: 700,
                letterSpacing: '0.06em', textAlign: 'center',
                textShadow: bannerImage ? '0 2px 12px rgba(0,0,0,0.4)' : 'none',
              }}>
                {bannerTitle}
              </h3>
              <span style={{
                border: bannerImage ? '1px solid rgba(255,255,255,0.7)' : '1px solid rgba(0,0,0,0.4)',
                color: bannerImage ? '#fff' : '#000',
                fontSize: '0.7rem',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                padding: '0.6rem 1.8rem',
                background: bannerImage ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.5)',
              }}>
                View
              </span>
            </div>
          </Link>
        )}
      </div>

      <style>{`
        .featured-editorial-skeleton-img,
        .featured-editorial-skeleton-line {
          background-size: 400% 100%;
          animation: featured-editorial-shimmer 1.4s ease infinite;
        }
        .featured-editorial-skeleton-line { height: 10px; border-radius: 2px; }
        @keyframes featured-editorial-shimmer {
          0% { background-position: 100% 50%; }
          100% { background-position: 0 50%; }
        }
        .featured-editorial {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .featured-editorial-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .featured-editorial-banner {
          min-height: 100%;
        }
        @media (max-width: 900px) {
          .featured-editorial-section {
            padding-left: 0 !important;
            padding-right: 0 !important;
            padding-top: 0 !important;
          }
          .featured-editorial {
            grid-template-columns: 1fr;
            gap: 0;
          }
          .featured-editorial-grid {
            gap: 20px;
            padding: 1.75rem 1.5rem 2.5rem;
          }
          .featured-editorial-banner {
            order: -1;
            min-height: 100vh;
          }
        }
      `}</style>
    </section>
  );
}