import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactItems = [
    { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>, label: 'Email Us', value: 'hello@vibewear.com', href: 'mailto:hello@vibewear.com' },
    { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>, label: 'Call Us', value: '+234 801 234 5678', href: 'tel:+2348012345678' },
    { icon: <svg className="w-5 h-5 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>, label: 'WhatsApp', value: '@vibewear_', href: 'https://wa.me/2348012345678' },
  ];

  return (
    <div className="bg-brand-bg min-h-screen mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <span className="text-white text-xs font-semibold uppercase tracking-widest">Get in Touch</span>
          <h1 className="text-brand-cream text-3xl md:text-4xl font-bold mt-1 mb-2">Contact Us</h1>
          <p className="text-brand-muted text-sm max-w-lg">Have a question about an order, a collab idea, or just want to say hi? We're here.</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-10">
          <div className="bg-white/3 border border-white/8 rounded-2xl p-7">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full py-14 text-center gap-4">
                <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-3xl">✓</div>
                <h3 className="text-brand-cream font-bold text-lg">Message Sent!</h3>
                <p className="text-brand-muted text-sm">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-brand-cream font-bold text-lg mb-5">Send us a Message</h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  {[['name', 'Name', 'Your full name', 'text'], ['email', 'Email', 'your@email.com', 'email']].map(([name, label, ph, type]) => (
                    <div key={name}>
                      <label className="text-brand-muted text-xs uppercase tracking-wide mb-2 block font-medium">{label}</label>
                      <input name={name} type={type} value={formData[name]} onChange={e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }))} required placeholder={ph}
                        className="w-full bg-white/5 border border-white/12 text-brand-cream placeholder:text-brand-muted text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-white/30 transition-colors" />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="text-brand-muted text-xs uppercase tracking-wide mb-2 block font-medium">Subject</label>
                  <select name="subject" value={formData.subject} onChange={e => setFormData(p => ({ ...p, subject: e.target.value }))} required
                    className="w-full bg-white/5 border border-white/12 text-brand-muted text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-white/30 transition-colors appearance-none cursor-pointer">
                    <option value="">Select a subject</option>
                    <option value="order">Order Enquiry</option>
                    <option value="returns">Returns & Exchanges</option>
                    <option value="collab">Collab / Wholesale</option>
                    <option value="styling">Styling Help</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-brand-muted text-xs uppercase tracking-wide mb-2 block font-medium">Message</label>
                  <textarea name="message" value={formData.message} onChange={e => setFormData(p => ({ ...p, message: e.target.value }))} required rows={5} placeholder="Tell us how we can help..."
                    className="w-full bg-white/5 border border-white/12 text-brand-cream placeholder:text-brand-muted text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-white/30 transition-colors resize-none" />
                </div>
                <button type="submit" className="w-full bg-white text-black font-semibold py-3.5 rounded-xl hover:opacity-90 transition-opacity">Send Message</button>
              </form>
            )}
          </div>

          <div className="space-y-5">
            <div>
              <h2 className="text-brand-cream font-bold text-lg mb-4">Our Contact Info</h2>
              <div className="space-y-3">
                {contactItems.map(item => (
                  <a key={item.label} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                    className="flex items-center gap-4 p-4 bg-white/4 border border-white/8 rounded-xl hover:border-white/25 transition-all group">
                    <div className="w-10 h-10 bg-white/8 rounded-full flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all">{item.icon}</div>
                    <div>
                      <p className="text-brand-muted text-xs">{item.label}</p>
                      <p className="text-brand-cream font-medium text-sm">{item.value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
            <div className="bg-white/6 border border-white/10 rounded-xl p-5">
              <h3 className="text-brand-cream font-bold mb-2">Response Time</h3>
              <p className="text-brand-muted text-sm leading-relaxed">We typically respond within 24 hours on business days. For urgent queries, reach us on WhatsApp.</p>
            </div>
            <div className="bg-white/4 border border-white/8 rounded-xl p-5">
              <h3 className="text-brand-cream font-semibold text-sm mb-3">Office Hours</h3>
              {[['Monday – Friday', '9:00 AM – 6:00 PM WAT'], ['Saturday', '10:00 AM – 4:00 PM WAT'], ['Sunday', 'Closed']].map(([day, time]) => (
                <div key={day} className="flex justify-between py-2 border-b border-white/5 last:border-0">
                  <span className="text-brand-muted text-xs">{day}</span>
                  <span className="text-brand-cream text-xs font-medium">{time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
