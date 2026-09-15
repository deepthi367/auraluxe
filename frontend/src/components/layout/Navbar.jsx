import { NavLink, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, User, Menu, X, Package, HelpCircle, LogOut, ShieldCheck, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import api from '../../api/client';
import WomanProfileIcon from '../icons/WomanProfileIcon';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count, setOpen } = useCart();
  const [q, setQ] = useState('');
  const [hints, setHints] = useState([]);
  const [menu, setMenu] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const box = useRef(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!q.trim()) {
      setHints([]);
      return;
    }
    const t = setTimeout(async () => {
      try {
        const { data } = await api.get('/products/suggest', { params: { q } });
        setHints(data);
      } catch (err) {
        setHints([]);
      }
    }, 180);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    const close = (e) => {
      if (box.current && !box.current.contains(e.target)) setHints([]);
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);



  const submitSearch = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    navigate(`/shop?q=${encodeURIComponent(q.trim())}`);
    setHints([]);
    setMenu(false);
  };

  const navCategories = [
    { label: 'Home', path: '/' },
    { label: 'Shop All', path: '/shop' },
    { label: 'Offers', path: '/shop?offers=1' },
    { label: 'New Arrivals', path: '/shop?sort=newest' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
      {/* Top Banner */}
      <div className="text-sm tracking-[0.28em] uppercase text-center py-2 px-4" style={{ backgroundColor: '#FDF8F5', color: '#1A1A1A' }}>
        Complimentary shipping on orders above ₹1,999 · Coupon <span className="font-semibold" style={{ color: '#1A1A1A' }}>LUXE20</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Mobile menu toggle */}
        <button
          className="lg:hidden p-1.5 text-gray-900 hover:text-gray-700 transition"
          onClick={() => setMenu((v) => !v)}
          aria-label="Toggle menu"
        >
          {menu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Brand Logo */}
        <NavLink to="/" className="shrink-0" aria-label="AuraLuxe home">
          <span className="font-serif text-2xl tracking-wider font-bold" style={{ color: '#1A1A1A' }}>
            Aura<span style={{ color: '#C58B7E' }}>Luxe</span>
          </span>
        </NavLink>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-medium tracking-wider uppercase ml-4">
          {navCategories.map((cat) => (
            <NavLink
              key={cat.label}
              to={cat.path}
              className={({ isActive }) =>
                `transition py-1 ${isActive && cat.path !== '/shop' && cat.path !== '/'
                  ? 'text-gray-900 border-b-2 border-gray-900 font-semibold' : 'text-gray-900/90 hover:text-gray-900'} `
              }
            >
              {cat.label}
            </NavLink>
          ))}

        </nav>

        {/* Search Bar */}
        <form onSubmit={submitSearch} className="relative flex-1 max-w-xs md:max-w-sm ml-auto hidden md:block" ref={box}>
          <Search className="absolute left-3.5 top-2.5 h-4 w-4" style={{ color: 'rgba(26,26,26,0.45)' }} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search serums, lipsticks, SPF…"
            className="w-full rounded-full bg-white/80 border border-gray-200 pl-10 pr-4 py-2 text-xs outline-none focus:ring-1 focus:ring-gold-500 focus:border-gold-500 shadow-sm transition"
          />
          {hints.length > 0 && (
            <ul className="absolute top-11 left-0 right-0 bg-white shadow-luxe rounded-2xl overflow-hidden border border-gray-100 z-50 divide-y divide-gray-100">
              {hints.map((p) => (
                <li key={p._id}>
                  <button
                    type="button"
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 hover:bg-gray-50 text-left transition"
                    onClick={() => {
                      navigate(`/product/${p.slug}`);
                      setHints([]);
                      setQ('');
                    }}
                  >
                    <img src={p.images[0]} alt="" className="h-10 w-10 rounded-lg object-cover bg-gray-50" />
                    <span className="truncate">
                      <span className="block text-xs font-medium" style={{ color: '#1A1A1A' }}>{p.name}</span>
                      <span className="text-[11px] font-medium" style={{ color: '#1A1A1A' }}>₹{p.price.toLocaleString()}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </form>

        {/* Action Icons & Profile Dropdown */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-1.5 p-1.5 px-2.5 rounded-full hover:bg-gray-50 transition border border-gray-100 text-gray-900"
                aria-label="User Profile Menu"
              >
                <div className="h-7 w-7 rounded-full bg-gray-900 text-white text-xs font-semibold grid place-items-center uppercase">
                  {user.name ? user.name.charAt(0) : 'U'}
                </div>
                <span className="hidden sm:inline text-xs font-medium max-w-[100px] truncate" style={{ color: '#1A1A1A' }}>{user.name?.split(' ')[0]}</span>
                <ChevronDown className={`h-3.5 w-3.5 text-gray-700 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 top-11 w-56 bg-white shadow-luxe rounded-2xl p-2 text-sm border border-gray-100 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-gray-100 mb-1">
                    <p className="text-xs font-semibold text-gray-900 truncate">{user.name}</p>
                    <p className="text-[11px] text-gray-700 truncate">{user.email}</p>
                  </div>

                  <div className="space-y-0.5">
                    <NavLink
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-gray-900 hover:bg-gray-50 rounded-xl transition font-medium"
                    >
                      <User className="h-4 w-4 text-gray-900" />
                      My Profile
                    </NavLink>

                    <NavLink
                      to="/orders"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-gray-900 hover:bg-gray-50 rounded-xl transition font-medium"
                    >
                      <Package className="h-4 w-4 text-gray-900" />
                      My Orders
                    </NavLink>

                    <NavLink
                      to="/wishlist"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-gray-900 hover:bg-gray-50 rounded-xl transition font-medium"
                    >
                      <WomanProfileIcon className="h-4 w-4 text-gray-900" filled={true} />
                      Wishlist
                    </NavLink>

                    <NavLink
                      to="/help"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-gray-900 hover:bg-gray-50 rounded-xl transition font-medium"
                    >
                      <HelpCircle className="h-4 w-4 text-gray-900" />
                      Help & Support
                    </NavLink>

                    {user.role === 'admin' && (
                      <NavLink
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-gray-900 hover:bg-gray-50 rounded-xl transition font-medium"
                      >
                        <ShieldCheck className="h-4 w-4 text-gray-900" />
                        Atelier Admin
                      </NavLink>
                    )}
                  </div>

                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-900 hover:bg-gray-50 rounded-xl transition font-medium text-left"
                    >
                      <LogOut className="h-4 w-4 text-gray-900" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <NavLink
              to="/login"
              className="text-xs font-semibold tracking-wider uppercase px-4 py-2 rounded-full border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition"
            >
              Sign in
            </NavLink>
          )}

          {/* Cart Icon */}
          <button
            onClick={() => setOpen(true)}
            className="relative p-2 text-gray-900 hover:text-gray-700 transition"
            aria-label="Shopping bag"
          >
            <ShoppingBag className="h-5 w-5 text-gray-900" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-gold-500 text-[10px] font-bold text-white grid place-items-center shadow-sm">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mega menu removed per request */}

      {/* Mobile Drawer Menu */}
      {menu && (
        <div className="lg:hidden border-t border-gray-100 px-5 py-4 flex flex-col gap-3 bg-white">
          {/* Mobile Search */}
          <form onSubmit={submitSearch} className="relative mb-2">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4" style={{ color: 'rgba(26,26,26,0.45)' }} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products…"
              className="w-full rounded-full bg-white border border-gray-200 pl-10 pr-4 py-2 text-xs outline-none"
            />
          </form>

          {navCategories.map((cat) => (
            <NavLink
              key={cat.label}
              to={cat.path}
              onClick={() => setMenu(false)}
              className="text-sm font-medium text-gray-900 py-1 hover:bg-gray-50 rounded px-2"
            >
              {cat.label}
            </NavLink>
          ))}

          {user && (
            <div className="border-t border-gray-100 pt-3 mt-1 flex flex-col gap-2">
              <p className="text-xs text-gray-700 font-semibold uppercase tracking-wider">Account</p>
              <NavLink to="/profile" onClick={() => setMenu(false)} className="text-sm text-gray-900">
                My Profile
              </NavLink>
              <NavLink to="/orders" onClick={() => setMenu(false)} className="text-sm text-slateink-900">
                My Orders
              </NavLink>
              <NavLink to="/wishlist" onClick={() => setMenu(false)} className="text-sm text-slateink-900">
                Wishlist
              </NavLink>
              <NavLink to="/help" onClick={() => setMenu(false)} className="text-sm text-slateink-900">
                Help & Support
              </NavLink>
              <button
                onClick={() => {
                  setMenu(false);
                  logout();
                }}
                className="text-sm text-gray-900 text-left font-medium"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
