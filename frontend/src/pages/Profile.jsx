import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Phone, Mail, MapPin, Package, HelpCircle, CheckCircle2, Trash2 } from 'lucide-react';
import WomanProfileIcon from '../components/icons/WomanProfileIcon';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, persist, refreshUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/users/profile', form);
      persist({ ...data, token: user.token });
      setMsg('Profile details updated successfully');
      setTimeout(() => setMsg(''), 4000);
    } catch (err) {
      setMsg('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const removeAddress = async (id) => {
    try {
      await api.delete(`/users/addresses/${id}`);
      await refreshUser();
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-12">
      {/* Header Badge */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-nude-200 mb-8 flex flex-col sm:flex-row items-center gap-6">
        <div className="h-20 w-20 rounded-full bg-slateink-900 text-gold-400 font-display text-3xl grid place-items-center uppercase shadow-luxe shrink-0">
          {user.name ? user.name.charAt(0) : 'U'}
        </div>
        <div className="text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <h1 className="font-display text-3xl font-semibold text-slateink-900">{user.name}</h1>
            <span className="px-3 py-0.5 rounded-full bg-nude-100 text-gold-600 text-xs font-semibold uppercase tracking-wider">
              {user.role === 'admin' ? 'Atelier Admin' : 'Valued Member'}
            </span>
          </div>
          <p className="text-sm text-slateink-700/70 mt-1 flex items-center justify-center sm:justify-start gap-1.5">
            <Mail className="h-3.5 w-3.5 text-gold-600" />
            {user.email}
          </p>
        </div>
        <div className="flex gap-2 border-t sm:border-t-0 sm:border-l border-nude-200 pt-4 sm:pt-0 sm:pl-6">
          <Link
            to="/orders"
            className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-nude-50 hover:bg-nude-100 transition text-xs font-medium text-slateink-800"
          >
            <Package className="h-5 w-5 text-gold-600" />
            <span>Orders</span>
          </Link>
          <Link
            to="/wishlist"
            className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-nude-50 hover:bg-nude-100 transition text-xs font-medium text-slateink-800"
          >
            <WomanProfileIcon className="h-5 w-5 text-gold-600" filled={true} />
            <span>Wishlist</span>
          </Link>
          <Link
            to="/help"
            className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-nude-50 hover:bg-nude-100 transition text-xs font-medium text-slateink-800"
          >
            <HelpCircle className="h-5 w-5 text-gold-600" />
            <span>Help</span>
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Personal Details Form */}
        <section className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-nude-200">
          <h2 className="font-display text-2xl text-slateink-900 mb-2 flex items-center gap-2">
            <User className="h-5 w-5 text-gold-600" />
            Personal Details
          </h2>
          <p className="text-xs text-slateink-700/60 mb-6">Update your account information below.</p>

          <form onSubmit={save} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slateink-700/70 mb-1.5 font-medium">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-2xl border border-nude-300 px-4 py-2.5 text-sm bg-nude-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-500 transition"
                required
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slateink-700/70 mb-1.5 font-medium">Email Address</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full rounded-2xl border border-nude-200 px-4 py-2.5 text-sm bg-nude-100/60 text-slateink-700/60 cursor-not-allowed"
              />
              <span className="text-[11px] text-slateink-700/50 mt-1 block">Email address cannot be changed</span>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slateink-700/70 mb-1.5 font-medium">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slateink-700/40" />
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 9876543210"
                  className="w-full rounded-2xl border border-nude-300 pl-10 pr-4 py-2.5 text-sm bg-nude-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-500 transition"
                />
              </div>
            </div>

            {msg && (
              <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 p-3 rounded-2xl flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                {msg}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 rounded-full bg-slateink-900 hover:bg-slateink-800 text-white text-xs font-semibold tracking-widest uppercase shadow-sm transition disabled:opacity-50 mt-2"
            >
              {saving ? 'Saving Changes…' : 'Save Details'}
            </button>
          </form>
        </section>

        {/* Saved Addresses */}
        <section className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-nude-200">
          <h2 className="font-display text-2xl text-slateink-900 mb-2 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-gold-600" />
            Saved Addresses
          </h2>
          <p className="text-xs text-slateink-700/60 mb-6">Manage your primary shipping and delivery destinations.</p>

          <div className="space-y-4">
            {user.addresses?.map((a) => (
              <div key={a._id} className="bg-nude-50/70 border border-nude-200 rounded-2xl p-4 flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm text-slateink-900">{a.fullName}</span>
                    {a.isDefault && (
                      <span className="text-[10px] bg-gold-500 text-white font-semibold px-2 py-0.5 rounded-full uppercase">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slateink-700/80 leading-relaxed">
                    {a.line1} {a.line2 && `, ${a.line2}`}
                    <br />
                    {a.city}, {a.state} - {a.pincode}
                  </p>
                  <p className="text-xs text-slateink-700/60 mt-1">Ph: {a.phone}</p>
                </div>
                <button
                  onClick={() => removeAddress(a._id)}
                  className="p-2 text-rose-600 hover:bg-rose-100/60 rounded-xl transition shrink-0"
                  aria-label="Remove address"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}

            {(!user.addresses || user.addresses.length === 0) && (
              <div className="text-center py-8 bg-nude-50/50 rounded-2xl border border-dashed border-nude-300">
                <MapPin className="h-8 w-8 text-gold-500/50 mx-auto mb-2" />
                <p className="text-sm font-medium text-slateink-800">No saved addresses</p>
                <p className="text-xs text-slateink-700/60 mt-1 max-w-xs mx-auto">
                  Addresses saved during checkout will automatically appear here.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
