import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to sign in');
    }
  };

  return (
    <div className="min-h-[70vh] grid place-items-center px-4 py-16">
      <form onSubmit={onSubmit} className="w-full max-w-md bg-white rounded-[2rem] p-8 shadow-luxe">
        <p className="text-xs tracking-[0.3em] uppercase text-gold-600">Welcome back</p>
        <h1 className="font-display text-4xl mt-2">Sign in</h1>
        {error && <p className="mt-4 text-sm text-rose-700">{error}</p>}
        <label className="block mt-6 text-sm">Email</label>
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
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full mt-1 rounded-xl border border-nude-300 px-3 py-2"
        />
        <button className="w-full mt-6 py-3 rounded-full bg-slateink-900 text-nude-50 text-xs tracking-[0.25em] uppercase">
          Enter the haven
        </button>
        <p className="text-sm mt-4 text-center">
          New here? <Link to="/register" className="text-gold-600">Create an account</Link>
        </p>
        <p className="text-[11px] text-slateink-700/50 mt-4 text-center">
          Demo · admin@auraluxe.com / Admin@123 · aanya@auraluxe.com / Guest@123
        </p>
      </form>
    </div>
  );
}
