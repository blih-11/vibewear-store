import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { fetchProducts } from '../lib/api';

export default function SearchModal() {
  const { searchOpen, setSearchOpen } = useCart();
  const [query, setQuery] = useState('');
  const [allProducts, setAllProducts] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Load products once when modal first opens
  useEffect(() => {
    if (searchOpen && allProducts.length === 0) {
      fetchProducts().then(data => { if (data.success) setAllProducts(data.products); }).catch(() => {});
    }
    if (searchOpen) { setTimeout(() => inputRef.current?.focus(), 100); }
    else { setQuery(''); }
  }, [searchOpen]);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') setSearchOpen(false); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [setSearchOpen]);

  const results = query.trim().length > 1
    ? allProducts.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.tags?.some(t => t.toLowerCase().includes(query.toLowerCase())) ||
        p.category?.some(c => c.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 6)
    : [];

  const handleSelect = (product) => { setSearchOpen(false); navigate(`/products/${product._id}`); };

  return (
    <>
      <div className={`fixed inset-0 bg-black/70 z-[60] transition-opacity duration-300 ${searchOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setSearchOpen(false)} />
      <div className={`fixed top-0 left-0 right-0 z-[70] transition-all duration-300 px-4 ${searchOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
        <div className="max-w-2xl mx-auto mt-20">
          <div className="bg-brand-bg border border-white/12 rounded-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8">
              <svg className="w-5 h-5 text-brand-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search products, categories..."
                className="flex-1 bg-transparent text-brand-cream placeholder:text-brand-muted text-base focus:outline-none"
                onKeyDown={e => { if (e.key === 'Enter' && results.length > 0) handleSelect(results[0]); }} />
              <button onClick={() => setSearchOpen(false)} className="text-brand-muted hover:text-brand-cream">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {results.length > 0 && (
              <div className="py-2 max-h-80 overflow-y-auto">
                {results.map(product => (
                  <button key={product._id} onClick={() => handleSelect(product)}
                    className="w-full flex items-center gap-4 px-5 py-3 hover:bg-white/5 transition-colors text-left">
                    <img src={product.image} alt={product.name} className="w-12 h-14 object-cover rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-brand-cream text-sm font-medium truncate">{product.name}</p>
                      <p className="text-brand-muted text-xs mt-0.5 capitalize">{product.category?.join(', ')}</p>
                    </div>
                    <span className="text-brand-cream font-bold text-sm flex-shrink-0">${product.price.toFixed(2)}</span>
                  </button>
                ))}
              </div>
            )}

            {query.length > 1 && results.length === 0 && (
              <div className="p-6 text-center text-brand-muted text-sm">
                No results for "<span className="text-brand-cream">{query}</span>"
              </div>
            )}

            {query.length === 0 && (
              <div className="px-5 py-4">
                <p className="text-brand-muted text-xs uppercase tracking-widest mb-3">Popular searches</p>
                <div className="flex flex-wrap gap-2">
                  {['Tees', 'Graphic', 'Shorts', 'Outerwear', 'New Arrivals', 'Bundles'].map(tag => (
                    <button key={tag} onClick={() => setQuery(tag)}
                      className="px-3 py-1.5 bg-white/5 text-brand-muted hover:text-brand-cream hover:bg-white/10 rounded-full text-sm transition-colors">
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
