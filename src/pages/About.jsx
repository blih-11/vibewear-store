export default function About() {
  const values = [
    { icon: '✦', title: 'Bold by Design', desc: 'Every piece is crafted with intention. We believe clothing should be a statement — a visual language that speaks before you do.' },
    { icon: '◈', title: 'Quality First', desc: 'Heavy cotton, premium fabrics, and zero shortcuts. We build pieces that last and age with you.' },
    { icon: '❋', title: 'Street Authentic', desc: "Born on the block, not in a boardroom. Every drop is rooted in real culture, real vibes, real people." },
    { icon: '◇', title: 'For The Wave', desc: 'VIBE WEAR is for everyone who moves with confidence. Our silhouettes are designed for those who lead, not follow.' },
  ];

  // const team = [
  //   { name: 'Wave Director', role: 'Founder & Creative Director', img: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400' },
  //   { name: 'Brand Architect', role: 'Head of Design', img: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400' },
  //   { name: 'Culture Lead', role: 'Brand Director', img: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400' },
  // ];

  return (
    <div className="bg-brand-bg min-h-screen">
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[320px] overflow-hidden">
        <img src="https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=1400" alt="About VIBE WEAR" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-brand-bg/80" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div>
            <span className="text-white/50 text-xs font-semibold uppercase tracking-widest">Our Story</span>
            <h1 className="text-brand-cream text-5xl md:text-6xl font-black mt-3">VIBE WEAR</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        {/* Story */}
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center mb-20">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-0.5 bg-white" />
              <span className="text-white text-xs font-semibold uppercase tracking-widest">How It Began</span>
            </div>
            <h2 className="text-brand-cream text-3xl font-bold leading-tight mb-5">Born On The Block.<br />Built for the Wave.</h2>
            <div className="space-y-4 text-brand-muted text-sm leading-relaxed">
              <p>VIBE WEAR was founded in Lagos with a singular vision — to create a premium street brand that doesn't ask for your attention, it demands it.</p>
              <p>Every drop is curated, not mass produced. We pick pieces that carry meaning, that have energy — graphic tees, denim, outerwear that tells a story when you walk into a room.</p>
              <p>From our first drop of five tees to Season 4, VIBE WEAR has grown into a community of people who move with intention and dress the same way.</p>
            </div>
          </div>
          <div className="   gap-3">
            <div className="rounded-xl overflow-hidden   ">
              <img src="/images/VIBE.png" alt="" className="w-full h-full object-cover" />
            </div>
             
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 p-8 md:p-12 bg-white rounded-2xl">
          {[['2021', 'Founded'], ['30+', 'Drops'], ['5,000+', 'On The Wave'], ['2', 'Store Locations']].map(([num, label]) => (
            <div key={label} className="text-center">
              <div className="text-black font-black text-3xl md:text-4xl">{num}</div>
              <div className="text-black/60 text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <span className="text-white text-xs font-semibold uppercase tracking-widest">What We Stand For</span>
            <h2 className="text-brand-cream text-3xl font-bold mt-2">Our Values</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map(v => (
              <div key={v.title} className="bg-white/4 border border-white/8 rounded-2xl p-6 hover:border-white/25 transition-colors duration-200">
                <div className="text-white text-2xl mb-4">{v.icon}</div>
                <h3 className="text-brand-cream font-bold text-base mb-2">{v.title}</h3>
                <p className="text-brand-muted text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
         
      </div>
    </div>
  );
}
