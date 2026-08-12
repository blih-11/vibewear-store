import { Link } from 'react-router-dom';

export default function CategoryShowcase({
  eyebrow = 'SHOP BY CATEGORY',
  heading = 'Explore the Collection',
  subtext = 'Every piece is thoughtfully designed to reflect confidence, purpose, and timeless streetwear style.',
  // Fixed images — not pulled from live product data. Set `image` on each entry
  // to a real path (e.g. '/images/categories/shirts.jpg'); leave null for the placeholder.
  categories = [
    { id: 'shirts',      label: 'Shirts',      image: 'images/products/img_200.jpg' },
    { id: 'hoodies',     label: 'Caps',     image: 'images/products/img_94.jpg' },
    { id: 'bottoms',     label: 'Bottoms',     image: 'images/products/img_83.jpg' },
    { id: 'accessories', label: 'Accessories', image: 'images/products/img_68.jpg' },
  ],
  dark = false,          // set true to render on a black background with white text
  noTopBorder = false,   // set true when stacking directly under another dark section, to avoid a seam
}) {
  const placeholderBg = dark
    ? 'repeating-linear-gradient(45deg, #1a1a1a, #1a1a1a 10px, #222 10px, #222 20px)'
    : 'repeating-linear-gradient(45deg, #ececec, #ececec 10px, #f2f2f2 10px, #f2f2f2 20px)';
  const placeholderIcon = dark ? '#555' : '#aaa';

  return (
    <section style={{
      borderTop: noTopBorder ? 'none' : `1px solid ${dark ? '#000' : '#f0f0f0'}`,
      padding: '4.5rem 0',
      background: dark ? '#000' : '#fff',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.18em', color: dark ? 'rgba(255,255,255,0.5)' : '#888', marginBottom: '0.75rem' }}>
            {eyebrow}
          </p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, color: dark ? '#fff' : '#000', marginBottom: '1rem', letterSpacing: '-0.01em' }}>
            {heading}
          </h2>
          <p style={{ fontSize: '0.92rem', color: dark ? 'rgba(255,255,255,0.55)' : '#888', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
            {subtext}
          </p>
        </div>

        {/* Grid */}
        <div className="cat-showcase-grid">
          {categories.map(cat => (
            <Link key={cat.id} to={`/products?filter=${cat.id}`}
              style={{
                position: 'relative',
                aspectRatio: '3/4',
                display: 'block',
                overflow: 'hidden',
                background: dark ? '#111' : '#f2f2f2',
                textDecoration: 'none',
              }}
              className="cat-showcase-card"
            >
              {cat.image ? (
                <img src={cat.image} alt={cat.label}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                />
              ) : (
                <div style={{
                  width: '100%', height: '100%',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  background: placeholderBg,
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={placeholderIcon} strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <path d="M21 15l-5-5L5 21"/>
                  </svg>
                  <span style={{ fontSize: '0.68rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: placeholderIcon, fontWeight: 600 }}>
                    Add Photo
                  </span>
                </div>
              )}

              {/* Bottom gradient scrim so the label stays readable over any photo */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0) 70%)',
              }} />

              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '1.1rem' }}>
                <p style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.3rem' }}>{cat.label}</p>
                <span style={{ color: '#fff', opacity: 0.85, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Explore Collection →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .cat-showcase-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        .cat-showcase-card:hover img { transform: scale(1.06); }

        @media (max-width: 1024px) {
          .cat-showcase-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .cat-showcase-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
