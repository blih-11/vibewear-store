import { useState } from 'react';
import { Link } from 'react-router-dom';

// Split banner: image on one side, centered text + button on the other.
// Edit the props below (or where it's used in Home.jsx) to swap in real photo/copy.
export default function StoreShowcase({
  image =  'images/store.jpg', // pass a real photo path, e.g. "/images/store-front.jpg" — leave blank to show an "add photo" placeholder
  title = 'VISIT US IN PERSON',
  lines = [
    'STORE LOCATION: Third gate traffic light, Ashale Botwe. Accra,Ghana.',
    'OPENING HOURS: 9:00 AM - 6:00 PM, Mon - Sat',
  ],
  buttonLabel = 'Shop Now',
  buttonHref = '/products',
  imageSide = 'left', // 'left' | 'right'
  imageWidth = 60,    // % of the section width the image takes — text gets the rest
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const showPlaceholder = !image || imgFailed;

  return (
    <section style={{ borderTop: '1px solid #f0f0f0' }}>
      <div style={{
        display: 'flex',
        flexDirection: imageSide === 'right' ? 'row-reverse' : 'row',
        minHeight: '520px',
      }}
      className="store-showcase">
        {/* Image */}
        <div style={{ flex: `0 0 ${imageWidth}%`, minHeight: '360px', background: '#eee' }}>
          {showPlaceholder ? (
            <div style={{
              width: '100%', height: '100%',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: '10px',
              background: 'repeating-linear-gradient(45deg, #e4e4e4, #e4e4e4 10px, #ececec 10px, #ececec 20px)',
              border: '2px dashed #ccc',
              boxSizing: 'border-box',
            }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="M21 15l-5-5L5 21"/>
              </svg>
              <span style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#999', fontWeight: 600 }}>
                Add Photo Here
              </span>
            </div>
          ) : (
            <img src={image} alt={title} onError={() => setImgFailed(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          )}
        </div>

        {/* Text */}
        <div style={{
          flex: `0 0 ${100 - imageWidth}%`,
          background: '#ececec',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '3rem 2rem',
        }}>
          <h2 style={{
            fontSize: '1.6rem',
            fontWeight: 600,
            letterSpacing: '0.15em',
            color: '#111',
            marginBottom: '1.75rem',
          }}>
            {title}
          </h2>

          <div style={{ marginBottom: '2.25rem' }}>
            {lines.map((line, i) => (
              <p key={i} style={{ fontWeight: 600, fontSize: '.81rem', color: '#333', lineHeight: 1.8 }}>{line}</p>
            ))}
          </div>

          {(() => {
            const isExternal = /^https?:\/\//.test(buttonHref);
            const btnStyle = {
              display: 'inline-block',
              padding: '0.9rem 2.5rem',
              background: '#d4d4d4',
              color: '#222',
              fontSize: '0.8rem',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textDecoration: 'none',
              transition: 'background 0.25s ease',
            };
            const hoverProps = {
              onMouseEnter: e => { e.currentTarget.style.background = '#c4c4c4'; },
              onMouseLeave: e => { e.currentTarget.style.background = '#d4d4d4'; },
            };
            return isExternal ? (
              <a href={buttonHref} target="_blank" rel="noreferrer" style={btnStyle} {...hoverProps}>{buttonLabel}</a>
            ) : (
              <Link to={buttonHref} style={btnStyle} {...hoverProps}>{buttonLabel}</Link>
            );
          })()}
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .store-showcase {
            flex-direction: column !important;
            min-height: auto !important;
          }
          .store-showcase > div {
            flex: 1 1 auto !important;
          }
          .store-showcase > div:first-child {
            min-height: 280px !important;
          }
        }
      `}</style>
    </section>
  );
}