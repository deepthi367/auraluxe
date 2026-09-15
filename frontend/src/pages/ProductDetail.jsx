import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, ChevronLeft, ChevronRight, Minus, Plus, Send, ShoppingBag, Star } from 'lucide-react';
import WomanProfileIcon from '../components/icons/WomanProfileIcon';
import { useWishlist } from '../context/WishlistContext';
import api from '../api/client';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

/* ─── helpers ─────────────────────────────────────────────── */
function StarRow({ value, max = 5, size = 'h-4 w-4' }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={`${size} ${i < Math.round(value) ? 'fill-gold-500 text-gold-500' : 'fill-nude-300 text-nude-300'}`}
        />
      ))}
    </span>
  );
}

/* ─── sample reviews seeded per product ────────────────────── */
const SAMPLE_REVIEWS = [
  {
    id: 1,
    name: 'Priya Nair',
    rating: 5,
    title: 'Best skincare purchase this year!',
    date: 'Aug 22, 2026',
    comment:
      'Absolutely love this product. My skin feels so soft and hydrated after just a week of use. The texture is lightweight and absorbs instantly. Will definitely repurchase!',
    verified: true,
  },
  {
    id: 2,
    name: 'Rohan Sharma',
    rating: 4,
    title: 'Great formula, slightly pricey',
    date: 'Aug 15, 2026',
    comment:
      'Really effective and I noticed visible results within two weeks. Only giving 4 stars because I feel the price point is a bit high for the quantity, but the quality is undeniable.',
    verified: true,
  },
  {
    id: 3,
    name: 'Meera Iyer',
    rating: 5,
    title: 'Dermatologist recommended & it shows',
    date: 'Jul 30, 2026',
    comment:
      'My dermatologist suggested this and I can see why. Gentle enough for my sensitive skin and genuinely effective. No irritation, no breakouts — just glowing, healthy skin.',
    verified: false,
  },
  {
    id: 4,
    name: 'Ananya Singh',
    rating: 4,
    title: 'Pleasantly surprised by results',
    date: 'Jul 12, 2026',
    comment:
      'I was skeptical at first but this product really delivers. Packaging is premium and the product itself has a luxurious feel. Would love a larger size option.',
    verified: true,
  },
];

/* ─── Review card component ────────────────────────────────── */
function ReviewCard({ review }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-nude-200 shadow-sm">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-slateink-900 text-gold-400 text-sm font-semibold grid place-items-center shrink-0 uppercase">
            {review.name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-slateink-900">{review.name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <StarRow value={review.rating} size="h-3 w-3" />
              {review.verified && (
                <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-2.5 w-2.5" /> Verified
                </span>
              )}
            </div>
          </div>
        </div>
        <span className="text-[11px] text-slateink-700/50 shrink-0">{review.date}</span>
      </div>
      <p className="text-xs font-semibold text-slateink-900 mb-1">{review.title}</p>
      <p className="text-xs text-slateink-700/75 leading-relaxed">{review.comment}</p>
    </div>
  );
}

