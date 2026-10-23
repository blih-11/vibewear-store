import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrency } from '../context/CurrencyContext';
import { optimizeImage } from '../lib/optimizeImage';
import PagedCarousel from './PagedCarousel';
import FitQuickAddModal from './FitQuickAddModal';

// "Curated For You" — each card is a whole outfit (bundle of existing products).
// Tapping a card opens a quick-add sheet instead of navigating away; after adding,
// a toast shows the per-item breakdown and total.
export default function FitsShowcase({ fits = [], products = [], loading = false, title = 'Curated For You' }) {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [openFit, setOpenFit] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 7000);
    return () => clearTimeout(t);
  }, [toast]);

  // Bundles first, then the existing single products tagged "Full Fits" so nothing that
  // used to show here disappears when bundles are introduced.
  const entries = [
    ...fits.map(f => ({ kind: 'fit', data: f })),
    ...products.map(p => ({ kind: 'product', data: p })),
  ];

  const fitTotal = (f) => (f.items || []).reduce((s, i) => s + i.price, 0);

  const skeletons = Array.from({ length: 4 }).map((_, i) => (
    <div key={`fit-sk-${i}`} className="fit-card"><div className="fit-card__img fit-card__skeleton" /></div>
  ));

  const renderProduct = (p) => (
    <div key={p._id} className="fit-card" onClick={() => navigate(`/products/${p._id || p.id}`)}>
      <div className="fit-card__img">
        <img src={optimizeImage(p.image, { width: 700 })} alt={p.name} loading="lazy" />
      </div>
      <p className="fit-card__name">{p.name}</p>
      <p className="fit-card__price">{formatPrice(p.price)}</p>
    </div>
  );

  const renderFit = (f) => (
    <div key={f._id} className="fit-card" onClick={() => setOpenFit(f)}>
      <div className="fit-card__img">
        <img src={optimizeImage(f.image, { width: 700 })} alt={f.name} loading="lazy" />
      </div>
      <p className="fit-card__name">{f.name}</p>
      <p className="fit-card__price">{formatPrice(fitTotal(f))} <span>· {f.items.length} pieces</span></p>
    </div>
  );

  const renderEntry = (e) => (e.kind === 'fit' ? renderFit(e.data) : renderProduct(e.data));

  return (
    <section className="fit-showcase">
      <h2 className="fit-showcase__title">{title}</h2>

      <div className="fit-showcase__desktop">{loading ? skeletons : entries.map(renderEntry)}</div>
      <div className="fit-showcase__mobile">
        {loading
          ? <div className="fit-showcase__desktop">{skeletons.slice(0, 2)}</div>
          : <PagedCarousel items={entries} pageSize={2} columns={2} renderItem={(e) => renderEntry(e)} />}
      </div>

      {openFit && (
        <FitQuickAddModal
          fit={openFit}
          onClose={() => setOpenFit(null)}
          onAdded={(summary) => { setOpenFit(null); setToast(summary); }}
        />
      )}

      {toast && (
        <div className="fit-toast" role="status">
          <div className="fit-toast__head">
            <strong>Added to cart · {toast.name}</strong>
            <button onClick={() => setToast(null)} aria-label="Dismiss">×</button>
          </div>
          {toast.lines.map((l, idx) => (
            <div key={idx} className="fit-toast__line">
              <span>{l.name}{l.size ? ` (${l.size})` : ''}</span><span>{formatPrice(l.price)}</span>
            </div>
          ))}
          <div className="fit-toast__line fit-toast__total"><span>Total</span><span>{formatPrice(toast.total)}</span></div>
          <button className="fit-toast__cta" onClick={() => navigate('/cart')}>View Cart</button>
        </div>
      )}

      <style>{`
        .fit-showcase { padding: 3rem 1.5rem; }
        .fit-showcase__title { text-align: center; font-size: clamp(1.3rem, 3vw, 1.9rem); letter-spacing: 0.05em; text-transform: uppercase; color: #000; margin: 0 0 2rem; }
        .fit-showcase__desktop { display: flex; gap: 20px; max-width: 1400px; margin: 0 auto; overflow-x: auto; scrollbar-width: none; }
        .fit-showcase__desktop::-webkit-scrollbar { display: none; }
        .fit-showcase__mobile { display: none; }
        .fit-card { flex: 0 0 auto; width: calc((100% - 60px) / 4); cursor: pointer; }
        .fit-card__img { aspect-ratio: 3/4; background: #f8f8f8; display: flex; align-items: center; justify-content: center; overflow: hidden; margin-bottom: 0.9rem; }
        .fit-card__img img { width: 100%; height: 100%; object-fit: contain; }
        .fit-card__name { text-align: center; font-size: 0.78rem; letter-spacing: 0.03em; text-transform: uppercase; color: #333; margin: 0 0 6px; }
        .fit-card__price { text-align: center; font-size: 0.8rem; color: #666; margin: 0 0 8px; }
        .fit-card__price span { color: #aaa; font-size: 0.72rem; }
        .fit-card__skeleton { background: linear-gradient(90deg, #e2e2e2 25%, #ececec 37%, #e2e2e2 63%); background-size: 400% 100%; animation: fit-shimmer 1.4s ease infinite; width: 100%; height: 100%; }
        @keyframes fit-shimmer { 0% { background-position: 100% 50%; } 100% { background-position: 0 50%; } }

        .fit-toast { position: fixed; left: 50%; bottom: 20px; transform: translateX(-50%); z-index: 95; width: min(92vw, 380px); background: #000; color: #fff; padding: 14px 16px; box-shadow: 0 10px 30px rgba(0,0,0,.35); font-size: 0.8rem; }
        .fit-toast__head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .fit-toast__head button { background: none; border: none; color: #aaa; font-size: 1.2rem; cursor: pointer; }
        .fit-toast__line { display: flex; justify-content: space-between; gap: 12px; padding: 2px 0; color: #ddd; }
        .fit-toast__total { border-top: 1px solid #333; margin-top: 6px; padding-top: 6px; color: #fff; font-weight: 700; }
        .fit-toast__cta { width: 100%; margin-top: 10px; background: #fff; color: #000; border: none; padding: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; font-size: 0.72rem; cursor: pointer; }

        @media (max-width: 899px) {
          .fit-showcase { padding: 2.2rem 1rem; }
          .fit-showcase__title { text-align: left; font-size: 1.1rem; margin: 0 0 1.2rem 0.25rem; }
          .fit-showcase__desktop { display: none; }
          .fit-showcase__mobile { display: block; }
          .fit-showcase__mobile .fit-card { width: 100%; }
        }
      `}</style>
    </section>
  );
}
