import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const TAX_RATE = 0.18;
const FREE_SHIP = 1999;
const SHIP = 99;

export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState('');
  const [applied, setApplied] = useState(null);
  const [couponMsg, setCouponMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(user?.addresses?.find((a) => a.isDefault)?._id || user?.addresses?.[0]?._id);
  const [newAddr, setNewAddr] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    label: 'Home',
  });

  const preview = useMemo(() => {
    const discount = applied?.discount || 0;
    const taxable = Math.max(subtotal - discount, 0);
    const taxPrice = Math.round(taxable * TAX_RATE);
    const shippingPrice = taxable >= FREE_SHIP || taxable === 0 ? 0 : SHIP;
    const totalPrice = taxable + taxPrice + shippingPrice;
    return { discount, taxPrice, shippingPrice, totalPrice };
  }, [subtotal, applied]);

  const applyCoupon = async () => {
    setCouponMsg('');
    try {
      const { data } = await api.post('/orders/coupon', { code: coupon, itemsPrice: subtotal });
      setApplied(data);
      setCouponMsg(data.message);
    } catch (err) {
      setApplied(null);
      setCouponMsg(err.response?.data?.message || 'Invalid coupon');
    }
  };

  const shippingAddress = () => {
    const saved = user?.addresses?.find((a) => a._id === selected);
    if (saved) {
      return {
        fullName: saved.fullName,
        phone: saved.phone,
        line1: saved.line1,
        line2: saved.line2,
        city: saved.city,
        state: saved.state,
        pincode: saved.pincode,
      };
    }
    return newAddr;
  };

  const placeOrder = async (paymentResult) => {
    const { data } = await api.post('/orders', {
      items: items.map((i) => ({ product: i.product, qty: i.qty })),
      shippingAddress: shippingAddress(),
      couponCode: applied?.couponApplied || coupon,
      paymentResult,
    });
    clear();
    navigate(`/order-success/${data._id}`);
  };

  const pay = async () => {
    setError('');
    const addr = shippingAddress();
    if (!addr.fullName || !addr.phone || !addr.line1 || !addr.city || !addr.state || !addr.pincode) {
      setError('Please complete a delivery address.');
      return;
    }
    if (items.length === 0) return;
    setBusy(true);
    try {
      const { data: rz } = await api.post('/payment/create-order', {
        items: items.map((i) => ({ product: i.product, qty: i.qty })),
        couponCode: applied?.couponApplied || coupon,
      });

      if (rz.demo) {
        await placeOrder({ id: rz.orderId, status: 'demo_captured', method: 'demo' });
        return;
      }

      const { data: keyData } = await api.get('/payment/key');
      const options = {
        key: keyData.key,
        amount: rz.amount,
        currency: rz.currency,
        name: 'AuraLuxe',
        description: 'The Beauty Haven',
        order_id: rz.orderId,
        handler: async (response) => {
          await api.post('/payment/verify', response);
          await placeOrder({
            id: response.razorpay_payment_id,
            status: 'captured',
            method: 'razorpay',
          });
        },
        prefill: { name: user.name, email: user.email, contact: addr.phone },
        theme: { color: '#1C1917' },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || 'Payment could not start');
    } finally {
      setBusy(false);
    }
  };

  const saveAddress = async (e) => {
    e.preventDefault();
    await api.post('/users/addresses', { ...newAddr, isDefault: true });
    await refreshUser();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-12 grid lg:grid-cols-5 gap-10">
      <div className="lg:col-span-3 space-y-6">
        <h1 className="font-display text-4xl">Checkout</h1>
        <section className="bg-white rounded-3xl p-6">
          <h2 className="font-display text-2xl mb-4">Delivery</h2>
          {user?.addresses?.length > 0 && (
            <div className="space-y-3 mb-6">
              {user.addresses.map((a) => (
                <label key={a._id} className="flex gap-3 items-start border border-nude-200 rounded-2xl p-3 cursor-pointer">
                  <input type="radio" checked={selected === a._id} onChange={() => setSelected(a._id)} />
                  <span className="text-sm">
                    <strong>{a.fullName}</strong> · {a.phone}
                    <br />
                    {a.line1}, {a.city} {a.pincode}
                  </span>
                </label>
              ))}
            </div>
          )}
          <form onSubmit={saveAddress} className="grid sm:grid-cols-2 gap-3">
            {['fullName', 'phone', 'line1', 'line2', 'city', 'state', 'pincode'].map((k) => (
              <input
                key={k}
                placeholder={k}
                value={newAddr[k]}
                onChange={(e) => {
                  setSelected(null);
                  setNewAddr({ ...newAddr, [k]: e.target.value });
                }}
                className={`rounded-xl border border-nude-300 px-3 py-2 text-sm ${k === 'line1' || k === 'line2' ? 'sm:col-span-2' : ''}`}
              />
            ))}
            <button type="submit" className="sm:col-span-2 text-xs tracking-widest uppercase border border-gold-500 rounded-full py-2">
              Save address
            </button>
          </form>
        </section>
      </div>

      <aside className="lg:col-span-2 bg-white rounded-3xl p-6 h-fit">
        <h2 className="font-display text-2xl">Order summary</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {items.map((i) => (
            <li key={i.product} className="flex justify-between">
              <span>
                {i.name} × {i.qty}
              </span>
              <span>₹{i.price * i.qty}</span>
            </li>
          ))}
        </ul>
        <div className="flex gap-2 mt-5">
          <input
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            placeholder="Coupon code"
            className="flex-1 rounded-full border px-3 py-2 text-sm"
          />
          <button type="button" onClick={applyCoupon} className="px-4 rounded-full bg-nude-200 text-xs uppercase tracking-widest">
            Apply
          </button>
        </div>
        {couponMsg && <p className="text-xs mt-2 text-gold-600">{couponMsg}</p>}
        <div className="mt-5 space-y-2 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal}</span></div>
          <div className="flex justify-between"><span>Discount</span><span>− ₹{preview.discount}</span></div>
          <div className="flex justify-between"><span>GST (18%)</span><span>₹{preview.taxPrice}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>{preview.shippingPrice ? `₹${preview.shippingPrice}` : 'Complimentary'}</span></div>
          <div className="flex justify-between font-medium text-base pt-2 border-t"><span>Total</span><span>₹{preview.totalPrice}</span></div>
        </div>
        {error && <p className="text-sm text-rose-700 mt-3">{error}</p>}
        <button
          disabled={busy || items.length === 0}
          onClick={pay}
          className="w-full mt-6 py-3 rounded-full bg-slateink-900 text-nude-50 text-xs tracking-[0.25em] uppercase disabled:opacity-40"
        >
          {busy ? 'Opening atelier pay…' : 'Pay securely'}
        </button>
        <p className="text-[11px] text-slateink-700/50 mt-3">
          Razorpay test mode when keys are set. Without keys, a demo capture completes the order locally.
        </p>
      </aside>
    </div>
  );
}
