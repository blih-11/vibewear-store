import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import HeroSlider from '../components/HeroSlider';
import ProductCard from '../components/ProductCard';
import { heroSlides, storeLocations } from '../data/products';
import { fetchProducts } from '../lib/api';

function SectionHeader({ eyebrow, title, subtitle, cta, ctaAction }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-8">
      <div>
        {eyebrow && (
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-0.5 bg-white" />
            <span className="text-white text-xs font-semibold uppercase tracking-widest">{eyebrow}</span>
          </div>
        )}
        <h2 className="text-brand-cream text-2xl md:text-3xl font-bold">{title}</h2>
        {subtitle && <p className="text-brand-muted text-sm mt-1.5 max-w-lg">{subtitle}</p>}
      </div>
      {cta && (
        <button onClick={ctaAction} className="flex items-center gap-1.5 text-white text-sm font-semibold hover:gap-2.5 transition-all flex-shrink-0">
          {cta} <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      )}
    </div>
  );
}

const categoryItems = [
  { label: 'Graphic Tees', sub: 'Bold prints, boxy cuts, heavy cotton', image: '/images/products/img_13.jpg', filter: 'tops' },
  { label: 'Bottoms', sub: 'Denim, cargo shorts, wide-leg', image: '/images/products/img_28.jpg', filter: 'bottoms' },
  { label: 'Outerwear', sub: 'Hoodies, jackets, statement pieces', image: '/images/products/img_37.jpg', filter: 'outerwear' },
  { label: 'New Arrivals', sub: 'Latest drops — move fast', image: '/images/products/img_47.jpg', filter: 'new-arrivals' },
];

