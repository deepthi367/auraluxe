import { useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Account() {
  const { user, persist, refreshUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [msg, setMsg] = useState('');

  const save = async (e) => {
    e.preventDefault();
    const { data } = await api.put('/users/profile', form);
    persist({ ...data, token: user.token });
    setMsg('Profile updated');
  };

  const removeAddress = async (id) => {
    await api.delete(`/users/addresses/${id}`);
    await refreshUser();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="font-display text-4xl">Your profile</h1>
      <p className="text-sm text-slateink-700/60 mt-1">{user.email}</p>
      <form onSubmit={save} className="bg-white rounded-3xl p-6 mt-8 space-y-4">
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full rounded-xl border px-3 py-2"
        />
        <input
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="Phone"
          className="w-full rounded-xl border px-3 py-2"
        />
        <button className="px-6 py-2 rounded-full bg-slateink-900 text-white text-xs tracking-widest uppercase">Save</button>
        {msg && <p className="text-sm text-gold-600">{msg}</p>}
      </form>
      <h2 className="font-display text-2xl mt-10">Addresses</h2>
      <div className="mt-4 space-y-3">
        {user.addresses?.map((a) => (
          <div key={a._id} className="bg-white rounded-2xl p-4 flex justify-between">
            <p className="text-sm">
              {a.fullName}, {a.line1}, {a.city} {a.pincode}
            </p>
            <button onClick={() => removeAddress(a._id)} className="text-xs text-rose-700">
              Remove
            </button>
          </div>
        ))}
        {(!user.addresses || user.addresses.length === 0) && (
          <p className="text-sm text-slateink-700/60">Add an address at checkout.</p>
        )}
      </div>
    </div>
  );
}
