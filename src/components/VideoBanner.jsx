// Full-width autoplay video banner. No overlay text, no button — just the video,
// muted/looped/playsInline so it autoplays on mobile too.
// Set `videoSrc` to a real path (e.g. '/videos/zero-to-the-world.mp4') once you have
// the file in /public/videos/. Leave null to show a placeholder box.
export default function VideoBanner({ videoSrc = null, poster = null, dark = false }) {
  return (
    <section style={{ background: dark ? '#000' : '#fff', padding: '0' }}>
      <div style={{ width: '100%', aspectRatio: '16/7', overflow: 'hidden', background: '#111' }}>
        {videoSrc ? (
          <video
            src={videoSrc}
            poster={poster || undefined}
            autoPlay
            muted
            loop
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px',
            background: 'repeating-linear-gradient(45deg, #1a1a1a, #1a1a1a 10px, #222 10px, #222 20px)',
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5">
              <rect x="2" y="5" width="15" height="14" rx="2"/>
              <path d="m17 10 5-3v10l-5-3"/>
            </svg>
            <span style={{ fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#666', fontWeight: 600 }}>
              Add Video
            </span>
          </div>
        )}
      </div>
    </section>
  );
}