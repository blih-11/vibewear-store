import { storeLocations } from '../data/products';

export default function FindStore() {
  return (
    <div className="bg-brand-bg min-h-screen">
      <div className="relative h-[42vh] min-h-[280px] overflow-hidden">
        <img src="https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=1400" alt="Find a Store" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-brand-bg/80" />
        <div className="absolute inset-0 flex items-center px-4 sm:px-6">
          <div className="max-w-7xl w-full mx-auto">
            <span className="text-white text-xs font-semibold uppercase tracking-widest">Locations</span>
            <h1 className="text-brand-cream text-4xl md:text-5xl font-black mt-2">Find a Store</h1>
            <p className="text-brand-cream/60 mt-2 max-w-md text-sm">Visit us in person for the full VIBE WEAR experience. Feel it, try it, wear it.</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid md:grid-cols-3 gap-5 mb-14">
          {storeLocations.map((store, i) => (
            <div key={store.id} className="bg-white/4 border border-white/8 hover:border-white/25 transition-all duration-200 rounded-2xl p-6 group">
              <div className="flex items-start justify-between mb-4">
                <span className="text-white text-2xl font-black">{String(i + 1).padStart(2, '0')}</span>
                <div className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
              </div>
              <h3 className="text-brand-cream font-bold text-base mb-3">{store.name}</h3>
              <div className="space-y-2.5 text-sm">
                <div className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 text-brand-muted mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span className="text-brand-muted text-xs">{store.address}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-brand-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  <a href={`tel:${store.phone}`} className="text-brand-muted hover:text-white transition-colors text-xs">{store.phone}</a>
                </div>
                <div className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 text-brand-muted mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span className="text-brand-muted text-xs leading-relaxed">{store.hours}</span>
                </div>
              </div>
              <a href={store.mapUrl} target="_blank" rel="noreferrer" className="mt-5 flex items-center gap-1.5 text-white text-xs font-semibold hover:gap-2.5 transition-all">
                Get Directions <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            </div>
          ))}
        </div>

        <div className="rounded-2xl overflow-hidden border border-white/8 mb-14 bg-white/4 aspect-[16/6] flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">🗺️</div>
            <p className="text-brand-muted text-sm">Interactive map coming soon</p>
            <p className="text-brand-muted text-xs mt-1">Use "Get Directions" above for navigation</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: '✦', title: 'Personal Styling', desc: 'Book a one-on-one session with our in-store team for a tailored shopping experience.' },
            { icon: '◈', title: 'Try Before You Buy', desc: 'Feel the fabrics, try the fit, live in the piece for a minute before you commit.' },
            { icon: '◇', title: 'In-Store Exclusives', desc: 'Store-only drops and early access to new collections for walk-in shoppers.' },
          ].map(item => (
            <div key={item.title} className="text-center p-6 bg-white/4 rounded-2xl border border-white/8">
              <div className="text-white text-2xl mb-3">{item.icon}</div>
              <h3 className="text-brand-cream font-bold mb-2">{item.title}</h3>
              <p className="text-brand-muted text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
