import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const CHANNEL_INFO = {
  whatsapp: {
    name: 'WhatsApp',
    color: '#25D366',
    instructions: 'We opened WhatsApp with your order details and Order ID pre-filled — just hit send. If it didn\'t open, copy your Order ID below and message us directly.',
  },
  instagram: {
    name: 'Instagram',
    color: '#E4405F',
    instructions: 'We opened Instagram DMs and copied your Order ID to your clipboard — paste it into the message so we can find your order. If it didn\'t open, copy the Order ID below and send it to us on Instagram.',
  },
};

export default function OrderSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!state) navigate('/');
  }, []);

  if (!state) return null;

  const { txRef, transactionId, orderNumber, channel, amount, customer, items } = state;
  const isManual = !!orderNumber && !!channel;
  const channelInfo = CHANNEL_INFO[channel];

  const copyOrderId = async () => {
    try {
      await navigator.clipboard.writeText(orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard blocked — user can still select/copy manually */ }
  };

  return (
    <div className="bg-brand-bg min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-lg w-full">

        {/* Success animation */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mb-5">
            <svg className="w-9 h-9 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m5 13 4 4L19 7"/>
            </svg>
          </div>
          <h1 className="text-brand-cream font-black text-3xl md:text-4xl mb-2">
            {isManual ? 'Order Received!' : 'Order Confirmed!'}
          </h1>
          <p className="text-brand-muted text-sm">
            {isManual
              ? `Thank you, ${customer.firstName}! One more step — confirm via ${channelInfo?.name}.`
              : `Thank you, ${customer.firstName}! Your payment was successful.`}
          </p>
        </div>

        {/* Order ID — manual channel flow */}
        {isManual && (
          <div className="rounded-2xl p-6 mb-5 border" style={{ background: `${channelInfo?.color}0F`, borderColor: `${channelInfo?.color}40` }}>
            <p className="text-brand-muted text-xs mb-2">Your Order ID — send this to us on {channelInfo?.name}</p>
            <div className="flex items-center gap-3">
              <span className="font-mono font-black text-2xl tracking-wider" style={{ color: channelInfo?.color }}>{orderNumber}</span>
              <button onClick={copyOrderId}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all"
                style={{ borderColor: `${channelInfo?.color}50`, color: channelInfo?.color }}>
                {copied ? 'Copied ✓' : 'Copy'}
              </button>
            </div>
            <p className="text-brand-muted text-xs mt-3 leading-relaxed">{channelInfo?.instructions}</p>
          </div>
        )}

        {/* Order details card */}
        <div className="bg-gray-100 border border-gray-200 rounded-2xl p-6 mb-5">
          <h2 className="text-brand-cream font-bold mb-4">Order Details</h2>

          <div className="space-y-2.5 text-sm mb-5">
            {isManual && (
              <div className="flex justify-between">
                <span className="text-brand-muted">Order ID</span>
                <span className="text-brand-cream font-mono text-xs font-bold">{orderNumber}</span>
              </div>
            )}
            {txRef && (
              <div className="flex justify-between">
                <span className="text-brand-muted">Reference</span>
                <span className="text-brand-cream font-mono text-xs">{txRef}</span>
              </div>
            )}
            {transactionId && (
              <div className="flex justify-between">
                <span className="text-brand-muted">Transaction ID</span>
                <span className="text-brand-cream font-mono text-xs">{transactionId}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-brand-muted">{isManual ? 'Order Total' : 'Amount Paid'}</span>
              <span className="text-brand-cream font-bold">{amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted">Email</span>
              <span className="text-brand-cream">{customer.email}</span>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <p className="text-brand-muted text-xs mb-3">Items Ordered</p>
            <div className="space-y-2.5">
              {items?.map(item => (
                <div key={item.key} className="flex gap-3 items-center">
                  <img src={item.image} alt={item.name} className="w-10 h-12 object-cover rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-brand-cream text-xs font-medium line-clamp-1">{item.name}</p>
                    <p className="text-brand-muted text-xs">{item.size} · {item.color} · x{item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shipping */}
        <div className="bg-gray-100 border border-gray-200 rounded-2xl p-5 mb-8">
          <p className="text-brand-muted text-xs mb-1">Delivering To</p>
          <p className="text-brand-cream text-sm font-medium">{customer.firstName} {customer.lastName}</p>
          <p className="text-brand-muted text-xs mt-0.5">
            {customer.address}, {customer.city}{customer.region ? `, ${customer.region}` : ''}
          </p>
          <p className="text-brand-muted text-xs mt-0.5">{customer.phone}</p>
          {isManual ? (
            <p className="text-amber-400 text-xs mt-3 font-medium">⏳ We'll confirm your order once we receive your message</p>
          ) : (
            <p className="text-green-400 text-xs mt-3 font-medium">📦 Estimated delivery: 3–7 business days</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/products"
            className="flex-1 bg-white text-black font-bold py-3.5 rounded-xl text-center hover:bg-black hover:text-white transition-colors text-sm">
            Continue Shopping
          </Link>
          <Link to="/"
            className="flex-1 border border-gray-200 text-brand-muted py-3.5 rounded-xl text-center hover:border-gray-400 hover:text-brand-cream transition-all text-sm">
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}
