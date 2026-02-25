import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-brand-bg border-t border-white/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <div className="text-2xl font-black text-brand-cream mb-3 tracking-wider">VIBE WEAR</div>
            <p className="text-brand-muted text-sm leading-relaxed mb-5">
              Street premium clothing for those who move with intention. New drops. Real wave. No noise.
            </p>
            <div className="flex gap-3">
              {[
                { name: 'Instagram', href: 'https://instagram.com/vibewear_', icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg> },
                 
              ].map(s => (
                <a key={s.name} href={s.href} target="_blank" rel="noreferrer" aria-label={s.name}
                  className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-brand-muted hover:text-brand-cream hover:border-white/50 transition-all duration-200">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-brand-cream text-xs font-semibold uppercase tracking-widest mb-4">Shop</h4>
            <ul className="space-y-2.5">
              {["New Arrivals", "Graphic Tees", "Bottoms", "Outerwear", "Bundles", "Sale"].map(item => (
                <li key={item}><Link to="/products" className="text-brand-muted text-sm hover:text-brand-cream transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-brand-cream text-xs font-semibold uppercase tracking-widest mb-4">Company</h4>
            <ul className="space-y-2.5">
              {[{ label: 'About Us', path: '/about' }, { label: 'Contact', path: '/contact' }, { label: 'Find a Store', path: '/find-store' }, { label: 'The Wave', path: '/about' }, { label: 'Collabs', path: '/about' }].map(item => (
                <li key={item.label}><Link to={item.path} className="text-brand-muted text-sm hover:text-brand-cream transition-colors">{item.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-brand-cream text-xs font-semibold uppercase tracking-widest mb-4">Support</h4>
            <ul className="space-y-2.5 mb-6">
              {["FAQ", "Shipping & Returns", "Size Guide", "Track Order", "Gift Cards"].map(item => (
                <li key={item}><a href="#" className="text-brand-muted text-sm hover:text-brand-cream transition-colors">{item}</a></li>
              ))}
            </ul>
            <h4 className="text-brand-cream text-xs font-semibold uppercase tracking-widest mb-3">Newsletter</h4>
            <div className="flex">
              <input type="email" placeholder="Your email" className="flex-1 bg-white/5 border border-white/12 text-brand-cream placeholder:text-brand-muted text-sm px-3 py-2 rounded-l-lg focus:outline-none" />
              <button className="bg-white text-black px-4 py-2 text-sm font-bold rounded-r-lg hover:opacity-90 transition-opacity">→</button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-brand-muted text-xs">© {new Date().getFullYear()} VIBE WEAR. All rights reserved.</p>
          <div className="flex gap-5">
            {['Privacy Policy', 'Terms of Service', 'Cookies'].map(item => (
              <a key={item} href="#" className="text-brand-muted text-xs hover:text-brand-cream transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
