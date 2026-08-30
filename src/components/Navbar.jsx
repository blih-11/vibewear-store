import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useCurrency, CURRENCIES } from '../context/CurrencyContext';
import { allProductsEntry } from '../data/categories';
import { useShopCategories } from '../hooks/useShopCategories';

// Emoji flags don't render reliably on every OS (notably Windows), so we use small
// flag images from a CDN instead — falls back to the emoji glyph if no country code is set.
function FlagIcon({ currency, size = 16 }) {
  if (!currency?.cc) return <span style={{ fontSize: size * 0.9 }}>{currency?.flag}</span>;
  return (
    <img
      src={`https://flagcdn.com/w40/${currency.cc}.png`}
      alt={currency.code}
      width={size}
      height={size * 0.75}
      style={{ objectFit: 'cover', borderRadius: '2px', display: 'inline-block', flexShrink: 0 }}
    />
  );
}

export default function Navbar() {  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);       // desktop dropdown
  const [mobileShopOpen, setMobileShopOpen] = useState(false); // mobile accordion
  const [photoError, setPhotoError] = useState(false); // fall back to the default icon if the Google photo URL fails to load
  const { cartCount, setSearchOpen } = useCart();
  const shopCategories = useShopCategories();
  const { user, logout } = useAuth();
  const { currency, setCurrency, currentCurrency } = useCurrency();
  const location = useLocation();
  const accountRef = useRef(null);
  const shopRef = useRef(null);

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
  useEffect(() => { setMenuOpen(false); setMobileShopOpen(false); }, [location]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Close the desktop Shop dropdown on outside click
  useEffect(() => {
    if (!shopOpen) return;
    const onClick = (e) => { if (shopRef.current && !shopRef.current.contains(e.target)) setShopOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [shopOpen]);

  // Close the mobile sidebar automatically if the viewport is resized (or
  // rotated) up past the mobile breakpoint, so it doesn't stay stuck open.
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 767) setMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isActive = (to) => location.pathname === to;
  const isShopActive = location.pathname.startsWith('/products');

  // The mobile menu panel is white and sits behind the top bar, so once it's open the bar
  // needs the same "scrolled" (white bg, dark icons/logo) treatment even if scrolled === false —
  // otherwise a white logo renders over an effectively-white background and disappears.
  const effectiveScrolled = scrolled || menuOpen;

  const iconColor = effectiveScrolled ? '#111' : '#fff';
  const barColor = iconColor;

  return (
    <>
      {/* ── NAV ── */}
      <nav
        className="zttw-nav"
        style={{
          background: effectiveScrolled ? '#fff' : 'transparent',
          borderBottom: effectiveScrolled ? '1px solid #ebebeb' : '1px solid transparent',
          boxShadow: effectiveScrolled ? '0 1px 12px rgba(0,0,0,0.06)' : 'none',
        }}
      >
        {/* LEFT */}
        <div className="zttw-nav__left">
          <div className="zttw-nav__links">
            <Link
              to="/"
              className="zttw-nav__link"
              style={{ color: iconColor, borderBottomColor: isActive('/') ? iconColor : 'transparent' }}
            >
              Home
            </Link>

            <Link
              to="/products"
              className="zttw-nav__link"
              style={{ color: iconColor, borderBottomColor: isActive('/products') ? iconColor : 'transparent' }}
            >
              {allProductsEntry.label}
            </Link>

            {/* Shop dropdown — categories only, All Products lives as its own nav link above */}
            <div ref={shopRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setShopOpen(o => !o)}
                className="zttw-nav__link"
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  font: 'inherit', display: 'flex', alignItems: 'center', gap: '5px',
                  color: iconColor,
                  borderBottomColor: (isShopActive || shopOpen) ? iconColor : 'transparent',
                }}
              >
                Shop
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                  style={{ transform: shopOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>

              {shopOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 14px)', left: 0,
                  background: '#fff', border: '1px solid #e5e5e5',
                  minWidth: '200px', zIndex: 150,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12)', padding: '8px 0',
                }}>
                  {shopCategories.map(cat => (
                    <Link key={cat.id} to={`/products?filter=${cat.id}`} onClick={() => setShopOpen(false)}
                      style={{ display: 'block', padding: '8px 18px', color: '#555', textDecoration: 'none', fontSize: '0.78rem', letterSpacing: '0.03em' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#f7f7f7'; e.currentTarget.style.color = '#000'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#555'; }}
                    >
                      {cat.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/contact"
              className="zttw-nav__link"
              style={{ color: iconColor, borderBottomColor: isActive('/contact') ? iconColor : 'transparent' }}
            >
              Contact
            </Link>
          </div>

          {/* Mobile-only logo — sits at the left edge on mobile, where the hamburger used to be.
              The desktop logo below (CENTER block) stays centered and is hidden on mobile. */}
          <Link to="/" className="zttw-nav__logo-mobile-wrap" style={{ textDecoration: 'none', alignItems: 'center' }}>
            <img
              style={{ height: '40px' }}
              src={effectiveScrolled ? '/images/vibewear-logo-black.png' : '/images/vibewear-logo-white.png'}
              alt="Vibe Wear"
              className="zttw-nav__logo"
            />
          </Link>
        </div>

        {/* CENTER: logo — white over the transparent hero, black once scrolled. Desktop only. */}
        <div className="zttw-nav__center zttw-nav__center-desktop">
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <img
              style={{height: "50px"}}
              src={effectiveScrolled ? '/images/vibewear-logo-black.png' : '/images/vibewear-logo-white.png'}
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
              <FlagIcon currency={currentCurrency} size={16} />
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
                      <FlagIcon currency={cur} size={18} />
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
                background: effectiveScrolled ? '#000' : '#fff',
                color: effectiveScrolled ? '#fff' : '#000',
                borderRadius: '50%', minWidth: '16px', height: '16px',
                fontSize: '9px', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.3s ease',
              }}>
                {cartCount}
              </span>
            )}
          </Link>

          {/* Hamburger — right edge on mobile (desktop keeps it hidden via .zttw-hamburger CSS) */}
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
      </nav>

      {/* ── MOBILE FULL-SCREEN MENU ── */}
      <div className={`zttw-mobile-menu${menuOpen ? ' zttw-mobile-menu--open' : ''}`}>
        {mobileShopOpen ? (
          /* ── SHOP sub-page — replaces the whole menu content, matching the reference layout ── */
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0.5rem 1.5rem 1.25rem',
            }}>
              <button onClick={() => setMobileShopOpen(false)} aria-label="Back"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#000', padding: '4px', display: 'flex' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#000' }}>
                Shop
              </span>
              <span style={{ width: '30px' }} />
            </div>

            <div style={{ padding: '0 1.5rem', overflowY: 'auto', flex: 1 }}>
              {shopCategories.map(cat => (
                <Link key={cat.id} to={`/products?filter=${cat.id}`} onClick={() => setMenuOpen(false)}
                  style={{ display: 'block', padding: '1rem 0', borderBottom: '1px solid #e0e0e0', color: '#333', textDecoration: 'none', fontSize: '0.9rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        ) : (
        <>
        <div style={{ padding: '0 1.5rem', flex: 1 }}>
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            style={{
              display: 'block', padding: '1rem 0', borderBottom: '1px solid #e0e0e0', textDecoration: 'none',
              color: '#333', fontSize: '0.9rem', letterSpacing: '0.06em', textTransform: 'uppercase',
            }}
          >
            Home
          </Link>

          <Link
            to="/products"
            onClick={() => setMenuOpen(false)}
            style={{
              display: 'block', padding: '1rem 0', borderBottom: '1px solid #e0e0e0', textDecoration: 'none',
              color: '#333', fontSize: '0.9rem', letterSpacing: '0.06em', textTransform: 'uppercase',
            }}
          >
            {allProductsEntry.label}
          </Link>

          {/* Shop — opens a dedicated full sub-page (see mobileShopOpen branch above) */}
          <button
            onClick={() => setMobileShopOpen(true)}
            style={{
              width: '100%', display: 'block', textAlign: 'left',
              padding: '1rem 0', borderBottom: '1px solid #e0e0e0',
              background: 'none', border: 'none', borderBottomStyle: 'solid', borderBottomWidth: '1px', borderBottomColor: '#e0e0e0',
              cursor: 'pointer',
              color: '#333', fontSize: '0.9rem', letterSpacing: '0.06em', textTransform: 'uppercase',
            }}
          >
            Shop
          </button>

          <Link
            to="/contact"
            onClick={() => setMenuOpen(false)}
            style={{
              display: 'block', padding: '1rem 0', borderBottom: '1px solid #e0e0e0', textDecoration: 'none',
              color: '#333', fontSize: '0.9rem', letterSpacing: '0.06em', textTransform: 'uppercase',
            }}
          >
            Contact
          </Link>
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
              <FlagIcon currency={cur} size={14} /> {cur.code}
            </button>
          ))}
        </div>
        </>
        )}
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

        /* Mobile-only logo (left edge) — hidden on desktop, shown in the mobile media query below */
        .zttw-nav__logo-mobile-wrap { display: none; }

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

          /* Logo left, hamburger right on mobile */
          .zttw-nav__logo-mobile-wrap { display: flex; }
          .zttw-nav__center-desktop { display: none; }
        }
      `}</style>
    </>
  );
}