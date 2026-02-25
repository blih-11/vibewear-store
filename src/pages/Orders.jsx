import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserOrders } from '../lib/api';

const STATUS_STYLES = {
  pending:   'bg-yellow-500/10 border-yellow-500/25 text-yellow-400',
  completed: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400',
  cancelled: 'bg-red-500/10 border-red-500/25 text-red-400',
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getUserOrders(user.uid)
      .then(data => { if (data.success) setOrders(data.orders); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return (
    <div className="bg-brand-bg min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-white/50 mb-4">Sign in to view your orders</p>
        <Link to="/auth" className="bg-white text-black font-bold px-6 py-3 rounded-xl text-sm hover:bg-white/90 transition-colors">Sign In</Link>
      </div>
    </div>
  );

  return (
    <div className="bg-brand-bg min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-3xl mx-auto">

        <div className="mb-8">
          <h1 className="text-white font-black text-3xl">Order History</h1>
          <p className="text-white/40 text-sm mt-1">{user.email}</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 animate-pulse">
                <div className="h-4 bg-white/10 rounded w-1/3 mb-3"/>
                <div className="h-3 bg-white/5 rounded w-1/2"/>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
            </div>
            <p className="text-white/40 mb-2">No orders yet</p>
            <p className="text-white/20 text-sm mb-6">Your orders will appear here once you've made a purchase</p>
            <Link to="/products" className="bg-white text-black font-bold px-6 py-3 rounded-xl text-sm hover:bg-white/90 transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order._id} className="bg-[#0f0f0f] border border-white/[0.07] rounded-2xl overflow-hidden">

                {/* Order header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                  <div>
                    <p className="text-white/30 text-xs mb-1">{formatDate(order.createdAt)}</p>
                    {order.txRef && (
                      <p className="text-white/20 text-[11px] font-mono">Ref: {order.txRef}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-white font-black text-lg">
                      ${order.total?.toFixed(2)}
                    </p>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border capitalize ${STATUS_STYLES[order.status] || STATUS_STYLES.pending}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="px-6 py-4 space-y-3">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-14 object-cover rounded-xl shrink-0 bg-white/5"
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium line-clamp-1">{item.name}</p>
                        <p className="text-white/40 text-xs mt-0.5">{item.size} · {item.color} · x{item.quantity}</p>
                      </div>
                      <p className="text-white/70 text-sm font-semibold shrink-0">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="px-6 py-3 bg-white/[0.02] border-t border-white/[0.06] flex items-center justify-between text-xs text-white/30">
                  <span>{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</span>
                  <span>
                    Subtotal ${order.subtotal?.toFixed(2)} · Shipping {order.shipping === 0 ? 'FREE' : `$${order.shipping?.toFixed(2)}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
