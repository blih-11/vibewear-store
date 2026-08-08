export default {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#ffffff',
          surface: '#f8f8f8',
          cream: '#000000',
          accent: '#000000',
          accent2: '#333333',
          muted: '#888888',
          text: '#000000',
          textMuted: '#888888',
        }
      },
      fontFamily: { sans: ['"Outfit"', 'sans-serif'] },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'marquee': 'marquee 25s linear infinite',
        'spin': 'spin 0.8s linear infinite',
      },
      keyframes: {
        slideUp: { '0%': { transform: 'translateY(16px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        spin: { to: { transform: 'rotate(360deg)' } },
      }
    },
  },
  plugins: [],
}
