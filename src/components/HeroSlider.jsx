import { useState, useEffect, useRef } from 'react';

const slides = [
  {
    id: 'slide-1',
    image: '/images/hero1.jpg',
    layout: 'split-cascade',
    tag: 'New Drops',
    title: ['Every', 'Vibe Wear', 'piece is a', 'Statement'],
    cta: 'Shop now',
    link: '/products',
  },
  {
    id: 'slide-2',
    image: '/images/hero2.jpg',
    layout: 'split-cascade',
    tag: 'Vibe Wear',
    title: ['Built', 'for those', 'who dress', 'with intention'],
    cta: 'Explore ',
    link: '/products',
  },
  {
    id: 'slide-3',
    image: '/images/hero3.jpg',
    layout: 'split-cascade',
    tag: ' VIBE WEAR Way',
    title: ['New  ', 'season drops', 'Real Drops,', 'Real Drip'],
    cta: 'Shop now',
    link: '/products',
  },
];

function SplitCascadeLayout({ slide, fading }) {
  const sizes = ['3.2rem', '2.4rem', '1.6rem', '1.1rem'];
  const weights = ['800', '700', '600', '500'];

  return (
    <div
      className={`zttw-hero__content zttw-hero__content--split zttw-${slide.id}`}
      style={{ opacity: fading ? 0 : 1 }}
    >
      {/* Left — tag + cta */}
      <div className="zttw-split__left">
        <p className="zttw-hero__tag">{slide.tag}</p>
        <a href={slide.link} className="zttw-hero__cta">{slide.cta}</a>
      </div>

      {/* Right — cascading title lines */}
      <div className="zttw-split__right">
        {slide.title.map((line, i) => (
          <p
            key={i}
            className="zttw-cascade__line"
            style={{
              fontSize: sizes[i],
              fontWeight: weights[i],
            }}
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);
  const timerRef = useRef(null);

  const goTo = (idx) => {
    setFading(true);
    setTimeout(() => {
      setCurrent(idx);
      setFading(false);
    }, 400);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % slides.length);
        setFading(false);
      }, 400);
    }, 5500);
    return () => clearInterval(timerRef.current);
  }, []);

  const slide = slides[current];

  return (
    <section className="zttw-hero">
      <div
        className="zttw-hero__bg"
        style={{
          backgroundImage: `url(${slide.image})`,
          opacity: fading ? 0 : 1,
        }}
      />

      <div className="zttw-hero__overlay" />

      <SplitCascadeLayout slide={slide} fading={fading} />

      <div className="zttw-hero__dots">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => { clearInterval(timerRef.current); goTo(i); }}
            aria-label={`Slide ${i + 1}`}
            className={`zttw-dot${i === current ? ' zttw-dot--active' : ''}`}
          />
        ))}
      </div>

      <style>{`
        .zttw-hero {
          position: relative;
          width: 100%;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .zttw-hero {
            height: 60vh;
            min-height: 400px;
          }
        }

        @media (min-width: 769px) {
          .zttw-hero {
            height: 100vh;
            max-height: 700px;
          }
        }

        .zttw-hero__bg {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center top;
          background-repeat: no-repeat;
          transition: opacity 0.4s ease;
        }

        .zttw-hero__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0,0,0,0.28) 0%,
            rgba(0,0,0,0.04) 35%,
            rgba(0,0,0,0) 60%
          );
          pointer-events: none;
        }

        .zttw-hero__content {
          position: absolute;
          top: 50%;
          left: 6%;
          transform: translateY(-50%);
          z-index: 2;
          max-width: 50%;
          transition: opacity 0.4s ease;
        }

        /* Split layout — shared base */
        .zttw-hero__content--split {
          left: 0;
          right: 0;
          max-width: 100%;
          padding: 0 6%;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 1rem;
          box-sizing: border-box;
        }

        /* ── Shared left/right base (no margin/gap here) ── */
        .zttw-split__left {
          display: flex;
          flex-direction: column;
          padding-bottom: 0.4rem;
          flex-shrink: 0;
          white-space: nowrap;
        }

        .zttw-split__right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          text-align: right;
          gap: 5px;
          flex-shrink: 1;
        }

        /* ── Slide 1 — edit freely ── */
        .zttw-slide-1 .zttw-split__left {
          gap: 2.9rem;
          margin-top: 0px;
        }
        .zttw-slide-1 .zttw-split__right {
          margin-top: 50px;
          margin-left: 95px;
           
        }

        /* ── Slide 2 — edit freely ── */
        .zttw-slide-2 .zttw-split__left {
          gap: 2.9rem;
          margin-top: 0px;
         
        }
        .zttw-slide-2 .zttw-split__right {
          margin-top: 80px;
          margin-left: 95px;
          
        }

        /* ── Slide 3 — edit freely ── */
        .zttw-slide-3 .zttw-split__left {
          gap: 2.9rem;
          margin-top: 0px;
        }
        .zttw-slide-3 .zttw-split__right {
          margin-top: 50px;
          margin-left: 95px;
        }

        .zttw-cascade__line {
          margin: 0;
          line-height: 1.15;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          white-space: nowrap;
        }

        .zttw-hero__tag {
          font-size: 0.9rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin: 0;
          white-space: nowrap;
        }

        .zttw-hero__cta {
          display: inline-block;
          font-size: 0.85rem;
          text-decoration: none;
          border-bottom: 1.5px solid currentColor;
          padding-bottom: 2px;
          transition: opacity 0.2s;
          white-space: nowrap;
        }

        .zttw-hero__cta:hover {
          opacity: 0.6;
        }

        /* ── Slide 1 mobile ── */
@media (max-width: 480px) {
  .zttw-slide-1 .zttw-hero__content {
    max-width: 65%;
  }
  .zttw-slide-1 .zttw-cascade__line:nth-child(1) { font-size: 2.4rem !important; }
  .zttw-slide-1 .zttw-cascade__line:nth-child(2) { font-size: 1.4rem !important; }
  .zttw-slide-1 .zttw-cascade__line:nth-child(3) { font-size: 1.2rem !important; }
  .zttw-slide-1 .zttw-cascade__line:nth-child(4) { font-size: 0.8rem !important; }
}

/* ── Slide 2 mobile — edit freely ── */
@media (max-width: 480px) {
  .zttw-slide-2 .zttw-split__left { gap: 2rem; }
  .zttw-slide-2 .zttw-split__right { margin-top: -20px; margin-left: 0px; }
  .zttw-slide-2 .zttw-cascade__line:nth-child(1) { font-size: 2.4rem !important; }
  .zttw-slide-2 .zttw-cascade__line:nth-child(2) { font-size: 1.4rem !important; }
  .zttw-slide-2 .zttw-cascade__line:nth-child(3) { font-size: 1.2rem !important; }
  .zttw-slide-2 .zttw-cascade__line:nth-child(4) { font-size: 0.8rem !important; }
}

/* ── Slide 3 mobile — edit freely ── */
@media (max-width: 480px) {
  .zttw-slide-3 .zttw-split__left { gap: 2rem; }
  .zttw-slide-3 .zttw-split__right { margin-top: 0px; margin-left: 0px; }
  .zttw-slide-3 .zttw-cascade__line:nth-child(1) { font-size: 2.4rem !important; }
  .zttw-slide-3 .zttw-cascade__line:nth-child(2) { font-size: 1.4rem !important; }
  .zttw-slide-3 .zttw-cascade__line:nth-child(3) { font-size: 1.2rem !important; }
  .zttw-slide-3 .zttw-cascade__line:nth-child(4) { font-size: 0.8rem !important; }
}

        .zttw-hero__dots {
          position: absolute;
          bottom: 1.5rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          align-items: center;
          z-index: 3;
        }

        .zttw-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: 1.5px solid rgba(255,255,255,0.7);
          background: transparent;
          padding: 0;
          cursor: pointer;
          transition: all 0.22s ease;
        }

        .zttw-dot--active {
          background: #fff;
          border-color: #fff;
        }
      `}</style>
    </section>
  );
}