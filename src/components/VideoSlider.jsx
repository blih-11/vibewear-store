import { useState, useEffect, useRef } from 'react';

const videos = [
  '/videos/vibe_1.mp4',
  '/videos/vibe_2.mp4',
  '/videos/vibe_3.mp4',
  '/videos/vibe_4.mp4',
  '/videos/vibe_5.mp4',
];

export default function VideoSlider() {
  const [current, setCurrent] = useState(0);
  const videoRef = useRef(null);
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;
    if (visible) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [visible, current]);

  const handleEnded = () => {
    setCurrent(prev => (prev + 1) % videos.length);
  };

  const goTo = (i) => {
    setCurrent(i);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      if (visible) videoRef.current.play().catch(() => {});
    }
  };

  return (
    <section ref={sectionRef} style={{ position: 'relative', background: '#000', width: '100%', overflow: 'hidden' }}>
      {/* Full-width video */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', maxHeight: '100vh', minHeight: '300px' }}>
        <video
          ref={videoRef}
          key={current}
          src={videos[current]}
          muted
          playsInline
          autoPlay
          loop={false}
          onEnded={handleEnded}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        {/* Bottom gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 40%)',
          pointerEvents: 'none',
        }} />

        {/* Navigation dots at bottom */}
        <div style={{
          position: 'absolute', bottom: '1.5rem', left: 0, right: 0,
          display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center',
          zIndex: 2,
        }}>
          {videos.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                width: i === current ? '2rem' : '0.4rem',
                height: '0.4rem',
                borderRadius: '99px',
                background: i === current ? '#fff' : 'rgba(255,255,255,0.3)',
                border: 'none', cursor: 'pointer',
                transition: 'all 0.3s ease', padding: 0,
              }}
            />
          ))}
        </div>

        {/* Prev / Next arrows */}
        <button
          onClick={() => goTo((current - 1 + videos.length) % videos.length)}
          style={{
            position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)',
            color: '#fff', cursor: 'pointer', width: '40px', height: '40px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '50%', zIndex: 2,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <button
          onClick={() => goTo((current + 1) % videos.length)}
          style={{
            position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.15)',
            color: '#fff', cursor: 'pointer', width: '40px', height: '40px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: '50%', zIndex: 2,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>
    </section>
  );
}
