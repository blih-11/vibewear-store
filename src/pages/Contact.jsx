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

  const inputStyle = {
    width: '100%', border: '1px solid #e5e5e5', borderRadius: '2px',
    padding: '12px 14px', fontSize: '0.85rem', color: '#000',
    outline: 'none', fontFamily: 'inherit', background: '#fff',
    transition: 'border-color 0.2s',
  };

  const contactItems = [
    {
      label: 'Email Us', value: 'hello@vibewear.com', href: 'mailto:hello@vibewear.com',
      icon: <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
    },
    {
      label: 'Call Us', value: '+233 20 372 4311', href: 'tel:+233203724311',
      icon: <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
    },
    {
      label: 'WhatsApp', value: '+233 20 372 4311', href: 'https://wa.me/233203724311',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
    },
  ];

  return (
    <div style={{ background: '#fff', minHeight: '100vh', paddingTop: '64px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 1.5rem' }}>

        <div style={{ marginBottom: '2.5rem' }}>
          <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#aaa', fontFamily: 'var(--font-mono)', marginBottom: '6px' }}>Get in Touch</p>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#000' }}>Contact Us</h1>
          <p style={{ color: '#888', fontSize: '0.88rem', marginTop: '6px' }}>Have a question about an order, a collab idea, or just want to say hi?</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '3rem', alignItems: 'start' }} className="contact-grid">

          {/* Form */}
          <div style={{ border: '1px solid #f0f0f0', borderRadius: '4px', padding: '2rem' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                <div style={{ width: '48px', height: '48px', background: '#000', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <svg width="20" height="20" fill="none" stroke="#fff" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="m5 12 5 5 9-9"/></svg>
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '6px' }}>Message Sent!</h3>
                <p style={{ color: '#888', fontSize: '0.85rem' }}>We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h2 style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>Send a Message</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  {[['name', 'Name', 'Your name', 'text'], ['email', 'Email', 'you@email.com', 'email']].map(([name, label, ph, type]) => (
                    <div key={name}>
                      <label style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#555', display: 'block', marginBottom: '6px' }}>{label}</label>
                      <input name={name} type={type} value={formData[name]}
                        onChange={e => setFormData(p => ({ ...p, [e.target.name]: e.target.value }))}
                        required placeholder={ph} style={inputStyle}
                        onFocus={e => e.target.style.borderColor = '#000'}
                        onBlur={e => e.target.style.borderColor = '#e5e5e5'} />
                    </div>
                  ))}
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#555', display: 'block', marginBottom: '6px' }}>Subject</label>
                  <select name="subject" value={formData.subject}
                    onChange={e => setFormData(p => ({ ...p, subject: e.target.value }))} required style={{ ...inputStyle, cursor: 'pointer' }}
                    onFocus={e => e.target.style.borderColor = '#000'}
                    onBlur={e => e.target.style.borderColor = '#e5e5e5'}>
                    <option value="">Select a subject</option>
                    <option value="order">Order Enquiry</option>
                    <option value="returns">Returns & Exchanges</option>
                    <option value="collab">Collab / Wholesale</option>
                    <option value="styling">Styling Help</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#555', display: 'block', marginBottom: '6px' }}>Message</label>
                  <textarea name="message" value={formData.message}
                    onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                    required rows={5} placeholder="Tell us how we can help..."
                    style={{ ...inputStyle, resize: 'vertical' }}
                    onFocus={e => e.target.style.borderColor = '#000'}
                    onBlur={e => e.target.style.borderColor = '#e5e5e5'} />
                </div>
                <button type="submit" style={{ background: '#000', color: '#fff', border: 'none', padding: '14px', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '2px', transition: 'opacity 0.2s' }}
                  onMouseEnter={e => e.target.style.opacity = '0.85'}
                  onMouseLeave={e => e.target.style.opacity = '1'}>
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {contactItems.map(item => (
              <a key={item.label} href={item.href} target={item.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', border: '1px solid #f0f0f0', borderRadius: '4px', textDecoration: 'none', color: '#000', transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#000'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#f0f0f0'}>
                <div style={{ width: '40px', height: '40px', background: '#f8f8f8', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {item.icon}
                </div>
                <div>
                  <p style={{ fontSize: '0.7rem', color: '#aaa', marginBottom: '2px', letterSpacing: '0.06em' }}>{item.label}</p>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.value}</p>
                </div>
              </a>
            ))}
            <div style={{ border: '1px solid #f0f0f0', borderRadius: '4px', padding: '16px', marginTop: '4px' }}>
              <h3 style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '12px' }}>Office Hours</h3>
              {[['Monday – Saturday', '11:00 AM – 8:00 PM'], ['Sunday', 'Closed']].map(([day, time]) => (
                <div key={day} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f8f8f8' }}>
                  <span style={{ color: '#888', fontSize: '0.8rem' }}>{day}</span>
                  <span style={{ fontWeight: 600, fontSize: '0.8rem' }}>{time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media(max-width: 767px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
