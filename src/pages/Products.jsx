import { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Seo from '../components/Seo';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../lib/api';
import { allProductsEntry } from '../data/categories';
import { useShopCategories } from '../hooks/useShopCategories';

const sortOptions = [
  { id: 'default',    label: 'Featured' },
  { id: 'best',       label: 'Best Selling' },
  { id: 'price-asc',  label: 'Price, Low To High' },
  { id: 'price-desc', label: 'Price, High To Low' },
  { id: 'date-old',   label: 'Date, Old To New' },
  { id: 'date-new',   label: 'Date, New To Old' },
];

export default function Products() {
  const [searchParams] = useSearchParams();
  const shopCategories = useShopCategories();
  const allCategories = useMemo(() => [allProductsEntry, ...shopCategories], [shopCategories]);
  const [activeFilter, setActiveFilter] = useState(searchParams.get('filter') || 'all');
  const [sort, setSort] = useState('default');
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef(null);
  const [localSearch, setLocalSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sortOpen) return;
    const onClick = (e) => { if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [sortOpen]);

  useEffect(() => {
    const f = searchParams.get('filter');
    setActiveFilter(f || 'all');
  }, [searchParams]);

  useEffect(() => {
    fetchProducts()
      .then(data => { if (data.success && data.products) setProducts(data.products); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = [...products];
    if (localSearch.trim()) {
      const q = localSearch.toLowerCase();
      list = list.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.tags?.some(t => t.toLowerCase().includes(q)) ||
        p.category?.some(c => c.toLowerCase().includes(q))
      );
    }
    if (activeFilter === 'sale') list = list.filter(p => p.isSale);
    else if (activeFilter === 'new-arrivals') list = list.filter(p => p.isNew);
    else if (activeFilter !== 'all') list = list.filter(p => p.category?.includes(activeFilter));
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (sort === 'best') list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sort === 'alpha-asc') list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    else if (sort === 'alpha-desc') list.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
    else if (sort === 'date-old') list.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    else if (sort === 'date-new') list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    return list;
  }, [activeFilter, sort, localSearch, products]);

  // Pad to complete 4-col rows
  const paddedFiltered = useMemo(() => {
    const rem = filtered.length % 4;
    return rem === 0 ? filtered : [...filtered, ...Array(4 - rem).fill(null)];
  }, [filtered]);

  return (
    <div style={{ background: '#fff', minHeight: '100vh', paddingTop: '64px', paddingBottom: '80px' }}>
      <Seo
        title="Shop All Products"
        description="Browse Vibewear's full collection of tees, shirts, hoodies, bottoms, and accessories. New arrivals every week."
        path="/products"
      />
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem', paddingTop: '1rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#000', letterSpacing: '0.04em' }}>
            {allCategories.find(c => c.id === activeFilter)?.label || 'Shop'}
          </h1>
          <p style={{ color: '#aaa', fontSize: '0.82rem', marginTop: '4px' }}>
            {loading ? 'Loading products...' : `${filtered.length} products`}
          </p>
        </div>

        {/* Search + Sort */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <svg style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }}
              width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M16.65 16.65A7 7 0 1116.65 3a7 7 0 010 13.65z" />
            </svg>
            <input
              type="text" value={localSearch} onChange={e => setLocalSearch(e.target.value)}
              placeholder="Search products..."
              style={{ width: '100%', border: '1px solid #e5e5e5', borderRadius: '2px', padding: '10px 12px 10px 38px', fontSize: '0.85rem', color: '#000', outline: 'none', fontFamily: 'inherit' }}
              onFocus={e => e.target.style.borderColor = '#000'}
              onBlur={e => e.target.style.borderColor = '#e5e5e5'}
            />
          </div>
          <div ref={sortRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setSortOpen(o => !o)}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                border: '1px solid #e5e5e5', borderRadius: '2px',
                padding: '10px 16px', background: '#fff', cursor: 'pointer',
                fontFamily: 'inherit', fontSize: '0.78rem', fontWeight: 600,
                letterSpacing: '0.1em', textTransform: 'uppercase', color: '#000',
                whiteSpace: 'nowrap',
              }}
            >
              Sort By
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                style={{ transform: sortOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>

            {sortOpen && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 10px)', right: 0, zIndex: 120,
                background: '#fff', border: '1px solid #e5e5e5',
                minWidth: '250px', padding: '10px 0',
                boxShadow: '0 12px 32px rgba(0,0,0,0.1)',
              }}>
                {sortOptions.map(o => (
                  <button key={o.id} onClick={() => { setSort(o.id); setSortOpen(false); }}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      padding: '11px 22px', background: sort === o.id ? 'rgba(0,0,0,0.045)' : 'transparent',
                      border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                      fontSize: '0.92rem', color: '#222',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.045)'}
                    onMouseLeave={e => e.currentTarget.style.background = sort === o.id ? 'rgba(0,0,0,0.045)' : 'transparent'}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="shop-grid-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={`sk-${i}`}>
                <div className="shop-skeleton-img" />
                <div className="shop-skeleton-line" style={{ width: '80%' }} />
                <div className="shop-skeleton-line" style={{ width: '40%' }} />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="shop-grid-5">
              {paddedFiltered.map((product, i) =>
                product
                  ? <ProductCard key={product._id} product={product} />
                  : <div key={`ph-${i}`} style={{ visibility: 'hidden' }} />
              )}
            </div>

            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '5rem 0', color: '#aaa', fontSize: '0.9rem' }}>
                No products found.
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        .shop-skeleton-img {
          aspect-ratio: 3/4;
          background: linear-gradient(90deg, #f0f0f0 25%, #f7f7f7 37%, #f0f0f0 63%);
          background-size: 400% 100%;
          animation: shop-shimmer 1.4s ease infinite;
          margin-bottom: 10px;
        }
        .shop-skeleton-line {
          height: 10px;
          border-radius: 2px;
          background: linear-gradient(90deg, #f0f0f0 25%, #f7f7f7 37%, #f0f0f0 63%);
          background-size: 400% 100%;
          animation: shop-shimmer 1.4s ease infinite;
          margin-bottom: 6px;
        }
        @keyframes shop-shimmer {
          0% { background-position: 100% 50%; }
          100% { background-position: 0 50%; }
        }
        .shop-grid-5 {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        @media (max-width: 1024px) {
          .shop-grid-5 { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 767px) {
          .shop-grid-5 {
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
}