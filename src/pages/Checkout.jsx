import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder } from '../lib/api';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';

const FLW_PUBLIC_KEY = 'FLWPUBK_TEST-XXXXXXXXXXXXXXXXXXXX-X';
const WHATSAPP_NUMBER = '233XXXXXXXXX';
const INSTAGRAM_USERNAME = 'vibewear_';

const COUNTRIES = [
  'Ghana','Nigeria','United States','United Kingdom','Canada','Australia',
  'South Africa','Kenya','Germany','France','Italy','Spain','Netherlands',
  'Sweden','Norway','Denmark','Switzerland','Belgium','Portugal','Ireland',
  'New Zealand','Singapore','UAE','Japan','Brazil','India',
  "Cote d'Ivoire",'Senegal','Cameroon','Tanzania','Uganda','Other',
];

function loadFlutterwaveScript() {
  return new Promise((resolve) => {
    if (window.FlutterwaveCheckout) { resolve(); return; }
    const s = document.createElement('script');
    s.src = 'https://checkout.flutterwave.com/v3.js';
    s.onload = resolve;
    document.body.appendChild(s);
  });
}

// ── Changed: border colors now use solid dark tones instead of white/10
const iStyle = (err) =>
  `w-full bg-gray-100 border ${err ? 'border-red-400' : 'border-gray-400'} rounded-xl px-4 py-3.5 text-brand-cream text-sm placeholder-gray-400 focus:outline-none focus:border-gray-200 focus:bg-gray-100 transition-all`;

