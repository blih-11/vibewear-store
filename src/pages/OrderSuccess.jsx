import { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

export default function OrderSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state) navigate('/');
  }, []);

  if (!state) return null;

  const { txRef, transactionId, amount, customer, items } = state;

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
          <h1 className="text-brand-cream font-black text-3xl md:text-4xl mb-2">Order Confirmed!</h1>
          <p className="text-brand-muted text-sm">
            Thank you, {customer.firstName}! Your payment was successful.
          </p>
        </div>

        {/* Order details card */}
        <div className="bg-white/4 border border-white/8 rounded-2xl p-6 mb-5">
          <h2 className="text-brand-cream font-bold mb-4">Order Details</h2>

          <div className="space-y-2.5 text-sm mb-5">
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
              <span className="text-brand-muted">Amount Paid</span>
              <span className="text-brand-cream font-bold">{amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-muted">Email</span>
              <span className="text-brand-cream">{customer.email}</span>
            </div>
          </div>

          <div className="border-t border-white/8 pt-4">
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
        <div className="bg-white/3 border border-white/8 rounded-2xl p-5 mb-8">
          <p className="text-brand-muted text-xs mb-1">Delivering To</p>
          <p className="text-brand-cream text-sm font-medium">{customer.firstName} {customer.lastName}</p>
          <p className="text-brand-muted text-xs mt-0.5">
            {customer.address}, {customer.city}{customer.region ? `, ${customer.region}` : ''}
          </p>
          <p className="text-brand-muted text-xs mt-0.5">{customer.phone}</p>
          <p className="text-green-400 text-xs mt-3 font-medium">📦 Estimated delivery: 3–7 business days</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/products"
            className="flex-1 bg-white text-black font-bold py-3.5 rounded-xl text-center hover:bg-brand-cream transition-colors text-sm">
            Continue Shopping
          </Link>
          <Link to="/"
            className="flex-1 border border-white/12 text-brand-muted py-3.5 rounded-xl text-center hover:border-white/30 hover:text-brand-cream transition-all text-sm">
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}