export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then(data => { if (data.success) setProducts(data.products); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const saleItems    = products.filter(p => p.isSale).slice(0, 4);
  const newArrivals  = products.filter(p => p.isNew).slice(0, 4);
  const featured     = products.filter(p => !p.isSale && !p.isNew).slice(0, 4);

  const ProductGrid = ({ items }) => loading ? (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="aspect-[3/4] rounded-xl bg-white/5 animate-pulse" />
      ))}
    </div>
  ) : (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
      {items.map(p => <ProductCard key={p._id} product={p} />)}
    </div>
  );

  return (
    <div className="bg-brand-bg min-h-screen">
      <HeroSlider slides={heroSlides} />

      {/* Marquee Strip */}
      <div className="bg-white/4 border-y border-white/8 overflow-hidden py-3">
        <div className="flex gap-10 animate-[marquee_22s_linear_infinite] whitespace-nowrap">
          {Array(8).fill(['Free Shipping Over ₦50k', 'New Season Drop', 'WE THE WAVE', 'Street Premium Quality']).flat().map((text, i) => (
            <span key={i} className="text-white/60 text-xs font-semibold uppercase tracking-widest flex items-center gap-4">
              {text} <span className="opacity-40">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Sales Section */}
      {(loading || saleItems.length > 0) && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <SectionHeader eyebrow="Limited Time" title="Sales & Offers" subtitle="Save on selected pieces. Grab them before they're gone." cta="View All Sales" ctaAction={() => navigate('/products?filter=sale')} />
          <ProductGrid items={saleItems} />
        </section>
      )}

      {/* Categories */}
      <section className="bg-white/2 border-y border-white/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader eyebrow="Browse" title="Shop by Category" subtitle="Curated selections for every style and occasion." />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {categoryItems.map(cat => (
              <div key={cat.filter} onClick={() => navigate(`/products?filter=${cat.filter}`)}
                className="relative group aspect-[3/4] rounded-xl overflow-hidden cursor-pointer">
                <img src={cat.image} alt={cat.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-lg">{cat.label}</h3>
                  <p className="text-white/60 text-xs mt-0.5">{cat.sub}</p>
                  <div className="mt-2 text-white text-xs font-semibold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    Shop Now →
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <SectionHeader eyebrow="Just Dropped" title="New Arrivals" subtitle="Fresh styles from Season 4 — first to wear, first to wave." cta="See More" ctaAction={() => navigate('/products?filter=new-arrivals')} />
        <ProductGrid items={newArrivals} />
      </section>

      {/* Feature Banner */}
      <section className="relative overflow-hidden py-24">
        <img src="/images/products/img_30.jpg" alt="Feature" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-brand-bg/82" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-white/50 text-xs font-semibold uppercase tracking-widest">The VIBE WEAR Way</span>
          <h2 className="text-brand-cream text-4xl md:text-5xl font-black mt-2 mb-4 leading-tight">
            Real Drops,<br />Real Drip
          </h2>
          <p className="text-brand-cream/65 max-w-lg mx-auto mb-7 text-base leading-relaxed">
            Every VIBE WEAR piece is a statement. Real product, hand-picked — heavyweight tees, graphic prints, denim, and outerwear built for those who dress with intention.
          </p>
          <button onClick={() => navigate('/about')} className="bg-white text-black font-bold px-8 py-3.5 rounded-lg hover:opacity-88 transition-all duration-200">
            Our Story
          </button>
        </div>
      </section>

      {/* Featured Pieces */}
      <section className="bg-white/2 border-y border-white/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader eyebrow="Editor's Pick" title="Featured Pieces" subtitle="Handpicked for this season's must-haves." cta="Browse All" ctaAction={() => navigate('/products')} />
          <ProductGrid items={featured} />
        </div>
      </section>

      {/* Bold by Design Banner */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative rounded-2xl overflow-hidden bg-white p-8 md:p-14">
            <div className="absolute top-0 right-0 w-56 h-56 rounded-full border-4 border-black/8 translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full border-4 border-black/8 -translate-x-1/4 translate-y-1/4" />
            <div className="relative grid md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-black/50 text-xs font-semibold uppercase tracking-widest">The Brand</span>
                <h2 className="text-black text-4xl md:text-5xl font-black mt-2 mb-4 leading-tight">Bold by Design</h2>
                <p className="text-black/65 leading-relaxed mb-7 text-sm md:text-base">
                  VIBE WEAR was born on the block and built for the streets. Our drops are for those who move with confidence — bold fits, premium fabrics, and zero compromise on style.
                </p>
                <div className="grid grid-cols-3 gap-5 mb-7">
                  {[['2021', 'Founded'], ['30+', 'Drops'], ['5K+', 'On The Wave']].map(([num, label]) => (
                    <div key={label}>
                      <div className="text-black font-black text-2xl">{num}</div>
                      <div className="text-black/50 text-xs mt-0.5">{label}</div>
                    </div>
                  ))}
                </div>
                <button onClick={() => navigate('/products')} className="bg-black text-white font-bold px-7 py-3.5 rounded-lg hover:opacity-88 transition-colors">
                  Shop the Brand
                </button>
              </div>
              <div className="hidden md:grid grid-cols-2 gap-3">
                {['/images/products/img_36.jpg', '/images/products/img_42.jpg', '/images/products/img_28.jpg', '/images/products/img_34.jpg'].map((src, i) => (
                  <div key={i} className={`rounded-xl overflow-hidden ${i % 2 === 1 ? 'mt-5' : ''}`}>
                    <img src={src} alt="" className="w-full aspect-square object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Store Locations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 pb-24">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-0.5 bg-white" />
              <span className="text-white text-xs font-semibold uppercase tracking-widest">Find Us</span>
            </div>
            <h2 className="text-brand-cream text-2xl md:text-3xl font-bold mb-4">Visit a VIBE WEAR Store</h2>
            <p className="text-brand-muted text-sm leading-relaxed mb-7">
              Come through in person. Feel the fabric, try the fit, catch the vibe.
            </p>
            <div className="space-y-3">
              {storeLocations.slice(0, 2).map(store => (
                <div key={store.id} className="bg-white/4 border border-white/8 rounded-xl p-4">
                  <h4 className="text-brand-cream font-semibold text-sm">{store.name}</h4>
                  <p className="text-brand-muted text-xs mt-1">{store.address}</p>
                  <p className="text-brand-muted text-xs mt-0.5">{store.hours}</p>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/find-store')} className="mt-5 flex items-center gap-1.5 text-white text-sm font-semibold hover:gap-2.5 transition-all">
              All Locations <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          <div className="relative rounded-xl overflow-hidden aspect-square">
            <img src="/images/products/img_22.jpg" alt="VIBE WEAR Store" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-5 left-5">
              <p className="text-white/60 text-xs uppercase tracking-widest">Lagos Flagship</p>
              <p className="text-white font-bold text-lg mt-1">Victoria Island</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
