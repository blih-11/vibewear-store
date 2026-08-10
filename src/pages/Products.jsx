import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../lib/api';
import { products as localProducts } from '../data/products';

const normalisedLocal = localProducts.map(p => ({ ...p, _id: p._id || String(p.id) }));

const allCategories = [
  { id: 'all',          label: 'All' },
  { id: 'new-arrivals', label: 'New Arrivals' },
  { id: 'sale',         label: 'Sale' },
  { id: 'tees',         label: 'Tees' },
  { id: 'shirts',       label: 'Shirts' },
  { id: 'hoodies',      label: 'Hoodies' },
  { id: 'bottoms',      label: 'Bottoms' },
  { id: 'outerwear',    label: 'Outerwear' },
  { id: 'accessories',  label: 'Accessories' },
  { id: 'fullfit',      label: 'Full Fits' },
];

export default function Products() {
  const [searchParams] = useSearchParams();
  const [activeFilter, setActiveFilter] = useState(searchParams.get('filter') || 'all');
  const [sort, setSort] = useState('default');
  const [localSearch, setLocalSearch] = useState('');
  const [products, setProducts] = useState(normalisedLocal);

  useEffect(() => {
    const f = searchParams.get('filter');
    if (f) setActiveFilter(f);
  }, [searchParams]);

  useEffect(() => {
    fetchProducts()
      .then(data => { if (data.success && data.products?.length) setProducts(data.products); })
      .catch(() => {});
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
    else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    else if (sort === 'newest') list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    return list;
  }, [activeFilter, sort, localSearch, products]);

  // Pad to complete 5-col rows
  const paddedFiltered = useMemo(() => {
    const rem = filtered.length % 5;
    return rem === 0 ? filtered : [...filtered, ...Array(5 - rem).fill(null)];
  }, [filtered]);

  return (
    <div style={{ background: '#fff', minHeight: '100vh', paddingTop: '64px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem', paddingTop: '1rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#000', letterSpacing: '0.04em' }}>Shop</h1>
          <p style={{ color: '#aaa', fontSize: '0.82rem', marginTop: '4px' }}>{filtered.length} products</p>
        </div>

        {/* Search + Sort */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
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
          <select value={sort} onChange={e => setSort(e.target.value)}
            style={{ border: '1px solid #e5e5e5', borderRadius: '2px', padding: '10px 14px', fontSize: '0.82rem', color: '#555', background: '#fff', cursor: 'pointer', outline: 'none', fontFamily: 'inherit' }}>
            <option value="default">Sort: Default</option>
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        {/* Category Filters */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {allCategories.map(cat => (
            <button key={cat.id} onClick={() => setActiveFilter(cat.id)}
              style={{
                padding: '7px 18px', borderRadius: '2px',
                border: '1px solid',
                borderColor: activeFilter === cat.id ? '#000' : '#e0e0e0',
                background: activeFilter === cat.id ? '#000' : '#fff',
                color: activeFilter === cat.id ? '#fff' : '#555',
                fontSize: '0.72rem', fontWeight: 600,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                cursor: 'pointer', transition: 'all 0.18s',
              }}>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
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
      </div>

      <style>{`
        .shop-grid-5 {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 16px;
        }
        @media (max-width: 1024px) {
          .shop-grid-5 { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 767px) {
          .shop-grid-5 {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
}
