import { useEffect, useState } from 'react';
import api from '../api/client';

const emptyProduct = {
  name: '',
  slug: '',
  brand: 'AuraLuxe',
  category: 'Skincare',
  description: '',
  shortDescription: '',
  price: 1990,
  compareAtPrice: 2290,
  images: [''],
  ingredients: [''],
  stock: 20,
  rating: 4.5,
  numReviews: 0,
  tags: [],
  trending: false,
};

export default function Admin() {
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const [{ data: p }, { data: o }] = await Promise.all([
      api.get('/products', { params: { limit: 100 } }),
      api.get('/orders'),
    ]);
    setProducts(p.products);
    setOrders(o);
  };

  useEffect(() => {
    load();
  }, []);

  const slugify = (name) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const saveProduct = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      slug: form.slug || slugify(form.name),
      images: (Array.isArray(form.images) ? form.images : String(form.images).split(',')).map((s) => s.trim()).filter(Boolean),
      ingredients: (Array.isArray(form.ingredients) ? form.ingredients : String(form.ingredients).split(',')).map((s) => s.trim()).filter(Boolean),
      price: Number(form.price),
      compareAtPrice: Number(form.compareAtPrice) || undefined,
      stock: Number(form.stock),
    };
    if (editing) await api.put(`/products/${editing}`, payload);
    else await api.post('/products', payload);
    setForm(emptyProduct);
    setEditing(null);
    load();
  };

  const edit = (p) => {
    setEditing(p._id);
    setForm({
      ...p,
      images: p.images,
      ingredients: p.ingredients,
    });
    setTab('products');
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    load();
  };

  const setStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    load();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="font-display text-4xl">Atelier Admin</h1>
      <div className="flex gap-3 mt-6">
        <button onClick={() => setTab('products')} className={`px-4 py-2 rounded-full ${tab === 'products' ? 'bg-slateink-900 text-white' : 'bg-white'}`}>
          Products
        </button>
        <button onClick={() => setTab('orders')} className={`px-4 py-2 rounded-full ${tab === 'orders' ? 'bg-slateink-900 text-white' : 'bg-white'}`}>
          Orders
        </button>
      </div>

      {tab === 'products' && (
        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          <form onSubmit={saveProduct} className="bg-white rounded-3xl p-6 space-y-3">
            <h2 className="font-display text-2xl">{editing ? 'Update product' : 'Create product'}</h2>
            <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border rounded-xl px-3 py-2" />
            <input placeholder="Slug (optional)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full border rounded-xl px-3 py-2" />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border rounded-xl px-3 py-2">
              {['Facewashes', 'Skincare', 'Luxury Makeup', 'Serums', 'Sunscreens', 'Lipsticks'].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <textarea required placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border rounded-xl px-3 py-2 h-24" />
            <div className="grid grid-cols-3 gap-2">
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="border rounded-xl px-3 py-2" />
              <input type="number" value={form.compareAtPrice} onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })} className="border rounded-xl px-3 py-2" />
              <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="border rounded-xl px-3 py-2" />
            </div>
            <input
              placeholder="Image URLs, comma separated"
              value={Array.isArray(form.images) ? form.images.join(', ') : form.images}
              onChange={(e) => setForm({ ...form, images: e.target.value })}
              className="w-full border rounded-xl px-3 py-2"
            />
            <input
              placeholder="Ingredients, comma separated"
              value={Array.isArray(form.ingredients) ? form.ingredients.join(', ') : form.ingredients}
              onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
              className="w-full border rounded-xl px-3 py-2"
            />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.trending} onChange={(e) => setForm({ ...form, trending: e.target.checked })} />
              Trending
            </label>
            <button className="w-full py-3 rounded-full bg-gold-500 text-slateink-900 text-xs tracking-widest uppercase">
              {editing ? 'Update' : 'Create'}
            </button>
          </form>
          <div className="space-y-3">
            {products.map((p) => (
              <div key={p._id} className="bg-white rounded-2xl p-4 flex gap-3 items-center">
                <img src={p.images[0]} alt="" className="h-14 w-14 rounded-xl object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-slateink-700/50">₹{p.price} · stock {p.stock}</p>
                </div>
                <button onClick={() => edit(p)} className="text-xs">Edit</button>
                <button onClick={() => remove(p._id)} className="text-xs text-rose-700">Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div className="mt-8 space-y-3">
          {orders.map((o) => (
            <div key={o._id} className="bg-white rounded-2xl p-4 flex flex-wrap gap-3 items-center justify-between">
              <div>
                <p className="text-sm font-medium">{o.user?.name} · ₹{o.totalPrice}</p>
                <p className="text-xs text-slateink-700/50">{o.items.map((i) => i.name).join(', ')}</p>
              </div>
              <select value={o.status} onChange={(e) => setStatus(o._id, e.target.value)} className="border rounded-full px-3 py-1 text-sm">
                {['Pending', 'Shipped', 'Delivered', 'Cancelled'].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
