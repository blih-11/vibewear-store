import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SLIDES = [
  { img: '/images/products/img_1.jpg',  label: 'WAVE FIT',   sub: 'VOL. ONE' },
  { img: '/images/products/img_22.jpg', label: 'STREET',     sub: 'PREMIUM' },
  { img: '/images/products/img_47.jpg', label: 'NEW DROP',   sub: 'SS 2025' },
  { img: '/images/products/img_9.jpg',  label: 'THE WAVE',   sub: 'SEASON 4' },
];

export default function HeroAnimation() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);
  const textRef = useRef(null);
  const [active, setActive] = useState(0);
  const [glitching, setGlitching] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const rafRef = useRef(null);
  const cursorPos = useRef({ x: 0, y: 0 });
  const targetPos = useRef({ x: 0, y: 0 });

  // Entrance animation
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      triggerSlideChange((active + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [active]);

  const triggerSlideChange = (next) => {
    setGlitching(true);
    setTimeout(() => {
      setActive(next);
      setGlitching(false);
    }, 400);
  };

  // Smooth magnetic cursor
  useEffect(() => {
    const animate = () => {
      cursorPos.current.x += (targetPos.current.x - cursorPos.current.x) * 0.12;
      cursorPos.current.y += (targetPos.current.y - cursorPos.current.y) * 0.12;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cursorPos.current.x - 24}px, ${cursorPos.current.y - 24}px)`;
      }
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate(${targetPos.current.x - 3}px, ${targetPos.current.y - 3}px)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handleMouseMove = (e) => {
    targetPos.current = { x: e.clientX, y: e.clientY };
    // Parallax on text
    if (textRef.current && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width - 0.5;
      const cy = (e.clientY - rect.top) / rect.height - 0.5;
      textRef.current.style.transform = `translate(${cx * -18}px, ${cy * -12}px)`;
    }
  };

  const slide = SLIDES[active];

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => { setIsHovering(false); if (textRef.current) textRef.current.style.transform = 'translate(0,0)'; }}
      style={{
        position: 'relative',
        height: '100vh',
        minHeight: 640,
        overflow: 'hidden',
        background: '#000',
        cursor: 'none',
      }}
    >
      {/* Custom cursor */}
      <div ref={cursorRef} style={{
        position: 'fixed', top: 0, left: 0, zIndex: 9999, pointerEvents: 'none',
        width: 48, height: 48,
        border: '1.5px solid rgba(255,255,255,0.8)',
        borderRadius: '50%',
        transition: 'width 0.3s, height 0.3s, border-color 0.3s, background 0.3s',
        mixBlendMode: 'difference',
        background: isHovering ? 'rgba(255,255,255,0.08)' : 'transparent',
      }} />
      <div ref={cursorDotRef} style={{
        position: 'fixed', top: 0, left: 0, zIndex: 9999, pointerEvents: 'none',
        width: 6, height: 6, borderRadius: '50%', background: '#fff',
        mixBlendMode: 'difference',
      }} />

      {/* Background images — crossfade */}
      {SLIDES.map((s, i) => (
        <div key={i} style={{
          position: 'absolute', inset: 0,
          opacity: i === active ? 1 : 0,
          transition: 'opacity 0.9s cubic-bezier(0.4,0,0.2,1)',
          transform: i === active ? 'scale(1.04)' : 'scale(1)',
          transitionProperty: 'opacity, transform',
          transitionDuration: '0.9s, 6s',
        }}>
          <img src={s.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
        </div>
      ))}

      {/* Dark overlay — gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.85) 100%)',
        zIndex: 1,
      }} />

      {/* Noise texture overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', opacity: 0.04,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '200px',
      }} />

      {/* Scan line */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none',
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
      }} />

      {/* Main content */}
      <div ref={textRef} style={{
        position: 'absolute', inset: 0, zIndex: 10,
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: 'clamp(2rem, 5vw, 5rem)',
        paddingBottom: 'clamp(4rem, 8vw, 8rem)',
        transition: 'transform 0.1s linear',
      }}>
        {/* Top bar */}
        <div style={{
          position: 'absolute', top: 'clamp(5rem, 10vh, 7rem)', left: 'clamp(2rem, 5vw, 5rem)', right: 'clamp(2rem, 5vw, 5rem)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'translateY(0)' : 'translateY(-20px)',
          transition: 'all 1s cubic-bezier(0.4,0,0.2,1) 0.2s',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 1, background: 'rgba(255,255,255,0.5)' }} />
            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.6rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
              {String(active + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
            </span>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.6rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            WE THE WAVE ✦ SS25
          </span>
        </div>

        {/* Hero text */}
        <div style={{ overflow: 'hidden', marginBottom: '1.5rem' }}>
          <div style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'translateY(0)' : 'translateY(60px)',
            transition: 'all 1s cubic-bezier(0.16,1,0.3,1) 0.3s',
          }}>
            <p style={{
              color: 'rgba(255,255,255,0.45)',
              fontSize: '0.65rem',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              marginBottom: '0.75rem',
            }}>
              {slide.sub}
            </p>
          </div>
        </div>

        {/* Giant glitch title */}
        <div style={{ overflow: 'hidden', marginBottom: '2rem' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(4rem, 14vw, 13rem)',
            fontWeight: 900,
            color: '#fff',
            letterSpacing: '-0.02em',
            lineHeight: 0.88,
            margin: 0,
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'translateY(0)' : 'translateY(80px)',
            transition: 'all 1.1s cubic-bezier(0.16,1,0.3,1) 0.1s',
            position: 'relative',
            // Glitch effect
            animation: glitching ? 'glitch 0.4s steps(2) forwards' : 'none',
          }}>
            {slide.label}
            {/* Glitch layers */}
            {glitching && <>
              <span style={{
                position: 'absolute', top: 0, left: 0,
                color: '#ff0040', clipPath: 'inset(20% 0 60% 0)',
                transform: 'translateX(-4px)',
                opacity: 0.8, userSelect: 'none',
              }}>{slide.label}</span>
              <span style={{
                position: 'absolute', top: 0, left: 0,
                color: '#00ffff', clipPath: 'inset(60% 0 20% 0)',
                transform: 'translateX(4px)',
                opacity: 0.8, userSelect: 'none',
              }}>{slide.label}</span>
            </>}
          </h1>
        </div>

        {/* Bottom row */}
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem',
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 1s cubic-bezier(0.16,1,0.3,1) 0.6s',
        }}>
          {/* CTA */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              onClick={() => navigate('/products')}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#fff';
                e.currentTarget.style.color = '#000';
                e.currentTarget.style.transform = 'scale(1.04)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.transform = 'scale(1)';
              }}
              style={{
                background: 'transparent',
                border: '1.5px solid rgba(255,255,255,0.8)',
                color: '#fff',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                padding: '14px 32px',
                cursor: 'none',
                transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
              }}
            >
              Shop Now
            </button>
            <button
              onClick={() => navigate('/about')}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.gap = '14px'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.gap = '8px'; }}
              style={{
                background: 'none', border: 'none', cursor: 'none',
                color: 'rgba(255,255,255,0.5)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem', letterSpacing: '0.18em',
                textTransform: 'uppercase',
                display: 'flex', alignItems: 'center', gap: '8px',
                transition: 'all 0.25s',
              }}
            >
              Our Story <span style={{ fontSize: '1rem' }}>→</span>
            </button>
          </div>

          {/* Slide indicators */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => triggerSlideChange(i)}
                style={{
                  background: 'none', border: 'none', cursor: 'none', padding: '4px',
                }}
              >
                <div style={{
                  width: i === active ? 28 : 6,
                  height: 2,
                  background: i === active ? '#fff' : 'rgba(255,255,255,0.3)',
                  transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
                  borderRadius: 1,
                }} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)',
        zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        opacity: loaded ? 0.4 : 0,
        transition: 'opacity 1s 1.2s',
      }}>
        <span style={{ color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.3em', textTransform: 'uppercase' }}>Scroll</span>
        <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, #fff, transparent)', animation: 'scrollPulse 2s ease-in-out infinite' }} />
      </div>

      {/* Vertical side text */}
      <div style={{
        position: 'absolute', right: 'clamp(1rem, 3vw, 2.5rem)', top: '50%', transform: 'translateY(-50%) rotate(90deg)',
        zIndex: 10,
        opacity: loaded ? 0.25 : 0,
        transition: 'opacity 1s 1s',
      }}>
        <span style={{ color: '#fff', fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.4em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
          VIBE WEAR ✦ GHANA ✦ 2021
        </span>
      </div>

      <style>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.4; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.15); }
        }
        @keyframes glitch {
          0%   { transform: translateX(0) skewX(0deg); }
          20%  { transform: translateX(-3px) skewX(-1deg); }
          40%  { transform: translateX(3px) skewX(1deg); }
          60%  { transform: translateX(-2px) skewX(0deg); }
          80%  { transform: translateX(2px) skewX(-0.5deg); }
          100% { transform: translateX(0) skewX(0deg); }
        }
      `}</style>
    </section>
  );
}
