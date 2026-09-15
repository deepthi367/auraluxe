import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/client';
import ProductCard from '../components/product/ProductCard';

const quickFilters = [
  { id: 'all', label: 'All Products' },
  { id: 'best', label: 'Best Sellers (4.5★+)' },
  { id: 'u999', label: 'Under ₹999' },
  { id: 'u1999', label: 'Under ₹1999' },
  { id: 'new', label: 'New Arrivals' },
];

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const [data, setData] = useState({ products: [], total: 0 });
  const [loading, setLoading] = useState(true);

  const filters = useMemo(
    () => ({
      q: params.get('q') || '',
      category: params.get('category') || 'All',
      subcategory: params.get('subcategory') || '',
      brand: params.get('brand') || '',
      minPrice: params.get('minPrice') || '0',
      maxPrice: params.get('maxPrice') || '5000',
      minRating: params.get('minRating') || '0',
      sort: params.get('sort') || 'newest',
    }),
    [params]
  );

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data: res } = await api.get('/products', {
        params: {
          q: filters.q || undefined,
          category: filters.category && filters.category !== 'All' ? filters.category : undefined,
          subcategory: filters.subcategory || undefined,
          brand: filters.brand || undefined,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          minRating: filters.minRating === '0' ? undefined : filters.minRating,
          sort: filters.sort === 'newest' ? undefined : filters.sort,
        },
      });
      setData(res);
      setLoading(false);
    };
    load();
  }, [filters]);

  const set = (key, value) => {
    const next = new URLSearchParams(params);
    if (!value || value === 'All' || value === '0') next.delete(key);
    else next.set(key, value);
    if (key === 'category' && value === 'All') next.delete('category');
    setParams(next);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <section>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex gap-2 overflow-auto">
              {quickFilters.map((qf) => {
                const active =
                  (qf.id === 'all' && !params.get('minRating') && (!params.get('maxPrice') || params.get('maxPrice') === '5000') && (!params.get('sort') || params.get('sort') === 'newest')) ||
                  (qf.id === 'best' && Number(filters.minRating) >= 4.5) ||
                  (qf.id === 'u999' && Number(filters.maxPrice) <= 999) ||
                  (qf.id === 'u1999' && Number(filters.maxPrice) > 999 && Number(filters.maxPrice) <= 1999) ||
                  (qf.id === 'new' && filters.sort === 'newest');

                return (
                  <button
                    key={qf.id}
                    onClick={() => {
                      if (qf.id === 'all') {
                        set('minRating', '0');
                        set('maxPrice', '5000');
                        set('sort', 'newest');
                      } else if (qf.id === 'best') {
                        set('minRating', '4.5');
                        set('sort', 'top_rated');
                      } else if (qf.id === 'u999') {
                        set('maxPrice', '999');
                      } else if (qf.id === 'u1999') {
                        set('maxPrice', '1999');
                      } else if (qf.id === 'new') {
                        set('sort', 'newest');
                      }
                    }}
                    className={`text-sm px-3 py-1.5 rounded-full transition whitespace-nowrap ${active ? 'bg-slateink-900 text-white' : 'bg-white hover:bg-nude-100'
                      }`}
                  >
                    {qf.label}
                  </button>
                );
              })}
            </div>


          </div>

          <div className="flex items-center gap-3">
            <select
              value={filters.sort}
              onChange={(e) => set('sort', e.target.value)}
              className="rounded-full border border-nude-300 bg-white px-4 py-2 text-sm"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="top_rated">Top Rated</option>
            </select>
          </div>
        </div>
        {loading ? (
          <p className="text-gold-600">Composing the collection…</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-start">
            {data.products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
