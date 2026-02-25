import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../lib/api';

const allCategories = [
  { id: 'all', label: 'All' },
  { id: 'new-arrivals', label: 'New Arrivals' },
  { id: 'sale', label: 'Sale' },
  { id: 'tops', label: 'Tees' },
  { id: 'bottoms', label: 'Bottoms' },
  { id: 'outerwear', label: 'Outerwear' },
];

export default function Products() {
  const [searchParams] = useSearchParams();
  const [activeFilter, setActiveFilter] = useState(searchParams.get('filter') || 'all');
  const [sort, setSort] = useState('default');
  const [localSearch, setLocalSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const f = searchParams.get('filter');
    if (f) setActiveFilter(f);
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    setError('');
    fetchProducts()
      .then(data => {
        if (data.success) setProducts(data.products);
        else setError('Failed to load products.');
      })
      .catch(() => setError("Cannot connect to server. Make sure it's running on port 4000."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = [...products];
    if (localSearch.trim()) {
      const q = localSearch.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
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

  return (
    <div className="bg-brand-bg min-h-screen pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-0.5 bg-white" />
            <span className="text-white text-xs font-semibold uppercase tracking-widest">Catalogue</span>
          </div>
          <h1 className="text-brand-cream text-3xl md:text-4xl font-bold">All Products</h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M16.65 16.65A7 7 0 1116.65 3a7 7 0 010 13.65z" />
            </svg>
            <input
              type="text"
              value={localSearch}
              onChange={e => setLocalSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm placeholder-white/25 focus:outline-none focus:border-white/25 transition-colors"
            />
          </div>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-white/25 transition-colors appearance-none cursor-pointer"
          >
            <option value="default">Sort: Default</option>
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        <div className="flex gap-2 flex-wrap mb-8">
          {allCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider border transition-all ${
                activeFilter === cat.id
                  ? 'bg-white text-black border-white'
                  : 'bg-transparent text-white/50 border-white/15 hover:border-white/35 hover:text-white/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-white/10 border-t-white/50 rounded-full animate-spin" />
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-24">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-24">
                <p className="text-white/30 text-sm">No products found.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
