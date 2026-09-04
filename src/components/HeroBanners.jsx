// Hero slider — crossfades between multiple full-bleed images with autoplay + dot nav.
import { useEffect, useRef, useState } from 'react';

const slides = [
  { id: 'slide-2', image: '/images/store-interior-1.jpg' },
  { id: 'slide-3', image: '/images/store-interior-2.jpg' },
];

const AUTOPLAY_MS = 5500;

export default function HeroBanners() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  const startAutoplay = () => {
    clearInterval(timerRef.current);
    if (slides.length <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, AUTOPLAY_MS);
  };

  const goTo = (i) => {
    setCurrent(i);
    startAutoplay(); // manual pick resets the autoplay clock
  };

  useEffect(() => {
    startAutoplay();
    return () => clearInterval(timerRef.current);
  }, []);

  return (
    <section className="hero-dual">
      <div className="hero-dual__panel">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            data-slide={slide.id}
            className="hero-dual__bg"
            style={{ backgroundImage: `url(${slide.image})`, opacity: i === current ? 1 : 0 }}
          />
        ))}

        <div className="hero-dual__overlay" />

        <div className="hero-dual__content">
          <p className="hero-dual__tag"></p>
          <a href="/products" className="hero-dual__cta">Shop Now</a>
        </div>

        {slides.length > 1 && (
          <div className="hero-dual__dots">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Slide ${i + 1}`}
                className={`hero-dual__dot${i === current ? ' hero-dual__dot--active' : ''}`}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .hero-dual {
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        .hero-dual__panel {
          position: relative;
          width: 100%;
          height: 100vh;
          min-height: 100vh;
          overflow: hidden;
        }

        .hero-dual__bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center top;
          background-repeat: no-repeat;
          transition: opacity 0.9s ease;
        }

        .hero-dual__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.04) 35%, rgba(0,0,0,0) 60%);
          pointer-events: none;
        }

        .hero-dual__content {
          position: absolute;
          left: 50%;
          bottom: 4rem;
          transform: translateX(-50%);
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.5rem;
          white-space: nowrap;
        }

        .hero-dual__tag {
          color: #000;
          font-size: 0.85rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin: 0;
        }

        .hero-dual__cta {
          display: inline-block;
          color: #fff;
          font-size: 1.2rem;
          text-decoration: none;
          border-bottom: 1.5px solid currentColor;
          padding-bottom: 2px;
          transition: opacity 0.2s;
        }
        .hero-dual__cta:hover { opacity: 0.65; }

        .hero-dual__dots {
          position: absolute;
          bottom: 1.4rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          align-items: center;
          z-index: 3;
        }

        .hero-dual__dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: 1.5px solid rgba(0,0,0,0.55);
          background: transparent;
          padding: 0;
          cursor: pointer;
          transition: all 0.22s ease;
        }

        .hero-dual__dot--active {
          background: #000;
          border-color: #000;
        }

        /* Small screens only — shorter than full viewport height so the New Arrivals
           section below is visible without scrolling. vh measures the LARGE mobile
           viewport (as if the browser toolbar were hidden), which is taller than what's
           actually visible when the toolbar is showing — svh accounts for the toolbar;
           the plain vh line is just a fallback for browsers that don't support svh yet. */
        @media (max-width: 640px) {
          .hero-dual__panel {
            height: 50vh;
            height: 50svh;
            min-height: 50vh;
            min-height: 50svh;
          }
          .hero-dual__content { bottom: 2.6rem; }
          .hero-dual__cta { font-size: 1.0rem; }
          .hero-dual__dots { bottom: 1rem; }
        }

        /* Tablet + desktop: shorter, capped height instead of full 100vh. Horizontal
           centering of .hero-dual__content is handled once, above, via
           left: 50% / translateX(-50%) — identical at every screen width, so no
           breakpoint-specific centering rules are needed here. */
        @media (min-width: 641px) {
          .hero-dual__panel {
            height: 100vh;
            min-height: unset;
            max-height: 760px;
          }

          /* store-interior-1.jpg and store-interior-2.jpg are near-square photos.
             On a wide/short desktop hero, "cover" + "center top" crops out most of
             the image height, leaving only the ceiling visible. Shifting the crop
             window down here brings the racks/floor into view instead. */
          .hero-dual__bg[data-slide="slide-2"],
          .hero-dual__bg[data-slide="slide-3"] {
            background-position: center 62%;
          }
        }
      `}</style>
    </section>
  );
}