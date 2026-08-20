import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();

  const price = Number(product?.price) || 0;
  const originalPrice = Number(product?.originalPrice) || null;
  const discount = originalPrice && price ? Math.round((1 - price / originalPrice) * 100) : null;

  const images = product?.images?.length ? product.images : [product?.image].filter(Boolean);
  const [imgIndex, setImgIndex] = useState(0);
  const dragRef = useRef({ startX: 0, dragging: false, delta: 0, pointerId: null });
  const wasDragging = useRef(false);

  const clamp = (i) => Math.max(0, Math.min(images.length - 1, i));
  const goPrev = (e) => { e.stopPropagation(); setImgIndex(i => clamp(i - 1)); };
  const goNext = (e) => { e.stopPropagation(); setImgIndex(i => clamp(i + 1)); };

  // Pointer Events + setPointerCapture so the drag keeps tracking even if the cursor leaves
  // the card's bounds mid-swipe. Kept as a bonus interaction on top of the explicit arrow
  // buttons below, which are the guaranteed-to-work path regardless of drag detection.
  const onPointerDown = (e) => {
    if (images.length <= 1) return;
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
    if (Math.abs(delta) > 35) setImgIndex(i => clamp(i + (delta < 0 ? 1 : -1)));
    try { e.currentTarget.releasePointerCapture(pointerId); } catch { /* already released */ }
  };
  const handleCardClick = () => {
    if (wasDragging.current) { wasDragging.current = false; return; }
    navigate(`/products/${product._id || product.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      style={{ cursor: 'pointer', borderTop: '1px solid #ddd', paddingTop: '14px' }}
    >
      {/* Image — narrower + centered on desktop so the plain backdrop in the source photos reads less like a solid box; near full-bleed on mobile so it reads bigger on small screens */}
      <div className="product-card-media">
        <div
          className="product-card-img-wrap"
          style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: 'transparent', touchAction: 'pan-y', userSelect: 'none' }}
          onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={endDrag} onPointerCancel={endDrag}
          onDragStart={e => e.preventDefault()}
        >
          <div style={{
            display: 'flex',
            width: '100%', height: '100%',
            transform: `translateX(-${imgIndex * 100}%)`,
            transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
          }}>
            {images.map((src, i) => (
              <img key={i} src={src} alt={product?.name} draggable={false}
                style={{ width: '100%', height: '100%', objectFit: 'cover', flexShrink: 0 }}
                loading="lazy"
              />
            ))}
          </div>

          {images.length > 1 && (
            <>
              {/* Dots */}
              <div style={{ position: 'absolute', bottom: '8px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '4px' }}>
                {images.map((_, i) => (
                  <span key={i} style={{
                    width: i === imgIndex ? '12px' : '4px',
                    height: '4px',
                    borderRadius: '2px',
                    background: i === imgIndex ? '#000' : 'rgba(0,0,0,0.35)',
                    boxShadow: '0 0 2px rgba(255,255,255,0.8)',
                    transition: 'width 0.25s',
                  }} />
                ))}
              </div>
            </>
          )}

          {/* Badges */}
          <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {discount && (
              <span style={{ background: '#000', color: '#fff', fontSize: '9px', fontWeight: 700, padding: '3px 8px', letterSpacing: '0.08em' }}>-{discount}%</span>
            )}
            {!product?.inStock && (
              <span style={{ background: '#666', color: '#fff', fontSize: '9px', fontWeight: 700, padding: '3px 8px', letterSpacing: '0.08em' }}>SOLD OUT</span>
            )}
          </div>
        </div>

        {/* Prev / Next — desktop only, straddling the image's bottom edge. Siblings of
            .product-card-img-wrap (not children) so its overflow:hidden — needed to clip
            the sliding image track — doesn't also clip these in half. */}
        {images.length > 1 && (
          <>
            {imgIndex > 0 && (
              <button
                onClick={goPrev}
                aria-label="Previous image"
                className="product-card-arrow product-card-arrow--prev"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            )}
            {imgIndex < images.length - 1 && (
              <button
                onClick={goNext}
                aria-label="Next image"
                className="product-card-arrow product-card-arrow--next"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                </svg>
              </button>
            )}
          </>
        )}
      </div>

      {/* Info — no card chrome, just image + name + price + stock status */}
      <div style={{ padding: '10px 7% 0' }}>
        <h3 style={{ color: '#000', fontSize: '0.82rem', fontWeight: 400, marginBottom: '3px', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product?.name || 'Unnamed Product'}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#888', fontWeight: 400, fontSize: '0.82rem' }}>{formatPrice(price)}</span>
          {originalPrice && (
            <span style={{ color: '#aaa', fontSize: '0.8rem', textDecoration: 'line-through' }}>{formatPrice(originalPrice)}</span>
          )}
        </div>
        <div style={{ fontSize: '10px', fontWeight: 600, marginTop: '4px', color: product?.inStock ? '#22c55e' : '#ef4444', letterSpacing: '0.04em' }}>
          {product?.inStock ? '● In Stock' : '● Out of Stock'}
        </div>
      </div>

      <style>{`
        .product-card-media {
          position: relative;
          width: 86%;
          margin: 0 auto;
        }
        @media (max-width: 767px) {
          .product-card-media {
            width: 100%;
          }
        }

        /* Prev/next arrows — desktop only, hidden on touch/small screens where
           the drag-swipe + dots already handle navigation. */
        .product-card-arrow {
          display: none;
          position: absolute;
          bottom: 0;
          transform: translateY(50%);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #fff;
          border: none;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(0,0,0,0.18);
          opacity: 0;
          transition: opacity 0.2s;
          z-index: 2;
        }
        .product-card-arrow--prev { left: 12px; }
        .product-card-arrow--next { right: 12px; }

        @media (min-width: 768px) {
          .product-card-arrow { display: flex; }
          .product-card-media:hover .product-card-arrow { opacity: 1; }
        }
      `}</style>
    </div>
  );
}