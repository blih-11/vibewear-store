import { useEffect, useRef } from 'react';

// Instagram's embed.js is loaded once globally and reused for every embed on the page.
let scriptPromise = null;
function loadInstagramScript() {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.instgrm) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve) => {
    const existing = document.querySelector('script[src="https://www.instagram.com/embed.js"]');
    if (existing) { existing.addEventListener('load', resolve); return; }
    const script = document.createElement('script');
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    script.onload = resolve;
    document.body.appendChild(script);
  });
  return scriptPromise;
}

export default function InstagramEmbed({ url }) {
  const ref = useRef(null);

  useEffect(() => {
    let cancelled = false;
    loadInstagramScript().then(() => {
      if (!cancelled && window.instgrm?.Embeds) {
        window.instgrm.Embeds.process();
      }
    });
    return () => { cancelled = true; };
  }, [url]);

  return (
    <div ref={ref} style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={url}
        data-instgrm-version="14"
        style={{
          background: '#FFF',
          border: 0,
          borderRadius: '3px',
          boxShadow: 'none',
          margin: '0 auto',
          maxWidth: '400px',
          minWidth: '280px',
          width: '100%',
        }}
      >
        <a href={url} target="_blank" rel="noreferrer">View this post on Instagram</a>
      </blockquote>
    </div>
  );
}
