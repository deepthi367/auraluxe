import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import WomanProfileIcon from '../icons/WomanProfileIcon';
import { useWishlist } from '../../context/WishlistContext';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { toggle, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product._id);

  return (
    <article className="group rounded-3xl overflow-hidden shadow-sm hover:shadow-luxe transition duration-300" style={{ background: '#FFFFFF', border: '1px solid rgba(8,8,8,0.04)' }}>
      <div className="relative">
        <Link to={`/product/${product.slug}`} className="block overflow-hidden h-52 flex items-center justify-center p-4">
          <img
            src={product.images[0]}
            alt={product.name}
            className="max-h-full w-auto object-contain rounded-lg group-hover:scale-105 transition duration-500"
          />
        </Link>
        <button
          onClick={() => toggle(product)}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 p-2 rounded-full shadow-sm transition"
          style={{ background: 'rgba(255,255,255,0.9)' }}
        >
          <WomanProfileIcon className="h-6 w-6" filled={inWishlist} style={{ color: inWishlist ? 'var(--rose)' : 'rgba(26,26,26,0.6)' }} />
        </button>
      </div>
      <div className="p-4">
        <p className="text-[10px] tracking-[0.2em] uppercase" style={{ color: '#555555' }}>{product.brand}</p>
        <Link to={`/product/${product.slug}`} className="font-display text-xl leading-tight mt-1 block" style={{ color: '#1A1A1A' }}>
          {product.name}
        </Link>
        <div className="flex items-center gap-1 mt-2">
          <Star className="h-3.5 w-3.5" style={{ color: '#F1C6B3' }} />
          <span className="text-xs" style={{ color: '#1A1A1A' }}>{product.rating}</span>
          <span className="text-xs" style={{ color: 'rgba(26,26,26,0.45)' }}>({product.numReviews})</span>
        </div>
        <div className="flex items-end justify-between mt-3">
          <div>
            <p className="text-lg" style={{ color: '#1A1A1A' }}>₹{product.price}</p>
            {product.compareAtPrice && (
              <p className="text-xs line-through" style={{ color: 'rgba(8,8,8,0.45)' }}>₹{product.compareAtPrice}</p>
            )}
          </div>
          <button
            onClick={() => addItem(product, 1)}
            className="text-[10px] tracking-widest uppercase px-3 py-2 rounded-full transition bg-black text-white"
            style={{ boxShadow: '0 6px 18px rgba(17,17,17,0.08)' }}
          >
            Add to bag
          </button>
        </div>
      </div>
    </article>
  );
}
