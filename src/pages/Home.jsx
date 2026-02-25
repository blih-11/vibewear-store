import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import HeroAnimation from '../components/HeroAnimation';
import ProductCard from '../components/ProductCard';
import { storeLocations } from '../data/products';
import { fetchProducts } from '../lib/api';

// Scroll reveal hook
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.12 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function SectionHeader({ eyebrow, title, subtitle, cta, ctaAction }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-8"
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(32px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)' }}>
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

const MARQUEE_WORDS = ['Free Shipping Over ₵500', 'New Season Drop', 'WE THE WAVE', 'Street Premium Quality', 'Ghana Made', 'Limited Drops'];

export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [catRef, catVisible] = useReveal();
  const [bannerRef, bannerVisible] = useReveal();
  const [boldRef, boldVisible] = useReveal();
  const [storeRef, storeVisible] = useReveal();

  useEffect(() => {
    fetchProducts()
      .then(data => { if (data.success) setProducts(data.products); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const saleItems   = products.filter(p => p.isSale).slice(0, 4);
  const newArrivals = products.filter(p => p.isNew).slice(0, 4);
  const featured    = products.filter(p => !p.isSale && !p.isNew).slice(0, 4);

  const ProductGrid = ({ items, delay = 0 }) => {
    const [ref, visible] = useReveal();
    return loading ? (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
        {[...Array(4)].map((_, i) => <div key={i} className="aspect-[3/4] rounded-xl bg-white/5 animate-pulse" />)}
      </div>
    ) : (
      <div ref={ref} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
        {items.map((p, i) => (
          <div key={p._id} style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(48px)',
            transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${delay + i * 0.08}s`,
          }}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-brand-bg min-h-screen">
      {/* Hero */}
      <HeroAnimation />

      {/* Marquee strip */}
      <div style={{ background: 'rgba(255,255,255,0.03)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', padding: '12px 0', position: 'relative' }}>
        {/* fade edges */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(to right, #080808, transparent)', zIndex: 2 }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 80, background: 'linear-gradient(to left, #080808, transparent)', zIndex: 2 }} />
        <div style={{ display: 'flex', gap: '3rem', animation: 'marquee 28s linear infinite', whiteSpace: 'nowrap' }}>
          {[...Array(3)].fill(MARQUEE_WORDS).flat().map((text, i) => (
            <span key={i} style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.62rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.25em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '3rem' }}>
              {text} <span style={{ opacity: 0.3, fontSize: '0.5rem' }}>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Sales */}
      {(loading || saleItems.length > 0) && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <SectionHeader eyebrow="Limited Time" title="Sales & Offers" subtitle="Save on selected pieces. Grab them before they're gone." cta="View All Sales" ctaAction={() => navigate('/products?filter=sale')} />
          <ProductGrid items={saleItems} />
        </section>
      )}

      {/* Categories */}
      <section style={{ background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)', padding: '4rem 0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader eyebrow="Browse" title="Shop by Category" subtitle="Curated selections for every style and occasion." />
          <div ref={catRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {categoryItems.map((cat, i) => (
              <div
                key={cat.filter}
                onClick={() => navigate(`/products?filter=${cat.filter}`)}
                style={{
                  opacity: catVisible ? 1 : 0,
                  transform: catVisible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.97)',
                  transition: `all 0.75s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s`,
                }}
                className="relative group aspect-[3/4] rounded-xl overflow-hidden cursor-pointer"
              >
                <img src={cat.image} alt={cat.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-bold text-lg leading-tight">{cat.label}</h3>
                  <p className="text-white/50 text-xs mt-0.5">{cat.sub}</p>
                  <div style={{ overflow: 'hidden', height: '1.5rem', marginTop: '0.5rem' }}>
                    <div className="text-white text-xs font-semibold uppercase tracking-widest transition-transform duration-300 group-hover:translate-y-0 translate-y-full flex items-center gap-1.5">
                      Shop Now <span>→</span>
                    </div>
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
        <ProductGrid items={newArrivals} delay={0.1} />
      </section>

      {/* Feature banner */}
      <section ref={bannerRef} style={{ position: 'relative', overflow: 'hidden', padding: '8rem 0' }}>
        <img src="/images/products/img_30.jpg" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,8,8,0.82)' }} />
        {/* Animated border lines */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1,
          background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent)',
          transform: bannerVisible ? 'scaleX(1)' : 'scaleX(0)',
          transition: 'transform 1.4s cubic-bezier(0.4,0,0.2,1)',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
          background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent)',
          transform: bannerVisible ? 'scaleX(1)' : 'scaleX(0)',
          transition: 'transform 1.4s cubic-bezier(0.4,0,0.2,1) 0.2s',
        }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <span style={{
            color: 'rgba(255,255,255,0.4)', fontSize: '0.6rem', fontFamily: 'var(--font-mono)',
            letterSpacing: '0.35em', textTransform: 'uppercase', display: 'block', marginBottom: '1rem',
            opacity: bannerVisible ? 1 : 0, transition: 'opacity 0.8s 0.3s',
          }}>The VIBE WEAR Way</span>
          <h2 style={{
            color: '#fff', fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3rem, 9vw, 7rem)', fontWeight: 900,
            letterSpacing: '-0.02em', lineHeight: 0.9,
            margin: '0 0 1.5rem',
            opacity: bannerVisible ? 1 : 0,
            transform: bannerVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 1s cubic-bezier(0.16,1,0.3,1) 0.2s',
          }}>
            Real Drops,<br />Real Drip
          </h2>
          <p style={{
            color: 'rgba(255,255,255,0.55)', maxWidth: 480, margin: '0 auto 2.5rem',
            lineHeight: 1.7, fontSize: '0.95rem',
            opacity: bannerVisible ? 1 : 0,
            transform: bannerVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.9s cubic-bezier(0.16,1,0.3,1) 0.4s',
          }}>
            Every VIBE WEAR piece is a statement. Heavyweight tees, graphic prints, denim, and outerwear built for those who dress with intention.
          </p>
          <button
            onClick={() => navigate('/about')}
            style={{
              background: '#fff', color: '#000', fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase',
              padding: '16px 40px', border: 'none', cursor: 'pointer',
              opacity: bannerVisible ? 1 : 0,
              transform: bannerVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.9s cubic-bezier(0.16,1,0.3,1) 0.5s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.outline = '1.5px solid #fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; e.currentTarget.style.outline = 'none'; }}
          >
            Our Story
          </button>
        </div>
      </section>

      {/* Featured Pieces */}
      <section style={{ background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)', padding: '4rem 0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeader eyebrow="Editor's Pick" title="Featured Pieces" subtitle="Handpicked for this season's must-haves." cta="Browse All" ctaAction={() => navigate('/products')} />
          <ProductGrid items={featured} delay={0.05} />
        </div>
      </section>

      {/* Bold by Design */}
      <section className="py-20" ref={boldRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div style={{
            position: 'relative', borderRadius: 16, overflow: 'hidden', background: '#fff', padding: 'clamp(2rem, 5vw, 3.5rem)',
            opacity: boldVisible ? 1 : 0,
            transform: boldVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 0.9s cubic-bezier(0.16,1,0.3,1)',
          }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: 220, height: 220, borderRadius: '50%', border: '4px solid rgba(0,0,0,0.06)', transform: 'translate(33%, -33%)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: 160, height: 160, borderRadius: '50%', border: '4px solid rgba(0,0,0,0.06)', transform: 'translate(-25%, 25%)' }} />
            <div className="relative grid md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-black/50 text-xs font-semibold uppercase tracking-widest">The Brand</span>
                <h2 className="text-black text-4xl md:text-5xl font-black mt-2 mb-4 leading-tight">Bold by Design</h2>
                <p className="text-black/60 leading-relaxed mb-7 text-sm md:text-base">
                  VIBE WEAR was born on the block and built for the streets. Our drops are for those who move with confidence — bold fits, premium fabrics, and zero compromise on style.
                </p>
                <div className="grid grid-cols-3 gap-5 mb-7">
                  {[['2021', 'Founded'], ['30+', 'Drops'], ['5K+', 'On The Wave']].map(([num, label], i) => (
                    <div key={label} style={{
                      opacity: boldVisible ? 1 : 0,
                      transform: boldVisible ? 'translateY(0)' : 'translateY(20px)',
                      transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${0.3 + i * 0.1}s`,
                    }}>
                      <div className="text-black font-black text-2xl">{num}</div>
                      <div className="text-black/50 text-xs mt-0.5">{label}</div>
                    </div>
                  ))}
                </div>
                <button onClick={() => navigate('/products')} className="bg-black text-white font-bold px-7 py-3.5 rounded-lg hover:opacity-80 transition-all">
                  Shop the Brand
                </button>
              </div>
              <div className="hidden md:grid grid-cols-2 gap-3">
                {['/images/products/img_36.jpg', '/images/products/img_42.jpg', '/images/products/img_28.jpg', '/images/products/img_34.jpg'].map((src, i) => (
                  <div key={i} style={{
                    borderRadius: 12, overflow: 'hidden',
                    marginTop: i % 2 === 1 ? 20 : 0,
                    opacity: boldVisible ? 1 : 0,
                    transform: boldVisible ? 'translateY(0)' : 'translateY(30px)',
                    transition: `all 0.8s cubic-bezier(0.16,1,0.3,1) ${0.2 + i * 0.1}s`,
                  }}>
                    <img src={src} alt="" className="w-full aspect-square object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Store Locations */}
      <section ref={storeRef} className="max-w-7xl mx-auto px-4 sm:px-6 py-16 pb-24">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div style={{
            opacity: storeVisible ? 1 : 0,
            transform: storeVisible ? 'translateX(0)' : 'translateX(-30px)',
            transition: 'all 0.9s cubic-bezier(0.16,1,0.3,1)',
          }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-0.5 bg-white" />
              <span className="text-white text-xs font-semibold uppercase tracking-widest">Find Us</span>
            </div>
            <h2 className="text-brand-cream text-2xl md:text-3xl font-bold mb-4">Visit a VIBE WEAR Store</h2>
            <p className="text-brand-muted text-sm leading-relaxed mb-7">Come through in person. Feel the fabric, try the fit, catch the vibe.</p>
            <div className="space-y-3">
              {storeLocations.slice(0, 2).map(store => (
                <div key={store.id} className="bg-white/4 border border-white/8 rounded-xl p-4 hover:border-white/15 transition-colors">
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
          <div style={{
            opacity: storeVisible ? 1 : 0,
            transform: storeVisible ? 'translateX(0)' : 'translateX(30px)',
            transition: 'all 0.9s cubic-bezier(0.16,1,0.3,1) 0.15s',
            position: 'relative', borderRadius: 12, overflow: 'hidden', aspectRatio: '1',
          }}>
            <img src="/images/products/img_22.jpg" alt="VIBE WEAR Store" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-5 left-5">
              <p className="text-white/60 text-xs uppercase tracking-widest">Lagos Flagship</p>
              <p className="text-white font-bold text-lg mt-1">Victoria Island</p>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
