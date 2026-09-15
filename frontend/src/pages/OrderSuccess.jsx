import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client';

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`).then(({ data }) => setOrder(data));
  }, [id]);

  if (!order) return <p className="p-16 text-center">Loading…</p>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <p className="text-xs tracking-[0.3em] uppercase text-gold-600">Thank you</p>
      <h1 className="font-display text-5xl mt-2">Your order is placed</h1>
      <p className="mt-4 text-sm text-slateink-700/70">#{order._id}</p>
      <p className="mt-2">Status: {order.status} · Paid: {order.isPaid ? 'Yes' : 'Pending'}</p>
      <p className="mt-6 text-2xl">₹{order.totalPrice}</p>
      <ul className="mt-6 text-left bg-white rounded-3xl p-6 space-y-2">
        {order.items.map((i) => (
          <li key={i._id} className="flex justify-between text-sm">
            <span>
              {i.name} × {i.qty}
            </span>
            <span>₹{i.price * i.qty}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
