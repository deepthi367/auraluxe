import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import WomanProfileIcon from '../components/icons/WomanProfileIcon';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function Wishlist() {
  const { addItem } = useCart();
  const { items: wishlistItems, remove, toggle } = useWishlist();

  const handleAddToCart = (product) => {
    addItem({
      _id: product._id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.image,
      stock: product.stock || 1,
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl text-slateink-900 flex items-center gap-3">
            <WomanProfileIcon className="h-8 w-8 text-rose-500" filled={true} />
            Your Wishlist
          </h1>
          <p className="text-sm text-slateink-700/60 mt-1">Saved beauty rituals and luxury cosmetics awaiting your vanity.</p>
        </div>
        <Link
          to="/shop"
          className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-600 hover:text-gold-500 transition"
        >
          Discover More <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-nude-200 shadow-sm max-w-md mx-auto">
          <div className="h-16 w-16 bg-rose-50 text-rose-500 rounded-full grid place-items-center mx-auto mb-4">
            <WomanProfileIcon className="h-8 w-8" />
          </div>
          <h2 className="font-display text-2xl text-slateink-900 mb-2">Your Wishlist is Empty</h2>
          <p className="text-xs text-slateink-700/60 mb-6 leading-relaxed">
            Save your favorite formulations, lipsticks, and serums to revisit anytime.
          </p>
          <Link
            to="/shop"
            className="inline-block px-8 py-3 rounded-full bg-slateink-900 text-white text-xs font-semibold tracking-widest uppercase hover:bg-slateink-800 transition shadow-sm"
          >
            Explore The Edit
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-3xl p-4 border border-nude-200 shadow-sm flex flex-col justify-between hover:shadow-md transition group"
            >
              <div className="relative mb-4 overflow-hidden rounded-2xl bg-nude-100 aspect-square">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <button
                  onClick={() => remove(item._id)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-rose-600 hover:bg-rose-50 transition shadow-sm"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-gold-600 block mb-1">
                  {item.category}
                </span>
                <Link to={`/product/${item.slug}`} className="font-display text-lg text-slateink-900 hover:text-gold-600 transition block truncate">
                  {item.name}
                </Link>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm font-semibold text-slateink-900">₹{item.price.toLocaleString()}</span>
                  {item.compareAtPrice && (
                    <span className="text-xs text-slateink-700/50 line-through">₹{item.compareAtPrice.toLocaleString()}</span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleAddToCart(item)}
                  className="flex-1 py-2.5 rounded-full bg-slateink-900 hover:bg-slateink-800 text-white text-xs font-semibold tracking-widest uppercase flex items-center justify-center gap-2 transition shadow-sm"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Move to Bag
                </button>
                <button
                  onClick={() => toggle(item)}
                  className="p-2 rounded-full bg-white/90 hover:bg-white shadow-sm transition"
                  aria-label="Toggle wishlist"
                >
                  <WomanProfileIcon className="h-6 w-6 text-rose-500" filled={true} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
