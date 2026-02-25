import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function HeroSlider({ slides }) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % slides.length);
        setAnimating(false);
      }, 400);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[current];

  return (
    <section style={{
      position: 'relative',
      height: '100vh',
      minHeight: '600px',
      overflow: 'hidden',
      background: '#000',
    }}>
      {/* Background image */}
      <div style={{
        position: 'absolute', inset: 0,
        transition: 'opacity 0.4s ease',
        opacity: animating ? 0 : 1,
      }}>
        <img
          src={slide.image}
          alt=""
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
            opacity: 0.55,
          }}
        />
      </div>

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to right, rgba(0,0,0,0.85) 40%, transparent 80%), linear-gradient(to top, rgba(0,0,0,0.6) 20%, transparent 60%)',
      }} />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 2,
        height: '100%',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: '4rem 3rem 5rem',
        maxWidth: '900px',
      }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          color: '#888',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          marginBottom: '1.25rem',
          opacity: animating ? 0 : 1,
          transition: 'opacity 0.3s ease 0.1s',
        }}>
          — {slide.badge}
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(5rem, 10vw, 200px)',
          lineHeight: 0.88,
          color: '#fff',
          whiteSpace: 'pre-line',
          letterSpacing: '0.02em',
          opacity: animating ? 0 : 1,
          transform: animating ? 'translateY(16px)' : 'translateY(0)',
          transition: 'all 0.4s ease 0.15s',
          marginBottom: '1.5rem',
        }}>
          {slide.title}
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.95rem',
          color: '#999',
          maxWidth: '380px',
          lineHeight: 1.6,
          marginBottom: '2.5rem',
          opacity: animating ? 0 : 1,
          transition: 'opacity 0.3s ease 0.25s',
        }}>
          {slide.subtitle}
        </p>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', opacity: animating ? 0 : 1, transition: 'opacity 0.3s ease 0.3s' }}>
          <Link to="/products" className="btn-primary">{slide.cta} →</Link>
        </div>
      </div>

      {/* Slide indicators */}
      <div style={{
        position: 'absolute', bottom: '2.5rem', right: '3rem', zIndex: 2,
        display: 'flex', gap: '0.5rem', alignItems: 'center',
      }}>
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => { setAnimating(true); setTimeout(() => { setCurrent(i); setAnimating(false); }, 300); }}
            style={{
              width: i === current ? '2rem' : '0.35rem',
              height: '0.35rem',
              borderRadius: '99px',
              background: i === current ? '#fff' : '#444',
              border: 'none', cursor: 'pointer',
              transition: 'all 0.3s ease',
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div style={{
        position: 'absolute', top: '50%', right: '2rem', zIndex: 2,
        fontFamily: 'var(--font-mono)',
        fontSize: '0.6rem',
        color: '#555',
        letterSpacing: '0.1em',
        transform: 'translateY(-50%) rotate(90deg)',
      }}>
        {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </div>

      {/* Marquee ticker */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 3,
        background: 'rgba(0,0,0,0.8)',
        borderTop: '1px solid #1a1a1a',
        padding: '0.6rem 0',
        overflow: 'hidden',
      }}>
        <div className="animate-marquee" style={{ display: 'flex', gap: '3rem', width: 'max-content' }}>
          {[...Array(6)].map((_, i) => (
            <span key={i} style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              color: '#444',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}>
              VIBE WEAR ✦ WE THE WAVE ✦ @vibewear_ ✦ NEW DROP ✦ STREET PREMIUM ✦
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
