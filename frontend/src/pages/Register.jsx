import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to register');
    }
  };

  return (
    <div className="min-h-[70vh] grid place-items-center px-4 py-16">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-white rounded-[2rem] p-8 shadow-luxe">
        <p className="text-xs tracking-[0.3em] uppercase text-gold-600">Join the atelier</p>
        <h1 className="font-display text-4xl mt-2">Create account</h1>
        {error && <p className="mt-4 text-sm text-rose-700">{error}</p>}
        <label className="block mt-6 text-sm">Name</label>
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full mt-1 rounded-xl border border-nude-300 px-3 py-2"
        />
        <label className="block mt-4 text-sm">Email</label>
        <input
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full mt-1 rounded-xl border border-nude-300 px-3 py-2"
        />
        <label className="block mt-4 text-sm">Password</label>
        <input
          type="password"
          required
          minLength={6}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full mt-1 rounded-xl border border-nude-300 px-3 py-2"
        />
        <button className="w-full mt-6 py-3 rounded-full bg-slateink-900 text-nude-50 text-xs tracking-[0.25em] uppercase">
          Register
        </button>
        <p className="text-sm mt-4 text-center">
          Already a member? <Link to="/login" className="text-gold-600">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
