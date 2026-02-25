import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCurrency, CURRENCIES } from '../context/CurrencyContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const { cartCount, setSearchOpen } = useCart();
  const { currency, setCurrency, currentCurrency } = useCurrency();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/about', label: 'About' },
    { to: '/find-store', label: 'Find Store' },
    { to: '/cart', label: 'Cart' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? 'rgba(10,10,10,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid #1a1a1a' : 'none',
        transition: 'all 0.3s ease',
        padding: '0 1.5rem',
        height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.55rem', color: '#fff', letterSpacing: '0.08em' }}>VIBE WEAR</span>
        </Link>

        <div className="desktop-nav" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {navLinks.filter(l => l.label !== 'Cart').map(link => (
            <Link key={link.to} to={link.to} style={{
              textDecoration: 'none', fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: location.pathname === link.to ? '#fff' : '#777', transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.target.style.color = '#fff'}
            onMouseLeave={e => e.target.style.color = location.pathname === link.to ? '#fff' : '#777'}>
              {link.label}
            </Link>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {/* Currency Selector */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setCurrencyOpen(o => !o)}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '8px',
                cursor: 'pointer',
                color: '#ccc',
                padding: '4px 10px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                letterSpacing: '0.08em',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
            >
              <span style={{ fontSize: '0.85rem' }}>{currentCurrency.flag}</span>
              <span>{currency}</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                style={{ transform: currencyOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>

            {/* Dropdown */}
            {currencyOpen && (
              <>
                <div
                  style={{ position: 'fixed', inset: 0, zIndex: 149 }}
                  onClick={() => setCurrencyOpen(false)}
                />
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  background: '#0e0e0e', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px', padding: '6px', minWidth: '200px',
                  zIndex: 150, boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
                  maxHeight: '360px', overflowY: 'auto',
                }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: '#555', letterSpacing: '0.15em', padding: '6px 10px 8px', textTransform: 'uppercase' }}>
                    Select Currency
                  </div>
                  {CURRENCIES.map(cur => (
                    <button
                      key={cur.code}
                      onClick={() => { setCurrency(cur.code); setCurrencyOpen(false); }}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '9px 10px', borderRadius: '8px', border: 'none',
                        background: currency === cur.code ? 'rgba(255,255,255,0.08)' : 'transparent',
                        cursor: 'pointer', transition: 'background 0.15s',
                        color: currency === cur.code ? '#fff' : '#888',
                      }}
                      onMouseEnter={e => { if (currency !== cur.code) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                      onMouseLeave={e => { if (currency !== cur.code) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>{cur.flag}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '0.06em', flex: 1, textAlign: 'left' }}>
                        {cur.code}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#555' }}>
                        {cur.symbol} · {cur.name}
                      </span>
                      {currency === cur.code && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="m5 12 5 5 9-9"/></svg>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <button onClick={() => setSearchOpen && setSearchOpen(true)}
            className="search-btn-desktop"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: '4px', display: 'flex', alignItems: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </button>
          <Link to="/cart" style={{ position: 'relative', color: '#aaa', display: 'flex', alignItems: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: '-8px', right: '-8px',
                background: '#fff', color: '#000', borderRadius: '50%',
                width: '16px', height: '16px', fontSize: '9px',
                fontFamily: 'var(--font-mono)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontWeight: 700,
              }}>{cartCount}</span>
            )}
          </Link>
          <button onClick={() => setMenuOpen(!menuOpen)} className="hamburger-btn"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end', justifyContent: 'center' }}>
            <span style={{ display: 'block', width: '22px', height: '2px', background: '#ccc', borderRadius: '2px', transition: 'all 0.25s', transform: menuOpen ? 'rotate(45deg) translateY(6px)' : 'none' }} />
            <span style={{ display: 'block', width: '16px', height: '2px', background: '#ccc', borderRadius: '2px', transition: 'all 0.25s', opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display: 'block', width: '22px', height: '2px', background: '#ccc', borderRadius: '2px', transition: 'all 0.25s', transform: menuOpen ? 'rotate(-45deg) translateY(-6px)' : 'none' }} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 99,
        background: '#050505',
        display: 'flex', flexDirection: 'column',
        paddingTop: '80px', paddingBottom: '80px',
        transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
      }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 2rem', gap: '0' }}>
          {navLinks.map((link, i) => (
            <Link key={link.to} to={link.to} style={{
              textDecoration: 'none', fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 8vw, 3.5rem)',
              color: location.pathname === link.to ? '#fff' : '#333',
              letterSpacing: '0.04em', borderBottom: '1px solid #111',
              padding: '1rem 0', display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', transition: 'color 0.2s',
            }}
            onTouchStart={e => e.currentTarget.style.color = '#fff'}
            onTouchEnd={e => e.currentTarget.style.color = location.pathname === link.to ? '#fff' : '#333'}>
              <span>{link.label}</span>
              <span style={{ fontSize: '1.2rem', color: '#222' }}>→</span>
            </Link>
          ))}
        </div>
        <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid #111', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {/* Search in mobile menu */}
          <button
            onClick={() => { setSearchOpen && setSearchOpen(true); setMenuOpen(false); }}
            style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '10px', cursor: 'pointer', color: '#888',
              padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px',
              fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.12em',
              textTransform: 'uppercase', width: '100%',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            Search Products
          </button>

          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#444', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>FOLLOW US</div>
            <a href="https://instagram.com/vibewear_" target="_blank" rel="noreferrer"
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#888', letterSpacing: '0.15em', textDecoration: 'none' }}>
              @vibewear_ ↗
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Nav - Mobile */}
      {/* Bottom Nav - Mobile */}
<div className="bottom-nav" style={{
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  zIndex: 98,
  background: 'rgba(18,18,18,0.98)', // slightly lighter
  borderTop: '1px solid rgba(255,255,255,0.08)', // softer light border
  display: 'flex',
  height: '60px',
  backdropFilter: 'blur(14px)',
  boxShadow: '0 -6px 25px rgba(0,0,0,0.6)', // stronger separation
}}>
  {[
    { to: '/', label: 'Home', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
    { to: '/products', label: 'Shop', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> },
    { to: '/cart', label: 'Cart', badge: cartCount, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> },
    { to: '/find-store', label: 'Store', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> },
    { to: '/contact', label: 'Contact', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
  ].map(item => {
    const active = location.pathname === item.to;
    return (
      <Link
        key={item.to}
        to={item.to}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3px',
          textDecoration: 'none',
          color: active ? '#ffffff' : '#b0b0b0', // brighter inactive
          position: 'relative',
          transition: 'color 0.2s',
          textShadow: active ? '0 0 8px rgba(255,255,255,0.4)' : 'none', // glow
        }}
      >
        {item.badge > 0 && (
          <span style={{
            position: 'absolute',
            top: '6px',
            left: '55%',
            background: '#ffffff',
            color: '#000',
            borderRadius: '50%',
            minWidth: '16px',
            height: '16px',
            fontSize: '9px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            boxShadow: '0 0 10px rgba(255,255,255,0.6)', // glow badge
          }}>
            {item.badge}
          </span>
        )}

        {item.icon}

        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.55rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase'
        }}>
          {item.label}
        </span>
      </Link>
    );
  })}
</div>

      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @media(min-width:768px){ .hamburger-btn{display:none!important} .bottom-nav{display:none!important} .desktop-nav{display:flex!important} .search-btn-desktop{display:flex!important} }
        @media(max-width:767px){ .desktop-nav{display:none!important} .search-btn-desktop{display:none!important} }
      `}</style>
    </>
  );
}
