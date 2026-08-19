// Single full-bleed hero panel — reuses the ORIGINAL slider's look (tag + underlined CTA on
// one side, cascading title lines on the other) but as one static image instead of a rotating
// 3-slide carousel. Full-bleed (100vh) on mobile; full-width on desktop.

const panel = {
  image: '/images/store6.png',
  tag: '',
  title: [ ],
  cta: 'Shop Now',
  link: '/products',
};

function HeroPanel({ image, tag, title, cta, link }) {
  const sizes = ['clamp(2rem, 6vw, 3.2rem)', 'clamp(1.5rem, 4.4vw, 2.4rem)', 'clamp(1.1rem, 3vw, 1.6rem)', 'clamp(0.85rem, 2vw, 1.1rem)'];
  const weights = ['800', '700', '600', '500'];

  return (
    <div className="hero-dual__panel" style={{ backgroundImage: `url(${image})` }}>
      <div className="hero-dual__overlay" />
      <div className="hero-dual__content">
        <div className="hero-dual__left">
          <p className="hero-dual__tag">{tag}</p>
          <a href={link} className="hero-dual__cta">{cta}</a>
        </div>
        <div className="hero-dual__right">
          {title.map((line, i) => (
            <p key={i} className="hero-dual__line" style={{ fontSize: sizes[i], fontWeight: weights[i] }}>{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HeroBanners() {
  return (
    <section className="hero-dual">
      <HeroPanel {...panel} />

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
          background-size: cover;
          background-position: center top;
          background-repeat: no-repeat;
          overflow: hidden;
        }

        .hero-dual__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.04) 35%, rgba(0,0,0,0) 60%);
          pointer-events: none;
        }

        .hero-dual__content {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          transform: translateY(-50%);
          z-index: 2;
          padding: 0 7%;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 1rem;
          box-sizing: border-box;
        }

        .hero-dual__left {
          display: flex;
          flex-direction: column;
          gap: 2.2rem;
          flex-shrink: 0;
          padding-bottom: 0.4rem;
        }

        .hero-dual__right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          text-align: right;
          gap: 4px;
          flex-shrink: 1;
        }

        .hero-dual__tag {
          color: #000;
          font-size: 0.85rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin: 0;
          white-space: nowrap;
        }

        .hero-dual__cta {
          display: inline-block;
          color: #000;
          margin-top: 500px;
          font-size: 1.2rem;
          text-decoration: none;
          border-bottom: 1.5px solid currentColor;
          padding-bottom: 2px;
          white-space: nowrap;
          transition: opacity 0.2s;
        }
        .hero-dual__cta:hover { opacity: 0.65; }

        .hero-dual__line {
          margin: 0;
          line-height: 1.15;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          color: #000;
        }

        /* Small screens — CTA pinned to a fixed spot over the image */
        @media (max-width: 899px) {
          .hero-dual__cta {
            font-size: 1.0rem;
            margin-left: 120px;
            margin-top: 290px;
          }
        }

        /* Desktop: shorter, capped height instead of full 100vh */
        @media (min-width: 900px) {
          .hero-dual__panel {
            height: 100vh;
            min-height: unset;
            max-height: 760px;
          }

          /* CTA centered at the bottom of the panel */
          .hero-dual__content {
            justify-content: center;
          }
          .hero-dual__left {
            align-items: center;
          }
        }
      `}</style>
    </section>
  );
}