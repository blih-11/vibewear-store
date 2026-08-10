import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency, CURRENCIES } from '../context/CurrencyContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [photoError, setPhotoError] = useState(false); // fall back to the default icon if the Google photo URL fails to load
  const { cartCount, setSearchOpen } = useCart();
  const { user, logout } = useAuth();
  const { currency, setCurrency, currentCurrency } = useCurrency();
  const location = useLocation();
  const accountRef = useRef(null);

  const isHome = location.pathname === '/';

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  useEffect(() => { setPhotoError(false); }, [user?.photoURL]);
  useEffect(() => { setMenuOpen(false); }, [location]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Close the mobile sidebar automatically if the viewport is resized (or
  // rotated) up past the mobile breakpoint, so it doesn't stay stuck open.
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 767) setMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Shop' },
    { to: '/contact', label: 'Contact' },
  ];
  const isActive = (to) => location.pathname === to;

  const iconColor = scrolled ? '#111' : '#fff';
  // When menu is open, hamburger bars must always be dark (menu bg is white)
  const barColor = menuOpen ? '#111' : iconColor;

  return (
    <>
      {/* ── NAV ── */}
      <nav
        className="zttw-nav"
        style={{
          background: scrolled ? '#fff' : 'transparent',
          borderBottom: scrolled ? '1px solid #ebebeb' : '1px solid transparent',
          boxShadow: scrolled ? '0 1px 12px rgba(0,0,0,0.06)' : 'none',
        }}
      >
        {/* LEFT */}
        <div className="zttw-nav__left">
          <div className="zttw-nav__links">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="zttw-nav__link"
                style={{
                  color: iconColor,
                  borderBottomColor: isActive(link.to) ? iconColor : 'transparent',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button
            className="zttw-hamburger"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Menu"
          >
            <span style={{ background: barColor }} className={`zttw-bar${menuOpen ? ' b1-open' : ''}`} />
            <span style={{ background: barColor, width: '18px' }} className={`zttw-bar${menuOpen ? ' b2-open' : ''}`} />
            <span style={{ background: barColor }} className={`zttw-bar${menuOpen ? ' b3-open' : ''}`} />
          </button>
        </div>

        {/* CENTER: logo — white over the transparent hero, black once scrolled */}
        <div className="zttw-nav__center">
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <img
              style={{ height: "50px"}}
              src={scrolled ? '/images/vibewear-logo-black.png' : '/images/vibewear-logo-white.png'}
              alt="Vibe Wear"
              className="zttw-nav__logo"
            />
          </Link>
        </div>

        {/* RIGHT */}
        <div className="zttw-nav__right">
          {/* Currency (desktop) */}
          <div className="desktop-only" style={{ position: 'relative' }}>
            <button onClick={() => setCurrencyOpen(o => !o)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '4px',
              fontFamily: 'var(--font-body)', fontSize: '0.72rem',
              color: iconColor, transition: 'color 0.3s ease',
            }}>
              <span>{currentCurrency.flag}</span>
              <span>{currency}</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                style={{ transform: currencyOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>
            {currencyOpen && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 149 }} onClick={() => setCurrencyOpen(false)} />
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  background: '#fff', border: '1px solid #e5e5e5',
                  borderRadius: '12px', padding: '6px', minWidth: '190px',
                  zIndex: 150, boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                  maxHeight: '300px', overflowY: 'auto',
                }}>
                  {CURRENCIES.map(cur => (
                    <button key={cur.code} onClick={() => { setCurrency(cur.code); setCurrencyOpen(false); }}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '8px 10px', borderRadius: '8px', border: 'none',
                        background: currency === cur.code ? '#f5f5f5' : 'transparent',
                        cursor: 'pointer', color: currency === cur.code ? '#000' : '#666',
                      }}>
                      <span style={{ fontSize: '1rem' }}>{cur.flag}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', flex: 1, textAlign: 'left' }}>{cur.code}</span>
                      {currency === cur.code && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5"><path d="m5 12 5 5 9-9"/></svg>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Search */}
          <button onClick={() => setSearchOpen && setSearchOpen(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: iconColor, padding: '4px', display: 'flex', alignItems: 'center', transition: 'color 0.3s ease' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>

          {/* Account (desktop) */}
          <div className="desktop-only" style={{ position: 'relative' }} ref={accountRef}>
            <button onClick={() => setAccountOpen(o => !o)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: iconColor, padding: '4px', display: 'flex', alignItems: 'center', transition: 'color 0.3s ease' }}>
              {user?.photoURL && !photoError
                ? <img src={user.photoURL} alt="" referrerPolicy="no-referrer" onError={() => setPhotoError(true)} style={{ width: 22, height: 22, borderRadius: '50%' }} />
                : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              }
            </button>
            {accountOpen && (
              <>
                <div style={{ position: 'fixed', inset: 0, zIndex: 149 }} onClick={() => setAccountOpen(false)} />
                <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: '#fff', border: '1px solid #e5e5e5', borderRadius: '14px', padding: '8px', minWidth: '180px', zIndex: 150, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
                  {user ? (
                    <>
                      <div style={{ padding: '8px 12px 10px', borderBottom: '1px solid #f0f0f0', marginBottom: '4px' }}>
                        <p style={{ color: '#000', fontSize: '0.78rem', fontWeight: 600, margin: 0 }}>{user.displayName || 'Account'}</p>
                        <p style={{ color: '#aaa', fontSize: '0.65rem', margin: 0 }}>{user.email}</p>
                      </div>
                      <Link to="/orders" onClick={() => setAccountOpen(false)}
                        style={{ display: 'block', padding: '9px 12px', color: '#555', textDecoration: 'none', fontSize: '0.78rem' }}>
                        Order History
                      </Link>
                      <button onClick={() => { logout(); setAccountOpen(false); }}
                        style={{ width: '100%', padding: '9px 12px', background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer', fontSize: '0.78rem', textAlign: 'left' }}>
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <Link to="/auth" onClick={() => setAccountOpen(false)}
                      style={{ display: 'block', padding: '9px 12px', color: '#555', textDecoration: 'none', fontSize: '0.78rem' }}>
                      Sign In
                    </Link>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Cart */}
          <Link to="/cart" style={{ position: 'relative', color: iconColor, display: 'flex', alignItems: 'center', padding: '4px', transition: 'color 0.3s ease' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: '-2px', right: '-5px',
                background: scrolled ? '#000' : '#fff',
                color: scrolled ? '#fff' : '#000',
                borderRadius: '50%', minWidth: '16px', height: '16px',
                fontSize: '9px', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.3s ease',
              }}>
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* ── MOBILE FULL-SCREEN MENU ── */}
      <div className={`zttw-mobile-menu${menuOpen ? ' zttw-mobile-menu--open' : ''}`}>
        <div style={{ padding: '0 1.5rem', flex: 1 }}>
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.1rem 0',
                borderBottom: '1px solid #e0e0e0',
                textDecoration: 'none',
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 9vw, 3.4rem)',
                fontWeight: 700,
                color: '#000',
                letterSpacing: '-0.01em',
              }}
            >
              <span>{link.label}</span>
              <span style={{ color: '#999', fontSize: '1.3rem' }}>→</span>
            </Link>
          ))}
        </div>
        {/* Account / sign in — was desktop-only before, now visible on mobile too */}
        <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid #e0e0e0' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
              <Link to="/orders" onClick={() => setMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: '#000' }}>
                {user.photoURL && !photoError
                  ? <img src={user.photoURL} alt="" referrerPolicy="no-referrer" onError={() => setPhotoError(true)} style={{ width: 32, height: 32, borderRadius: '50%' }} />
                  : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                }
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.displayName || 'Order History'}</span>
              </Link>
              <button onClick={() => { logout(); setMenuOpen(false); }}
                style={{ background: 'none', border: 'none', color: '#e53e3e', fontSize: '0.78rem', cursor: 'pointer', padding: '6px 0' }}>
                Sign Out
              </button>
            </div>
          ) : (
            <Link to="/auth" onClick={() => setMenuOpen(false)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: '#000' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Sign In / Sign Up</span>
            </Link>
          )}
        </div>

        <div style={{ padding: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '8px', borderTop: '1px solid #e0e0e0' }}>
          {CURRENCIES.slice(0, 6).map(cur => (
            <button key={cur.code} onClick={() => { setCurrency(cur.code); }}
              style={{
                padding: '6px 12px', borderRadius: '8px', border: '1px solid',
                borderColor: currency === cur.code ? '#000' : '#ccc',
                background: currency === cur.code ? '#000' : 'transparent',
                color: currency === cur.code ? '#fff' : '#333',
                fontSize: '0.72rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '4px',
              }}>
              {cur.flag} {cur.code}
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .zttw-nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2.5rem;
          height: 72px;
          transition: background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
        }

        .zttw-nav__left,
        .zttw-nav__center,
        .zttw-nav__right {
          display: flex;
          align-items: center;
          flex: 1;
        }
        .zttw-nav__center { justify-content: center; }
        .zttw-nav__right  { justify-content: flex-end; gap: 1.2rem; }

        .zttw-nav__logo { height: 28px; width: auto; display: block; }

        .zttw-nav__links { display: flex; gap: 2rem; align-items: center; }
        .zttw-nav__link {
          text-decoration: none;
          font-family: var(--font-body);
          font-size: 0.9rem;
          font-weight: 400;
          padding-bottom: 2px;
          border-bottom: 1.5px solid transparent;
          transition: color 0.3s ease, border-color 0.3s ease;
        }
        .zttw-nav__link:hover { border-bottom-color: currentColor; }

        .zttw-hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
        }
        .zttw-bar {
          display: block;
          width: 24px; height: 1.5px;
          border-radius: 2px;
          transition: all 0.25s ease;
        }
        .b1-open { transform: rotate(45deg) translateY(6.5px); }
        .b2-open { opacity: 0; }
        .b3-open { transform: rotate(-45deg) translateY(-6.5px); }

        .zttw-mobile-menu {
          position: fixed;
          inset: 0;
          z-index: 99;
          background: #fff;
          display: flex;
          flex-direction: column;
          padding-top: 72px;
          transform: translateX(100%);
          transition: transform 0.32s cubic-bezier(0.4,0,0.2,1);
          overflow-y: auto;
        }
        .zttw-mobile-menu--open { transform: translateX(0); }

        .desktop-only { display: flex; }

        @media (max-width: 767px) {
          .zttw-nav {
            height: 64px;
            padding: 0 1.1rem;
          }
          .zttw-nav__links { display: none; }
          .zttw-hamburger { display: flex; }
          .desktop-only { display: none !important; }
          .zttw-nav__right { gap: 0.9rem; }
          .zttw-mobile-menu { padding-top: 64px; }
        }
      `}</style>
    </>
  );
}