/* ─── Write a Review form ───────────────────────────────────── */
function WriteReview({ onSubmit }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating || !comment.trim()) return;
    onSubmit({ rating, title, comment });
    setSuccess(true);
    setRating(0);
    setTitle('');
    setComment('');
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <div className="bg-white rounded-3xl p-6 lg:p-8 border border-nude-200 shadow-sm">
      <h4 className="font-display text-xl text-slateink-900 mb-1">Write a Review</h4>
      <p className="text-xs text-slateink-700/60 mb-5">Share your experience with this product.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star picker */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-slateink-700/70 mb-2 font-medium">Your Rating</label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                type="button"
                key={s}
                onMouseEnter={() => setHovered(s)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setRating(s)}
                className="p-0.5 focus:outline-none"
              >
                <Star
                  className={`h-6 w-6 transition ${s <= (hovered || rating) ? 'fill-gold-500 text-gold-500' : 'fill-nude-200 text-nude-200'
                    }`}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-xs font-medium text-gold-600">
                {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
              </span>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-slateink-700/70 mb-1.5 font-medium">Review Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Summarise your experience…"
            className="w-full rounded-2xl border border-nude-300 px-4 py-2.5 text-sm bg-nude-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-500 transition"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-slateink-700/70 mb-1.5 font-medium">Your Review</label>
          <textarea
            rows={4}
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell others what you think about this product…"
            className="w-full rounded-2xl border border-nude-300 px-4 py-2.5 text-sm bg-nude-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gold-500 transition resize-none"
          />
        </div>

        {success && (
          <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 p-3 rounded-2xl flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            Thank you! Your review has been submitted successfully.
          </p>
        )}

        <button
          type="submit"
          disabled={!rating || !comment.trim()}
          className="flex items-center gap-2 px-8 py-3 rounded-full bg-slateink-900 hover:bg-slateink-800 text-white text-xs font-semibold tracking-widest uppercase transition shadow-sm disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
          Submit Review
        </button>
      </form>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────── */
export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [reviews, setReviews] = useState(SAMPLE_REVIEWS);
  const relatedRef = useRef(null);
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toggle, isInWishlist } = useWishlist();

  useEffect(() => {
    setProduct(null);
    api.get(`/products/slug/${slug}`).then(({ data }) => {
      setProduct(data);
      setActive(0);
      setQty(1);
      // Fetch related products from same category
      api
        .get('/products', { params: { category: data.category, limit: 6 } })
        .then(({ data: res }) => {
          setRelated(res.products.filter((p) => p.slug !== slug).slice(0, 5));
        })
        .catch(() => setRelated([]));
    });
  }, [slug]);

  if (!product)
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gold-600 font-display text-2xl animate-pulse">Unveiling…</p>
      </div>
    );

  const inStock = product.stock > 0;
  const breakdown = product.ratingBreakdown || {};
  const totalReviews = product.numReviews || 1;
  const savings = product.compareAtPrice ? product.compareAtPrice - product.price : 0;

  const buyNow = () => {
    addItem(product, qty);
    if (!user) navigate('/login');
    else navigate('/checkout');
  };

  const addReview = (review) => {
    setReviews((prev) => [
      { id: Date.now(), name: user?.name || 'Guest', date: 'Just now', verified: !!user, ...review },
      ...prev,
    ]);
  };

  const scrollRelated = (dir) => {
    if (relatedRef.current) {
      relatedRef.current.scrollBy({ left: dir * 320, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      {/* ── Main product section ── */}
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* LEFT — compact image panel */}
        <div className="lg:sticky lg:top-28">
          <div className="mx-auto max-w-[440px]">
            <div className="rounded-3xl overflow-hidden bg-white shadow-sm border border-nude-200 aspect-square max-h-[440px]">
              <img
                src={product.images[active]}
                alt={product.name}
                className="h-full w-full object-contain p-4 transition duration-300"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3 mt-4 justify-center">
                {product.images.map((img, i) => (
                  <button
                    key={img}
                    onClick={() => setActive(i)}
                    className={`h-16 w-16 rounded-2xl overflow-hidden border-2 transition ${active === i ? 'border-gold-500 shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — product info */}
        <div>
          <p className="text-[11px] tracking-[0.35em] uppercase text-gold-600 font-semibold">
            {product.brand} · {product.category}
          </p>
          <div className="flex items-start justify-between gap-4">
            <h1 className="font-display text-4xl lg:text-5xl mt-2 text-slateink-900 leading-tight">{product.name}</h1>
            <div className="mt-2">
              <button
                onClick={() => toggle(product)}
                aria-label={isInWishlist(product._id) ? 'Remove from wishlist' : 'Add to wishlist'}
                className="p-2 rounded-full bg-white/90 hover:bg-white shadow-sm transition"
              >
                <WomanProfileIcon className="h-7 w-7 woman-icon text-rose-500" filled={isInWishlist(product._id)} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-3">
            <StarRow value={product.rating} size="h-4 w-4" />
            <span className="text-sm font-semibold text-slateink-900">{product.rating}</span>
            <span className="text-sm text-slateink-700/50">({product.numReviews} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mt-5">
            <span className="text-3xl font-semibold text-slateink-900">₹{product.price.toLocaleString()}</span>
            {product.compareAtPrice && (
              <>
                <span className="text-base text-slateink-700/40 line-through">₹{product.compareAtPrice.toLocaleString()}</span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                  Save ₹{savings.toLocaleString()}
                </span>
              </>
            )}
          </div>

          <p className={`mt-2 text-xs font-semibold ${inStock ? 'text-emerald-700' : 'text-rose-700'}`}>
            {inStock ? `✓ In Stock · ${product.stock} units remaining` : '✗ Currently Sold Out'}
          </p>

          <p className="mt-5 text-sm text-slateink-700/80 leading-relaxed">{product.description}</p>

          {/* Qty + CTA */}
          <div className="flex flex-wrap items-center gap-4 mt-8">
            <div className="flex items-center border border-nude-300 rounded-full px-4 py-2.5 gap-4 bg-white shadow-sm">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="text-slateink-700 hover:text-gold-600 transition">
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-6 text-center text-sm font-semibold">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(product.stock || 1, q + 1))}
                className="text-slateink-700 hover:text-gold-600 transition"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              disabled={!inStock}
              onClick={() => addItem(product, qty)}
              className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 rounded-full bg-slateink-900 hover:bg-slateink-800 text-nude-50 text-xs font-semibold tracking-[0.2em] uppercase disabled:opacity-40 transition shadow-sm"
            >
              <ShoppingBag className="h-4 w-4" />
              Add to Bag
            </button>
            <button
              disabled={!inStock}
              onClick={buyNow}
              className="flex-1 min-w-[120px] py-3 rounded-full border-2 border-gold-500 text-slateink-900 text-xs font-semibold tracking-[0.2em] uppercase disabled:opacity-40 hover:bg-gold-500 hover:text-white transition"
            >
              Buy Now
            </button>
          </div>

          {/* Star Breakdown */}
          <div className="mt-10 bg-nude-50/70 rounded-3xl p-5 border border-nude-200">
            <div className="flex items-center gap-5 mb-4">
              <div className="text-center">
                <p className="font-display text-5xl text-slateink-900">{product.rating}</p>
                <StarRow value={product.rating} size="h-3.5 w-3.5" />
                <p className="text-xs text-slateink-700/60 mt-1">{product.numReviews} reviews</p>
              </div>
              <div className="flex-1 space-y-1.5">
                {[5, 4, 3, 2, 1].map((star) => {
                  const n = breakdown[star] || 0;
                  const pct = Math.round((n / totalReviews) * 100);
                  return (
                    <div key={star} className="flex items-center gap-2 text-xs">
                      <span className="w-10 text-slateink-700/70">{star} ★</span>
                      <div className="flex-1 h-2 bg-nude-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gold-500 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-6 text-right text-slateink-700/50">{n}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Customer Reviews Section ── */}
      <section className="mt-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-gold-600 font-semibold">Verified Purchases</p>
            <h2 className="font-display text-3xl text-slateink-900 mt-1">Customer Reviews</h2>
          </div>
          <span className="text-sm text-slateink-700/60">{reviews.length} reviews</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Review cards */}
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>

          {/* Write a Review */}
          <WriteReview onSubmit={addReview} />
        </div>
      </section>

      {/* ── Related Products ── */}
      {related.length > 0 && (
        <section className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-gold-600 font-semibold">{product.category}</p>
              <h2 className="font-display text-3xl text-slateink-900 mt-1">You May Also Like</h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => scrollRelated(-1)}
                className="h-9 w-9 rounded-full border border-nude-300 grid place-items-center hover:border-gold-500 hover:text-gold-600 transition"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => scrollRelated(1)}
                className="h-9 w-9 rounded-full border border-nude-300 grid place-items-center hover:border-gold-500 hover:text-gold-600 transition"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div
            ref={relatedRef}
            className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none' }}
          >
            {related.map((p) => (
              <Link
                key={p._id}
                to={`/product/${p.slug}`}
                className="group flex-shrink-0 w-56 bg-white rounded-3xl overflow-hidden shadow-sm border border-nude-100 hover:shadow-luxe transition duration-300 snap-start"
              >
                <div className="aspect-square overflow-hidden bg-nude-100">
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
                <div className="p-4">
                  <p className="text-[10px] tracking-widest uppercase text-gold-600 font-semibold">{p.brand}</p>
                  <p className="font-display text-base leading-tight mt-1 text-slateink-900 line-clamp-2">{p.name}</p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <Star className="h-3 w-3 fill-gold-500 text-gold-500" />
                    <span className="text-xs text-slateink-800 font-medium">{p.rating}</span>
                    <span className="text-xs text-slateink-700/50">({p.numReviews})</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm font-semibold text-slateink-900">₹{p.price.toLocaleString()}</span>
                    {p.compareAtPrice && (
                      <span className="text-xs text-slateink-700/40 line-through">₹{p.compareAtPrice.toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
