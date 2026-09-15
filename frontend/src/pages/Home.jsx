import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import ProductCard from '../components/product/ProductCard';
import PromoBanners from '../components/home/PromoBanners';
import HeroCarousel from '../components/home/HeroCarousel';
import FestivalModal from '../components/home/FestivalModal';
import BrandsMarquee from '../components/home/BrandsMarquee';
import CountdownTimer from '../components/home/CountdownTimer';

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    api.get('/products', { params: { trending: true, limit: 10 } }).then(({ data }) => {
      setTrending(data.products);
    });
  }, []);

  useEffect(() => {
    if (trending.length < 2) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % Math.max(trending.length - 2, 1)), 4000);
    return () => clearInterval(t);
  }, [trending]);

  const visible = trending.slice(index, index + 3);
  const carousel = visible.length ? visible : trending.slice(0, 3);

  return (
    <div className="space-y-16">
      <HeroCarousel />
      <CountdownTimer hours={5} />
      <FestivalModal />
      <BrandsMarquee />

      <PromoBanners />

      {/* Featured Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 mt-16 grid md:grid-cols-2 gap-6">
        <Link to="/shop?category=Makeup" className="relative h-72 rounded-[2rem] overflow-hidden group shadow-sm">
          <img
            src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80"
            alt="Makeup"
            className="h-full w-full object-cover group-hover:scale-105 transition duration-700"
          />
          <div className="absolute inset-0 flex items-end p-8" style={{ backgroundColor: 'rgba(8,8,8,0.28)' }}>
            <div>
              <p className="font-display text-4xl" style={{ color: 'var(--cream)' }}>Luxury Makeup</p>
              <p className="text-sm mt-1" style={{ color: 'var(--cream)', opacity: 0.9 }}>Lipsticks, mascaras, and breathable foundations.</p>
            </div>
          </div>
        </Link>
        <Link to="/shop?category=Skincare" className="relative h-72 rounded-[2rem] overflow-hidden group shadow-sm">
          <img
            src="https://images.unsplash.com/photo-1570172616996-8490bcef35b4?auto=format&fit=crop&w=1200&q=80"
            alt="Skincare"
            className="h-full w-full object-cover group-hover:scale-105 transition duration-700"
          />
          <div className="absolute inset-0 flex items-end p-8" style={{ backgroundColor: 'rgba(8,8,8,0.22)' }}>
            <div>
              <p className="font-display text-4xl" style={{ color: 'var(--cream)' }}>Skincare Essentials</p>
              <p className="text-sm mt-1" style={{ color: 'var(--cream)', opacity: 0.9 }}>Hydrating serums, barrier creams, and daily shields.</p>
            </div>
          </div>
        </Link>
      </section>

      {/* Now Trending Carousel */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 mt-20 mb-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase font-semibold" style={{ color: 'var(--rose)' }}>Now Trending</p>
            <h2 className="font-display text-4xl mt-1" style={{ color: 'var(--deep)' }}>Iconic Global Favorites</h2>
          </div>
          <Link to="/shop" className="text-xs font-semibold uppercase tracking-wider pb-0.5 transition" style={{ color: 'var(--rose)', borderBottom: '2px solid rgba(224,168,153,0.12)' }}>
            View All Collection
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {carousel.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
