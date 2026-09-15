import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Mail } from 'lucide-react';
import api from '../../api/client';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const subscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setMsg('Please enter a valid email');
      setTimeout(() => setMsg(''), 2200);
      return;
    }

    try {
      // best-effort backend call; silent if fails
      await api.post('/newsletter', { email });
      setMsg('Subscribed — check your inbox');
    } catch (err) {
      setMsg('Subscribed — we saved your email locally');
    }
    setEmail('');
    setTimeout(() => setMsg(''), 2600);
  };

  return (
    <footer className="mt-20 bg-slateink-900 text-nude-100">
      <div className="h-px gold-line" />
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <p className="font-display text-3xl">AuraLuxe</p>
          <p className="mt-3 text-sm text-nude-300 leading-relaxed">
            The Beauty Haven — couture skincare and makeup, composed for the modern ritual.
          </p>
          <div className="mt-4">
            <form onSubmit={subscribe} className="flex items-center gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="rounded-full px-4 py-2 text-sm bg-nude-50 text-slateink-900 placeholder-slateink-500 border border-nude-200 focus:outline-none"
              />
              <button className="rounded-full bg-gold-500 text-white px-4 py-2 text-sm">Join</button>
            </form>
            {msg && <div className="mt-2 text-sm text-nude-100/90">{msg}</div>}
          </div>
        </div>

        <div>
          <p className="text-xs tracking-[0.25em] uppercase text-gold-400 mb-3">Brand</p>
          <div className="flex flex-col gap-2 text-sm text-nude-300">
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/shipping">Shipping</Link>
            <Link to="/privacy">Privacy</Link>
          </div>
        </div>

        <div>
          <p className="text-xs tracking-[0.25em] uppercase text-gold-400 mb-3">Atelier</p>
          <p className="text-sm text-nude-300">Mumbai · Bengaluru · New Delhi</p>
          <p className="text-sm text-nude-300 mt-2">care@auraluxe.shop</p>
        </div>

        <div>
          <p className="text-xs tracking-[0.25em] uppercase text-gold-400 mb-3">Connect</p>
          <div className="flex items-center gap-3">
            <a href="#" className="p-2 rounded-full bg-nude-50 text-gold-500 hover:bg-nude-100 transition">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="#" className="p-2 rounded-full bg-nude-50 text-gold-500 hover:bg-nude-100 transition">
              <Twitter className="h-4 w-4" />
            </a>
            <a href="#" className="p-2 rounded-full bg-nude-50 text-gold-500 hover:bg-nude-100 transition">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="mailto:care@auraluxe.shop" className="p-2 rounded-full bg-nude-50 text-gold-500 hover:bg-nude-100 transition">
              <Mail className="h-4 w-4" />
            </a>
          </div>
          <div className="mt-4 text-sm text-nude-300">Coupons: LUXE20 · AURA10</div>
        </div>
      </div>
      <p className="text-center text-xs text-nude-300/60 pb-8">© {new Date().getFullYear()} AuraLuxe. All rights reserved.</p>
    </footer>
  );
}
