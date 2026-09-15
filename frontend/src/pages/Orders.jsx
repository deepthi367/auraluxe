import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, ArrowRight, ChevronRight, ShoppingBag } from 'lucide-react';
import api from '../api/client';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/orders/mine')
      .then(({ data }) => setOrders(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status) => {
    const s = (status || 'Processing').toLowerCase();
    if (s.includes('delivered')) {
      return <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider">Delivered</span>;
    }
    if (s.includes('shipped')) {
      return <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold uppercase tracking-wider">Shipped</span>;
    }
    if (s.includes('cancelled')) {
      return <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-semibold uppercase tracking-wider">Cancelled</span>;
    }
    return <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold uppercase tracking-wider">{status || 'Processing'}</span>;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl text-slateink-900">Your Order History</h1>
          <p className="text-sm text-slateink-700/60 mt-1">Track and manage your luxury beauty purchases.</p>
        </div>
        <Link
          to="/shop"
          className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-600 hover:text-gold-500 transition"
        >
          Browse Collection <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-nude-200">
          <p className="text-gold-600 font-medium">Fetching your orders…</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-nude-200 shadow-sm max-w-md mx-auto">
          <div className="h-16 w-16 bg-nude-100 text-gold-600 rounded-full grid place-items-center mx-auto mb-4">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h2 className="font-display text-2xl text-slateink-900 mb-2">No Orders Yet</h2>
          <p className="text-xs text-slateink-700/60 mb-6 leading-relaxed">
            You haven't placed any orders with AuraLuxe yet. Discover our curated cosmetics and skincare range today.
          </p>
          <Link
            to="/shop"
            className="inline-block px-8 py-3 rounded-full bg-slateink-900 text-white text-xs font-semibold tracking-widest uppercase hover:bg-slateink-800 transition shadow-sm"
          >
            Explore The Shop
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((o) => (
            <div key={o._id} className="bg-white rounded-3xl p-6 border border-nude-200 shadow-sm hover:shadow-md transition">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-nude-100 pb-4 mb-4">
                <div>
                  <span className="text-[11px] text-slateink-700/50 uppercase tracking-widest block font-medium">Order ID</span>
                  <span className="font-mono text-xs font-semibold text-slateink-900">#{o._id.slice(-8).toUpperCase()}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slateink-700/50 uppercase tracking-widest block font-medium">Date Placed</span>
                  <span className="text-xs text-slateink-800 flex items-center gap-1">
                    <Clock className="h-3 w-3 text-gold-600" />
                    {new Date(o.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slateink-700/50 uppercase tracking-widest block font-medium">Total Price</span>
                  <span className="text-sm font-semibold text-slateink-900">₹{o.totalPrice?.toLocaleString()}</span>
                </div>
                <div>{getStatusBadge(o.status)}</div>
              </div>

              {/* Order Items */}
              <div className="space-y-3">
                {o.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-4 text-sm bg-nude-50/60 p-3 rounded-2xl">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="h-12 w-12 rounded-xl object-cover border border-nude-200" />
                      )}
                      <div>
                        <p className="font-medium text-slateink-900 text-xs">{item.name}</p>
                        <p className="text-[11px] text-slateink-700/60">Qty: {item.qty}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slateink-800">₹{(item.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-nude-100 flex justify-end">
                <Link
                  to={`/order-success/${o._id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-gold-600 hover:text-gold-500 transition"
                >
                  View Details & Receipt <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
