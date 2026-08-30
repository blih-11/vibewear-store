import { useEffect, useRef, useState } from 'react';

// Generic paged, swipeable carousel — drag/swipe or tap the dots to move between pages.
// `items` is the full flat list; it gets chunked into pages of `pageSize`, each page
// rendered as a CSS grid with `columns` columns (so pageSize === columns gives one full row
// per page, e.g. 2 products per page in a 2-column grid).
export default function PagedCarousel({ items, pageSize, columns, renderItem, gap = '16px' }) {
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
            display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap,
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