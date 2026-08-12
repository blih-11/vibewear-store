export default function PageLoader() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <img
        src="/images/vibewear-logo-black.png"
        alt="Loading"
        style={{ height: '46px', width: 'auto', animation: 'vw-pulse 1.3s ease-in-out infinite' }}
      />
      <style>{`
        @keyframes vw-pulse {
          0%, 100% { opacity: 0.35; transform: scale(0.96); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
