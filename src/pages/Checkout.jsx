import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder } from '../lib/api';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';

const WHATSAPP_NUMBER = '233XXXXXXXXX';
const INSTAGRAM_USERNAME = 'vibewear_';

const COUNTRIES = [
  'Ghana','Nigeria','United States','United Kingdom','Canada','Australia',
  'South Africa','Kenya','Germany','France','Italy','Spain','Netherlands',
  'Sweden','Norway','Denmark','Switzerland','Belgium','Portugal','Ireland',
  'New Zealand','Singapore','UAE','Japan','Brazil','India',
  "Cote d'Ivoire",'Senegal','Cameroon','Tanzania','Uganda','Other',
];

// ── Floating-label input box — label sits inside the bordered box, above the value ──
function Box({ label, required, error, children, select }) {
  return (
    <div>
      <div className={`relative border rounded-lg px-3.5 pt-2 pb-2 bg-white transition-colors
        ${error ? 'border-red-400' : 'border-gray-300'} focus-within:border-black`}>
        <label className="block text-[11px] text-gray-400 leading-none mb-1">
          {label}{required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
        {children}
        {select && (
          <svg className="w-3.5 h-3.5 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
          </svg>
        )}
      </div>
      {error && <p className="text-red-500 text-[11px] mt-1">{error}</p>}
    </div>
  );
}

const boxInput = "w-full text-sm text-black outline-none bg-transparent p-0 border-0 placeholder-gray-300";

// ── A selectable pill row (shipping method / channel choice) ──
function OptionRow({ selected, disabled, onClick, children }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled}
      className={`w-full flex items-center justify-between rounded-lg border px-4 py-3.5 text-left transition-colors
        ${disabled ? 'border-gray-200 bg-gray-50 cursor-not-allowed' :
          selected ? 'border-black bg-gray-50' : 'border-gray-300 hover:border-gray-400'}`}>
      {children}
    </button>
  );
}

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { formatPrice, currentCurrency } = useCurrency();
  const { user, logout } = useAuth();

  const itemCount   = cartItems.reduce((s, i) => s + i.quantity, 0);
  const shippingFee = cartTotal >= 200 ? 0 : 10;
  const grandTotal  = cartTotal + shippingFee;

  const [orderError, setOrderError] = useState('');
  const [errors, setErrors]   = useState({});
  const [loadingChannel, setLoadingChannel] = useState(null); // 'whatsapp' | 'instagram' | null
  const [summaryOpen, setSummaryOpen] = useState(false); // mobile collapsible order summary

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

  // Required fields for a deliverable order — used both for inline validation
  // errors on submit, and to silently gate the Order ID panel below.
  const isFormComplete =
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.phone.replace(/\D/g, '').length >= 7 &&
    form.address.trim() &&
    form.city.trim();

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim())  e.lastName  = 'Required';
    if (form.phone.replace(/\D/g, '').length < 7) e.phone = 'Enter a valid phone number';
    if (!form.address.trim())   e.address   = 'Required';
    if (!form.city.trim())      e.city      = 'Required';
    setErrors(e);
    return !Object.keys(e).length;
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

  const [order, setOrder] = useState(null);      // the created order, once generated
  const [orderChannel, setOrderChannel] = useState(null); // 'whatsapp' | 'instagram'
  const [copied, setCopied] = useState(false);

  const createChannelOrder = async (channel) => {
    if (!user) { navigate('/auth?redirect=checkout'); return; }
    if (!validate()) { window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    setOrderError('');
    setLoadingChannel(channel);
    try {
      const res = await createOrder(buildOrderPayload(channel));
      if (!res.success) throw new Error(res.message || 'Could not create order');
      setOrder(res.order);
      setOrderChannel(channel);
    } catch (err) {
      setOrderError(err.message || 'Something went wrong creating your order. Please try again.');
    } finally {
      setLoadingChannel(null);
    }
  };

  const handleWhatsApp  = () => createChannelOrder('whatsapp');
  const handleInstagram = () => createChannelOrder('instagram');

  const copyOrderId = async () => {
    if (!order) return;
    try {
      await navigator.clipboard.writeText(order.orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard may be blocked — the ID is still visible to copy manually */ }
  };

  const continueToSocial = () => {
    if (!order || !orderChannel) return;

    if (orderChannel === 'whatsapp') {
      const lines = cartItems.map(i =>
        `• ${i.name}${i.size ? ` (${i.size}${i.color ? ', ' + i.color : ''})` : ''} x${i.quantity} — ${formatPrice(i.price * i.quantity)}`
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
      navigator.clipboard.writeText(order.orderNumber).catch(() => {});
      window.open(`https://ig.me/m/${INSTAGRAM_USERNAME}`, '_blank');
    }

    clearCart();
    navigate('/order-success', {
      state: { orderNumber: order.orderNumber, channel: orderChannel, amount: formatPrice(grandTotal), customer: { ...form, email: user.email }, items: cartItems },
    });
  };

  // ── Order summary content — shared by the desktop sidebar and the mobile collapsible bar ──
  const SummaryContent = () => (
    <>
      <div className="relative">
        <div className={`space-y-4 ${cartItems.length > 3 ? 'max-h-[280px] overflow-y-auto pr-1' : ''}`}>
          {cartItems.map(item => (
            <div key={item.key} className="flex gap-3 items-center">
              <div className="relative shrink-0">
                <img src={item.image} alt={item.name} className="w-12 h-14 object-cover rounded-md bg-gray-50"/>
                <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{item.quantity}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-black text-sm font-medium line-clamp-1">{item.name}</p>
                {item.size && <p className="text-gray-400 text-xs mt-0.5">{item.size}{item.color ? ` / ${item.color}` : ''}</p>}
              </div>
              <p className="text-black text-sm shrink-0">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
        {cartItems.length > 3 && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-center pointer-events-none">
            <span className="bg-black text-white text-[11px] px-3 py-1.5 rounded-full shadow-md">Scroll for more items ↓</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mt-5">
        <input type="text" placeholder="Discount code"
          className="flex-1 border border-gray-300 rounded-lg px-3.5 py-3 text-sm text-black placeholder-gray-400 outline-none focus:border-black" />
        <button type="button" className="border border-gray-300 rounded-lg px-5 py-3 text-sm text-gray-400 font-medium">Apply</button>
      </div>

      <div className="mt-5 pt-4 border-t border-gray-200 space-y-2.5 text-sm">
        <div className="flex justify-between">
          <p className="text-gray-500">Subtotal · {itemCount} item{itemCount !== 1 ? 's' : ''}</p>
          <p className="text-black">{formatPrice(cartTotal)}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-500">Shipping</p>
          <p className="text-black">{shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}</p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
        <p className="text-black font-bold text-base">Total</p>
        <p className="text-black font-bold text-lg shrink-0 flex items-baseline gap-1.5">
          <span className="text-gray-400 font-normal text-xs">{currentCurrency.code}</span>
          {formatPrice(grandTotal)}
        </p>
      </div>
    </>
  );

  return (
    <div className="bg-white min-h-screen pt-16">

      {/* ── Mobile collapsible order summary ── */}
      <div className="lg:hidden border-b border-gray-200">
        <button onClick={() => setSummaryOpen(o => !o)}
          className="w-full flex items-center justify-between px-4 py-4">
          <span className="flex items-center gap-1.5 text-black text-sm font-medium">
            Order summary
            <svg className={`w-3.5 h-3.5 transition-transform ${summaryOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
            </svg>
          </span>
          <span className="text-black font-bold text-sm">{formatPrice(grandTotal)}</span>
        </button>
        {summaryOpen && (
          <div className="px-4 pb-5">
            <SummaryContent/>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 lg:py-12">

        <button onClick={() => navigate('/cart')}
          className="hidden lg:flex items-center gap-2 text-gray-400 hover:text-black transition-colors text-sm mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Back to cart
        </button>

        <div className="grid lg:grid-cols-[1fr_380px] gap-10">

          <div>

            {/* Signed-in status — slim, no card */}
            <div className="flex items-center justify-between text-sm mb-6">
              {user ? (
                <>
                  <span className="text-gray-500">Signed in as <span className="text-black font-medium">{user.email}</span></span>
                  <button onClick={() => { logout(); navigate('/auth?redirect=checkout'); }}
                    className="text-gray-400 hover:text-black underline underline-offset-2 text-xs">Sign out</button>
                </>
              ) : (
                <Link to="/auth?redirect=checkout" className="text-black font-medium underline underline-offset-2">
                  Sign in to checkout →
                </Link>
              )}
            </div>

            {/* ── Delivery ── */}
            <h2 className="text-black text-xl font-bold mb-4">Delivery</h2>
            <div className="space-y-3 mb-8">
              <Box label="Country / Region" required select>
                <select value={form.country} onChange={set('country')} autoComplete="country-name"
                  className={boxInput + ' cursor-pointer appearance-none pr-6'}>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </Box>

              <div className="grid sm:grid-cols-2 gap-3">
                <Box label="First name" error={errors.firstName}>
                  <input value={form.firstName} onChange={set('firstName')} placeholder="Optional"
                    autoComplete="given-name" className={boxInput}/>
                </Box>
                <Box label="Last name" required error={errors.lastName}>
                  <input value={form.lastName} onChange={set('lastName')}
                    autoComplete="family-name" className={boxInput}/>
                </Box>
              </div>

              <Box label="Address" required error={errors.address}>
                <input value={form.address} onChange={set('address')}
                  autoComplete="address-line1" className={boxInput}/>
              </Box>

              <Box label="Apartment, suite, etc.">
                <input value={form.address2} onChange={set('address2')} placeholder="Optional"
                  autoComplete="address-line2" className={boxInput}/>
              </Box>

              <div className="grid sm:grid-cols-3 gap-3">
                <Box label="City" required error={errors.city}>
                  <input value={form.city} onChange={set('city')}
                    autoComplete="address-level2" className={boxInput}/>
                </Box>
                <Box label="State">
                  <input value={form.stateRegion} onChange={set('stateRegion')}
                    autoComplete="address-level1" className={boxInput}/>
                </Box>
                <Box label="Postal code">
                  <input value={form.postalCode} onChange={set('postalCode')} placeholder="Optional"
                    autoComplete="postal-code" className={boxInput}/>
                </Box>
              </div>

              <Box label="Phone" required error={errors.phone}>
                <div className="flex items-center">
                  <input type="tel" value={form.phone} onChange={set('phone')}
                    autoComplete="tel" className={boxInput}/>
                  <svg className="w-4 h-4 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
              </Box>

              <label className="flex items-center gap-2.5 pt-1 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 accent-black"/>
                <span className="text-black text-sm">Save this information for next time</span>
              </label>
            </div>

            {/* ── Delivery notes ── */}
            <h2 className="text-black text-xl font-bold mb-4">Delivery Notes <span className="text-gray-400 font-normal text-sm">(optional)</span></h2>
            <div className="mb-8">
              <Box label="Notes for the delivery driver">
                <textarea value={form.notes} onChange={set('notes')} rows={2}
                  placeholder="e.g. Call when nearby · Leave at gate..."
                  className={boxInput + ' resize-none'}/>
              </Box>
            </div>

            {/* ── Shipping method ── */}
            <h2 className="text-black text-xl font-bold mb-4">Shipping method</h2>
            <div className="mb-8">
              <OptionRow selected>
                <span className="text-black text-sm font-medium">Standard</span>
                <span className="text-black text-sm font-medium">{shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}</span>
              </OptionRow>
            </div>

            {/* ── Payment ── */}
            <h2 className="text-black text-xl font-bold mb-1">Payment</h2>
            <p className="text-gray-400 text-xs mb-4">All transactions are secure and encrypted.</p>
            <div className="mb-2">
              <OptionRow disabled>
                <span className="flex items-center gap-2 text-gray-400 text-sm font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" strokeWidth="1.6"/>
                    <line x1="1" y1="10" x2="23" y2="10" strokeWidth="1.6"/>
                  </svg>
                  Card Payment
                </span>
                <span className="text-gray-400 text-xs font-semibold uppercase tracking-wide">Coming Soon</span>
              </OptionRow>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 mb-8">
              <p className="text-gray-400 text-xs text-center">
                Online payment isn't live yet — get your Order ID below and send it to us to confirm and arrange payment.
              </p>
            </div>

            {/* ── Order ID — replaces billing address ── */}
            <h2 className="text-black text-xl font-bold mb-4">Order ID</h2>
            <div className="mb-8">
              {!isFormComplete ? (
                <div className="flex items-center gap-3 border border-gray-200 bg-gray-50 rounded-lg px-4 py-4 text-gray-400 text-sm">
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                  Fill in your delivery details above to get your Order ID.
                </div>
              ) : order ? (
                <div>
                  <div className="border border-gray-300 rounded-lg px-4 py-4 mb-3 text-center">
                    <p className="text-gray-400 text-[11px] uppercase tracking-widest mb-1.5">Your Order ID</p>
                    <div className="flex items-center justify-center gap-3">
                      <span className="font-mono font-black text-2xl tracking-wider text-black">{order.orderNumber}</span>
                      <button onClick={copyOrderId}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors shrink-0">
                        {copied ? 'Copied ✓' : 'Copy'}
                      </button>
                    </div>
                  </div>
                  <button onClick={continueToSocial}
                    className="w-full bg-black text-white font-bold py-4 rounded-lg text-sm hover:opacity-85 transition-opacity">
                    Continue to {orderChannel === 'whatsapp' ? 'WhatsApp' : 'Instagram'}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {orderError && (
                    <div className="px-4 py-2.5 rounded-lg text-xs font-medium bg-red-50 text-red-500 border border-red-200">
                      {orderError}
                    </div>
                  )}
                  <OptionRow onClick={handleWhatsApp} disabled={!!loadingChannel}>
                    <span className="flex items-center gap-2.5 text-black text-sm font-medium">
                      {loadingChannel === 'whatsapp' ? (
                        <svg className="w-4 h-4 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                      )}
                      {loadingChannel === 'whatsapp' ? 'Creating order…' : 'Get Order ID via WhatsApp'}
                    </span>
                  </OptionRow>
                  <OptionRow onClick={handleInstagram} disabled={!!loadingChannel}>
                    <span className="flex items-center gap-2.5 text-black text-sm font-medium">
                      {loadingChannel === 'instagram' ? (
                        <svg className="w-4 h-4 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-fuchsia-500" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      )}
                      {loadingChannel === 'instagram' ? 'Creating order…' : 'Get Order ID via Instagram'}
                    </span>
                  </OptionRow>
                  <p className="text-gray-400 text-[11px] pt-1">
                    We'll open WhatsApp or Instagram with your Order ID ready to send — we'll confirm and arrange payment manually.
                  </p>
                </div>
              )}
            </div>

            {/* ── Bottom mobile order summary — final review before the Order ID buttons ── */}
            <div className="lg:hidden mb-8 border border-gray-200 rounded-lg p-4">
              <SummaryContent/>
            </div>

          </div>

          {/* ── Desktop sidebar ── */}
          <div className="hidden lg:block self-start sticky top-24">
            <SummaryContent/>
          </div>
        </div>
      </div>
    </div>
  );
}