function Field({ label, hint, required, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <label className="text-brand-cream text-[11px] font-bold uppercase tracking-widest">
          {label}{required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
        {hint && !error && <span className="text-brand-muted text-[11px] normal-case">{hint}</span>}
      </div>
      {children}
      {error && (
        <span className="text-red-400 text-[11px] flex items-center gap-1">
          <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
          </svg>
          {error}
        </span>
      )}
    </div>
  );
}

function SectionCard({ icon, title, subtitle, children }) {
  return (
    // ── Changed: border-white/[0.07] → border-gray-300
    <div className="bg-gray-100 border border-gray-300 rounded-2xl overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-300">
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 text-sm">{icon}</div>
        <div>
          <p className="text-brand-cream font-bold text-sm">{title}</p>
          {subtitle && <p className="text-brand-muted text-xs mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function StepPill({ step }) {
  return (
    <div className="flex items-center gap-2 mt-5">
      {['Delivery', 'Review & Pay'].map((label, i) => {
        const done = step > i + 1;
        const active = step === i + 1;
        return (
          <div key={label} className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all
              ${done ? 'bg-emerald-500 text-white' : active ? 'bg-black text-white' : 'bg-gray-200 text-gray-400'}`}>
              {done ? '✓' : i + 1}
            </div>
            <span className={`text-[11px] font-semibold uppercase tracking-wider hidden sm:inline
              ${active ? 'text-brand-cream' : done ? 'text-emerald-400' : 'text-gray-400'}`}>
              {label}
            </span>
            {i === 0 && <div className={`w-8 h-px mx-1 ${done ? 'bg-emerald-500' : 'bg-gray-200'}`} />}
          </div>
        );
      })}
    </div>
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { formatPrice, convert, currency, currentCurrency } = useCurrency();
  const { user, logout } = useAuth();

  const itemCount   = cartItems.reduce((s, i) => s + i.quantity, 0);
  const shippingFee = cartTotal >= 200 ? 0 : 10;
  const grandTotal  = cartTotal + shippingFee;
  const grandTotalConverted = convert(grandTotal);

  const [step, setStep]       = useState(1);
  const [loadingChannel, setLoadingChannel] = useState(null); // 'whatsapp' | 'instagram' | null
  const [orderError, setOrderError] = useState('');
  const [errors, setErrors]   = useState({});
  const [photoError, setPhotoError] = useState(false); // fall back to initial-letter avatar if the Google photo URL fails

  const nameParts  = (user?.displayName || '').trim().split(' ');
  const autoFirst  = nameParts[0] || '';
  const autoLast   = nameParts.slice(1).join(' ') || '';

  const [form, setForm] = useState({
    firstName: autoFirst, lastName: autoLast,
    phone: '',
    address: '', address2: '',
    city: '', stateRegion: '', postalCode: '',
    country: 'Ghana',
    notes: '',
  });

  useEffect(() => {
    if (user?.displayName) {
      const parts = user.displayName.trim().split(' ');
      setForm(f => ({
        ...f,
        firstName: f.firstName || parts[0] || '',
        lastName:  f.lastName  || parts.slice(1).join(' ') || '',
      }));
    }
  }, [user]);

  useEffect(() => { if (!cartItems.length) navigate('/cart'); }, [cartItems]);

  const set = (k) => (e) => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    setErrors(er => ({ ...er, [k]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim())  e.lastName  = 'Required';
    if (!form.phone.replace(/\D/g, '').length >= 7) e.phone = 'Enter a valid phone number';
    if (!form.address.trim())   e.address   = 'Required';
    if (!form.city.trim())      e.city      = 'Required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const goToStep2 = () => {
    if (!user) {
      navigate('/auth?redirect=checkout');
      return;
    }
    if (validate()) { setStep(2); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const buildOrderPayload = (channel) => ({
    uid: user.uid,
    email: user.email,
    channel,
    items: cartItems.map(i => ({
      productId: i._id || i.id, name: i.name, image: i.image,
      price: i.price, size: i.size, color: i.color, quantity: i.quantity,
    })),
    subtotal: cartTotal,
    shipping: shippingFee,
    total: grandTotal,
    customer: {
      firstName: form.firstName, lastName: form.lastName, phone: form.phone,
      address: form.address, address2: form.address2, city: form.city,
      stateRegion: form.stateRegion, postalCode: form.postalCode,
      country: form.country, notes: form.notes,
    },
  });

  const [orderPopup, setOrderPopup] = useState(null); // { order, channel } — shown before redirecting to WhatsApp/Instagram
  const [copied, setCopied] = useState(false);

  const createChannelOrder = async (channel) => {
    setOrderError('');
    setLoadingChannel(channel);
    try {
      const res = await createOrder(buildOrderPayload(channel));
      if (!res.success) throw new Error(res.message || 'Could not create order');
      setOrderPopup({ order: res.order, channel });
    } catch (err) {
      setOrderError(err.message || 'Something went wrong creating your order. Please try again.');
    } finally {
      setLoadingChannel(null);
    }
  };

  const handleWhatsApp  = () => createChannelOrder('whatsapp');
  const handleInstagram = () => createChannelOrder('instagram');

  const copyOrderId = async () => {
    if (!orderPopup) return;
    try {
      await navigator.clipboard.writeText(orderPopup.order.orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard may be blocked — the ID is still visible to copy manually */ }
  };

  const continueToSocial = () => {
    if (!orderPopup) return;
    const { order, channel } = orderPopup;

    if (channel === 'whatsapp') {
      const lines = cartItems.map(i =>
        `• ${i.name} (${i.size}, ${i.color}) x${i.quantity} — ${formatPrice(i.price * i.quantity)}`
      ).join('\n');
      const addr = [form.address, form.address2, form.city, form.stateRegion, form.postalCode, form.country].filter(Boolean).join(', ');
      const msg = encodeURIComponent(
        `🛍️ *VIBE WEAR Order* — *${order.orderNumber}*\n\n${lines}\n\n` +
        `*Subtotal:* ${formatPrice(cartTotal)}\n*Shipping:* ${shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}\n*Total:* ${formatPrice(grandTotal)}\n\n` +
        `📦 *Deliver to:*\n${form.firstName} ${form.lastName}\n${form.phone} · ${user.email}\n${addr}` +
        (form.notes ? `\n\n📝 Note: ${form.notes}` : '') +
        `\n\nPlease confirm my order. Thank you!`
      );
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
    } else {
      // Instagram DMs don't support pre-filled message text via URL like WhatsApp does,
      // so we copy the order ID to the clipboard (also offered via the Copy button above) and the customer pastes it themselves.
      navigator.clipboard.writeText(order.orderNumber).catch(() => {});
      window.open(`https://ig.me/m/${INSTAGRAM_USERNAME}`, '_blank');
    }

    clearCart();
    navigate('/order-success', {
      state: { orderNumber: order.orderNumber, channel, amount: formatPrice(grandTotal), customer: { ...form, email: user.email }, items: cartItems },
    });
  };

  const Summary = () => (
    <div className="self-start lg:sticky lg:top-24 space-y-4">
      <div className="bg-gray-100 border border-gray-300 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-300">
          <p className="text-brand-cream font-bold">Order Summary</p>
          <p className="text-brand-muted text-xs mt-0.5">{itemCount} item{itemCount !== 1 ? 's' : ''}</p>
        </div>
        <div className="px-5 py-4 space-y-3 border-b border-gray-300">
          {cartItems.map(item => (
            <div key={item.key} className="flex gap-3 items-center">
              <div className="relative shrink-0">
                <img src={item.image} alt={item.name} className="w-11 h-14 object-cover rounded-lg"/>
                <span className="absolute -top-1.5 -right-1.5 bg-white text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{item.quantity}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-brand-cream text-xs font-medium line-clamp-1">{item.name}</p>
                <p className="text-brand-muted text-[11px] mt-0.5">{item.size} · {item.color}</p>
              </div>
              <p className="text-brand-cream text-xs font-semibold shrink-0">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
        <div className="px-5 py-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <div>
              <p className="text-brand-muted">Items subtotal</p>
              <p className="text-brand-muted text-xs">{itemCount} item{itemCount !== 1 ? 's' : ''}, before shipping</p>
            </div>
            <p className="text-brand-cream font-medium shrink-0">{formatPrice(cartTotal)}</p>
          </div>
          <div className="flex justify-between">
            <div>
              <p className={shippingFee === 0 ? 'text-emerald-400' : 'text-brand-muted'}>Shipping & Handling</p>
              <p className="text-brand-muted text-xs">
                {shippingFee === 0 ? `Free over ${formatPrice(200)}` : 'Standard international'}
              </p>
            </div>
            <p className={`font-medium shrink-0 ${shippingFee === 0 ? 'text-emerald-400' : 'text-brand-cream'}`}>
              {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
            </p>
          </div>
          <div className="pt-3 border-t border-gray-400 flex justify-between items-start">
            <div>
              <p className="text-brand-cream font-bold text-base">Total</p>
              <p className="text-brand-muted text-xs">{currentCurrency.name} · {currentCurrency.code}</p>
            </div>
            <p className="text-brand-cream font-black text-xl shrink-0">{formatPrice(grandTotal)}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 border border-gray-300 rounded-2xl px-5 py-4 space-y-3">
        {[
          ['🔒','Secure Payment','256-bit SSL · Flutterwave'],
          ['📦','Worldwide Delivery','5–14 business days'],
          ['↩️','Easy Returns','30-day return policy'],
          ['💬','Support','WhatsApp · Always available'],
        ].map(([icon, title, desc]) => (
          <div key={title} className="flex items-start gap-3">
            <span className="text-sm mt-0.5 shrink-0">{icon}</span>
            <div>
              <p className="text-brand-cream text-xs font-semibold">{title}</p>
              <p className="text-brand-muted text-xs">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-brand-bg min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">

        {/* Header */}
        <div className="mt-5 mb-10">
          <button
            onClick={() => step === 2 ? setStep(1) : navigate('/cart')}
            className="flex items-center gap-2 text-brand-muted hover:text-brand-cream transition-colors text-sm mb-3"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            {step === 2 ? 'Back to delivery' : 'Back to cart'}
          </button>
          <h1 className="text-brand-cream text-3xl md:text-4xl font-bold">Checkout</h1>
          <StepPill step={step}/>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-10">

          {step === 1 && (
            <div className="space-y-5">

              {user ? (
                <div className="bg-emerald-500/[0.07] border border-emerald-500/50 rounded-2xl px-5 py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {user.photoURL && !photoError ? (
                      <img src={user.photoURL} alt="" referrerPolicy="no-referrer" onError={() => setPhotoError(true)} className="w-9 h-9 rounded-full object-cover border border-gray-300"/>
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-brand-cream font-bold text-sm">
                        {(user.displayName || user.email || '?')[0].toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-emerald-400 text-xs font-semibold">Signed in</p>
                      <p className="text-brand-cream text-sm font-medium">{user.displayName || user.email}</p>
                      {user.displayName && <p className="text-brand-muted text-xs">{user.email}</p>}
                    </div>
                  </div>
                  <button
                    onClick={() => { logout(); navigate('/auth?redirect=checkout'); }}
                    className="text-brand-muted hover:text-brand-cream text-xs underline underline-offset-2 transition-colors shrink-0"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="bg-gray-100 border border-gray-300 rounded-2xl p-5">
                  <p className="text-brand-cream font-bold text-sm mb-1">Sign in to checkout faster</p>
                  <p className="text-brand-muted text-xs mb-4">
                    Your details will be saved for next time. No need to re-enter them.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      to="/auth?redirect=checkout"
                      className="flex-1 bg-white text-black font-bold py-3 rounded-xl text-center text-sm hover:bg-black hover:text-white transition-colors"
                    >
                      Sign In / Create Account
                    </Link>
                    <button
                      onClick={() => { if (validate()) { setStep(2); window.scrollTo({ top: 0, behavior: 'smooth' }); } }}
                      className="flex-1 border border-gray-400 text-brand-muted py-3 rounded-xl text-sm hover:border-gray-200 hover:text-brand-cream transition-all"
                    >
                      Continue as guest
                    </button>
                  </div>
                </div>
              )}

              <SectionCard icon="👤" title="Your Details" subtitle="Name and phone number for this order">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="First Name" required error={errors.firstName}>
                    <input value={form.firstName} onChange={set('firstName')}
                      placeholder="e.g. Kofi" autoComplete="given-name"
                      className={iStyle(errors.firstName)}/>
                  </Field>
                  <Field label="Last Name" required error={errors.lastName}>
                    <input value={form.lastName} onChange={set('lastName')}
                      placeholder="e.g. Mensah" autoComplete="family-name"
                      className={iStyle(errors.lastName)}/>
                  </Field>
                </div>
                <div className="mt-4">
                  <Field label="Phone Number" required hint="For delivery updates" error={errors.phone}>
                    <input type="tel" value={form.phone} onChange={set('phone')}
                      placeholder="+233 XX XXX XXXX" autoComplete="tel"
                      className={iStyle(errors.phone)}/>
                  </Field>
                </div>
                {user && (
                  <p className="text-brand-muted text-[11px] mt-3 flex items-center gap-1">
                    <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                    Order confirmation will be sent to <span className="text-brand-muted ml-0.5">{user.email}</span>
                  </p>
                )}
              </SectionCard>

              <SectionCard icon="📍" title="Shipping Address" subtitle="Where should we deliver your order?">
                <div className="mb-4">
                  <Field label="Country / Region" required>
                    <select value={form.country} onChange={set('country')}
                      autoComplete="country-name" className={iStyle(false) + ' cursor-pointer'}>
                      {COUNTRIES.map(c => <option key={c} value={c} className="bg-white text-black">{c}</option>)}
                    </select>
                  </Field>
                </div>
                <div className="mb-4">
                  <Field label="Street Address" required error={errors.address}>
                    <input value={form.address} onChange={set('address')}
                      placeholder="House number and street name"
                      autoComplete="address-line1" className={iStyle(errors.address)}/>
                  </Field>
                </div>
                <div className="mb-4">
                  <Field label="Apartment / Suite / Landmark" hint="Optional">
                    <input value={form.address2} onChange={set('address2')}
                      placeholder="Apt 4B, near the big church, blue gate..."
                      autoComplete="address-line2" className={iStyle(false)}/>
                  </Field>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <Field label="City / Town" required error={errors.city}>
                    <input value={form.city} onChange={set('city')}
                      placeholder="Accra" autoComplete="address-level2"
                      className={iStyle(errors.city)}/>
                  </Field>
                  <Field label="State / Province" hint="Optional">
                    <input value={form.stateRegion} onChange={set('stateRegion')}
                      placeholder="Greater Accra"
                      autoComplete="address-level1" className={iStyle(false)}/>
                  </Field>
                  <Field label="Postal / ZIP" hint="If applicable">
                    <input value={form.postalCode} onChange={set('postalCode')}
                      placeholder="00233" autoComplete="postal-code"
                      className={iStyle(false)}/>
                  </Field>
                </div>
              </SectionCard>

              <SectionCard icon="📝" title="Delivery Notes" subtitle="Optional instructions for the delivery driver">
                <textarea value={form.notes} onChange={set('notes')} rows={3}
                  placeholder="e.g. Call when nearby · Leave at gate · Blue house on the left..."
                  className={iStyle(false) + ' resize-none'}/>
              </SectionCard>

              <button onClick={goToStep2}
                className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2 text-sm">
                Continue to Payment
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">

              {user && (
                <div className="flex items-center gap-2 text-xs text-brand-muted bg-gray-100 border border-gray-300 rounded-xl px-4 py-2.5">
                  {user.photoURL && !photoError
                    ? <img src={user.photoURL} alt="" referrerPolicy="no-referrer" onError={() => setPhotoError(true)} className="w-5 h-5 rounded-full"/>
                    : <div className="w-5 h-5 rounded-full bg-emerald-500/30 flex items-center justify-center text-emerald-400 text-[10px] font-bold">{(user.displayName || user.email)[0].toUpperCase()}</div>
                  }
                  <span>Paying as</span>
                  <span className="text-gray-600 font-medium">{user.email}</span>
                </div>
              )}

              <div className="bg-gray-100 border border-gray-300 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-brand-cream font-bold text-sm">📦 Delivering To</p>
                  <button
                    onClick={() => { setStep(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="text-[11px] text-brand-muted hover:text-brand-cream underline underline-offset-2 transition-colors flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                    Edit
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-1 text-sm">
                  <div className="space-y-0.5">
                    <p className="text-brand-cream font-semibold">{form.firstName} {form.lastName}</p>
                    <p className="text-brand-muted text-xs">{form.phone}</p>
                    {user && <p className="text-brand-muted text-xs">{user.email}</p>}
                  </div>
                  <div className="space-y-0.5 mt-2 sm:mt-0">
                    <p className="text-brand-cream text-xs">{form.address}{form.address2 ? `, ${form.address2}` : ''}</p>
                    <p className="text-brand-cream text-xs">{[form.city, form.stateRegion, form.postalCode].filter(Boolean).join(', ')}</p>
                    <p className="text-brand-cream text-xs font-medium">{form.country}</p>
                  </div>
                </div>
                {form.notes && (
                  <p className="text-brand-muted text-xs italic mt-3 pt-3 border-t border-gray-400">📝 "{form.notes}"</p>
                )}
              </div>

              <div className="bg-gray-100 border border-gray-300 rounded-2xl p-5">
                <p className="text-brand-cream font-bold text-sm mb-4">🛍️ Your Items ({itemCount})</p>
                <div className="space-y-4">
                  {cartItems.map(item => (
                    <div key={item.key} className="flex gap-3 items-center">
                      <img src={item.image} alt={item.name} className="w-14 h-[68px] object-cover rounded-xl shrink-0"/>
                      <div className="flex-1 min-w-0">
                        <p className="text-brand-cream text-sm font-medium line-clamp-1">{item.name}</p>
                        <p className="text-brand-muted text-xs mt-0.5">{item.size} · {item.color}</p>
                        <p className="text-brand-muted text-xs">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-brand-cream font-semibold text-sm">{formatPrice(item.price * item.quantity)}</p>
                        {item.quantity > 1 && <p className="text-brand-muted text-xs">{formatPrice(item.price)} each</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-100 border border-gray-300 rounded-2xl p-5">
                <p className="text-brand-cream font-bold text-sm mb-1">💳 Choose How to Order</p>
                <p className="text-brand-muted text-xs mb-5">
                  We'll create your order and give you an Order ID — send it to us on WhatsApp or Instagram to confirm and arrange payment.
                </p>

                {orderError && (
                  <div className="mb-4 px-4 py-2.5 rounded-xl text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/30">
                    {orderError}
                  </div>
                )}

                {/* Card payment — disabled for now */}
                <div className="mb-5">
                  <button disabled
                    className="w-full bg-gray-100 border border-gray-400 text-gray-400 font-bold py-4 rounded-xl flex items-center justify-center gap-2 cursor-not-allowed">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" strokeWidth="2"/>
                      <line x1="1" y1="10" x2="23" y2="10" strokeWidth="2"/>
                    </svg>
                    Card Payment — Coming Soon
                  </button>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {['💳 Visa','💳 Mastercard','🏦 Bank Transfer'].map(m => (
                      <span key={m} className="bg-gray-100 border border-gray-400 rounded-lg px-3 py-1.5 text-xs text-brand-muted">{m}</span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-5">
                  <div className="flex-1 h-px bg-gray-400"/>
                  <span className="text-brand-muted text-xs">order manually — available now</span>
                  <div className="flex-1 h-px bg-gray-400"/>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <button onClick={handleWhatsApp} disabled={!!loadingChannel}
                    className="w-full bg-[#25D366]/[0.08] border border-[#25D366]/50 text-[#25D366] font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-[#25D366]/[0.14] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {loadingChannel === 'whatsapp' ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                    )}
                    {loadingChannel === 'whatsapp' ? 'Creating order…' : 'Order via WhatsApp'}
                  </button>

                  <button onClick={handleInstagram} disabled={!!loadingChannel}
                    className="w-full bg-fuchsia-500/[0.08] border border-fuchsia-500/40 text-fuchsia-400 font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-fuchsia-500/[0.14] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {loadingChannel === 'instagram' ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    )}
                    {loadingChannel === 'instagram' ? 'Creating order…' : 'Order via Instagram'}
                  </button>
                </div>
                <p className="text-gray-400 text-[11px] text-center mt-3">
                  We'll open WhatsApp or Instagram with your Order ID ready to send — we'll confirm and arrange payment manually.
                </p>
              </div>
            </div>
          )}

          <Summary/>
        </div>
      </div>

      {/* ── Order received popup — shown before redirecting to WhatsApp/Instagram ── */}
      {orderPopup && (
        <div className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <div className="flex flex-col items-center text-center mb-5">
              <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m5 13 4 4L19 7"/>
                </svg>
              </div>
              <h3 className="text-black font-black text-xl mb-1">Order Received!</h3>
              <p className="text-brand-muted text-sm">
                Copy your Order ID, then continue to {orderPopup.channel === 'whatsapp' ? 'WhatsApp' : 'Instagram'} to confirm.
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-5 text-center">
              <p className="text-gray-400 text-[11px] uppercase tracking-widest mb-1.5">Your Order ID</p>
              <div className="flex items-center justify-center gap-3">
                <span className="font-mono font-black text-2xl tracking-wider text-black">{orderPopup.order.orderNumber}</span>
                <button onClick={copyOrderId}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors">
                  {copied ? 'Copied ✓' : 'Copy'}
                </button>
              </div>
            </div>

            <button onClick={continueToSocial}
              className={`w-full font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors text-sm ${
                orderPopup.channel === 'whatsapp'
                  ? 'bg-[#25D366] text-white hover:bg-[#1ebe5a]'
                  : 'bg-fuchsia-500 text-white hover:bg-fuchsia-600'
              }`}>
              {orderPopup.channel === 'whatsapp' ? (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              )}
              Continue to {orderPopup.channel === 'whatsapp' ? 'WhatsApp' : 'Instagram'}
            </button>
            <button onClick={() => setOrderPopup(null)}
              className="w-full mt-2 text-gray-400 hover:text-black text-xs py-2 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}