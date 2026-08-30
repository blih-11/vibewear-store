import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import { optimizeImage } from '../lib/optimizeImage';
import PagedCarousel from './PagedCarousel';

export default function NewArrivalsShowcase({
  products = [],
  loading = false,
  title = 'New Arrivals',
  viewAllLink = '/products?filter=new-arrivals',
  brandLabel = 'Vibe Wear', // shown as the small line above each product name — currently unused, see below
  limit = 10, // pass `null` to show every product with no cap (used by "All Products")
  showOriginalPrice = false, // pass true (used by "Sales") to show the struck-through original price alongside the current one
}) {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const shown = limit ? products.slice(0, limit) : products;

  const skeletonCards = Array.from({ length: 8 }).map((_, i) => (
    <div key={`na-sk-${i}`} className="na-showcase__card">
      <div className="na-showcase__img na-showcase__skeleton" />
      <div className="na-showcase__skeleton-line" style={{ width: '55%' }} />
      <div className="na-showcase__skeleton-line" style={{ width: '75%' }} />
      <div className="na-showcase__skeleton-line" style={{ width: '35%' }} />
    </div>
  ));

  const renderCard = (p) => (
    <div key={p._id} className="na-showcase__card" onClick={() => navigate(`/products/${p._id || p.id}`)}>
      <div className="na-showcase__img">
        <img src={optimizeImage(p.image, { width: 600 })} alt={p.name} loading="lazy" />
      </div>
      {/* <p className="na-showcase__brand">{brandLabel}</p> */}
      <p className="na-showcase__name">{p.name}</p>
      {showOriginalPrice && p.originalPrice > p.price ? (
        <p className="na-showcase__price">
          {formatPrice(p.price)}
          <span className="na-showcase__price--was">{formatPrice(p.originalPrice)}</span>
        </p>
      ) : (
        <p className="na-showcase__price">{formatPrice(p.price)}</p>
      )}
      {/* {p.colors?.length > 0 && (
        <div className="na-showcase__swatches">
          {p.colors.slice(0, 4).map((c, i) => (
            <span key={i} className="na-showcase__swatch" style={{ background: c.toLowerCase() }} title={c} />
          ))}
        </div>
      )} */}
    </div>
  );

  return (
    <section className="na-showcase">
      <h2 className="na-showcase__title">{title}</h2>

      {/* Desktop / tablet: horizontal scroll row (unchanged) */}
      <div className="na-showcase__row na-showcase__row--desktop">
        {loading ? skeletonCards : shown.map(renderCard)}
      </div>

      {/* Mobile: paged carousel, 2 products per page / 2-column, swipe or dots to move */}
      <div className="na-showcase__carousel-mobile">
        {loading
          ? <div className="na-showcase__row">{skeletonCards.slice(0, 2)}</div>
          : <PagedCarousel items={shown} pageSize={2} columns={2} renderItem={(p) => renderCard(p)} />}
      </div>

      <div className="na-showcase__viewall-wrap">
        <button className="na-showcase__viewall" onClick={() => navigate(viewAllLink)}>
          <u>View All</u>
        </button>
      </div>

      <style>{`
        .na-showcase {
         
          padding: 3rem 1.5rem;
        }

        .na-showcase__title {
          text-align: center;
          font-size: clamp(1.3rem, 3vw, 1.9rem);
          font-weight: 00;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: #000;
          margin: 0 0 2rem;
        }

        .na-showcase__row {
          display: flex;
          gap: 20px;
          max-width: 1400px;
          margin: 0 auto;
          overflow-x: auto;
          scroll-snap-type: x proximity;
          padding-bottom: 4px;
          scrollbar-width: none;
        }
        .na-showcase__row::-webkit-scrollbar { display: none; }

        /* Desktop row shown by default, mobile carousel hidden — flipped at the breakpoint below */
        .na-showcase__row--desktop { display: flex; }
        .na-showcase__carousel-mobile { display: none; }

        .na-showcase__card {
          flex: 0 0 auto;
          width: calc((100% - 80px) / 5);
          cursor: pointer;
          scroll-snap-align: start;
        }

        .na-showcase__img {
          aspect-ratio: 3/4;
          border: 1px solid #ddd;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          margin-bottom: 0.9rem;
        }
        .na-showcase__img img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .na-showcase__brand {
          text-align: center;
          font-size: 0.72rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #000;
          font-weight: 600;
          margin: 0 0 4px;
        }
        .na-showcase__name {
          text-align: center;
          font-size: 0.78rem;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          color: #333;
          margin: 0 0 6px;
        }
        .na-showcase__price {
          text-align: center;
          font-size: 0.8rem;
          color: #666;
          margin: 0 0 8px;
          display: flex;
          justify-content: center;
          align-items: baseline;
          gap: 8px;
        }
        .na-showcase__price--was {
          text-decoration: line-through;
          color: #aaa;
          font-size: 0.74rem;
        }
        .na-showcase__swatches {
          display: flex;
          justify-content: center;
          gap: 6px;
        }
        .na-showcase__swatch {
          width: 16px;
          height: 16px;
          border: 1px solid #999;
          display: inline-block;
        }

        .na-showcase__viewall-wrap {
          text-align: center;
          margin-top: 2.4rem;
        }
        .na-showcase__viewall {
          background: none;
          border: none;
          color: #000;
          padding: 0.9rem 2.4rem;
          font-size: 0.78rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 700;
          cursor: pointer;
        }

        .na-showcase__skeleton,
        .na-showcase__skeleton-line {
          background: linear-gradient(90deg, #e2e2e2 25%, #ececec 37%, #e2e2e2 63%);
          background-size: 400% 100%;
          animation: na-shimmer 1.4s ease infinite;
        }
        .na-showcase__skeleton-line {
          height: 9px;
          border-radius: 2px;
          margin: 0 auto 6px;
        }
        @keyframes na-shimmer {
          0% { background-position: 100% 50%; }
          100% { background-position: 0 50%; }
        }

        @media (max-width: 899px) {
          .na-showcase { padding: 2.2rem 1rem; }
          .na-showcase__title {
            text-align: left;
            font-size: 1.1rem;
            margin: 0 0 1.2rem 0.25rem;
          }
          .na-showcase__card { width: 62vw; }
          .na-showcase__viewall-wrap { margin-top: 1.6rem; }
          .na-showcase__viewall { width: 100%; max-width: 320px; }

          /* Swap: hide the old horizontal-scroll row, show the 2-per-page carousel */
          .na-showcase__row--desktop { display: none; }
          .na-showcase__carousel-mobile { display: block; }
          .na-showcase__carousel-mobile .na-showcase__card { width: 100%; }
        }

        /* Small phones specifically — trims the top padding and title spacing a bit
           more so the first row of the carousel sits fully above the fold, right
           under the (now shorter) hero. */
        @media (max-width: 640px) {
          .na-showcase { padding: 1.4rem 1rem 2.2rem; }
          .na-showcase__title { margin: 0 0 0.8rem 0.25rem; }
        }
      `}</style>
    </section>
  );
}