import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartDrawer() {
  const { items, open, setOpen, updateQty, removeItem, subtotal } = useCart();

  return (
    <>
      <div
        className={`fixed inset-0 bg-slateink-900/40 z-[60] transition ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setOpen(false)}
      />
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-nude-50 z-[70] shadow-luxe flex flex-col transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-nude-200">
          <h2 className="font-display text-2xl">Your Bag</h2>
          <button onClick={() => setOpen(false)} aria-label="Close bag">
            <X />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 && (
            <p className="text-sm text-slateink-700/70">Your bag is empty. Discover the edit.</p>
          )}
          {items.map((item) => (
            <div key={item.product} className="flex gap-3 bg-white rounded-2xl p-3">
              <img src={item.image} alt="" className="h-20 w-20 rounded-xl object-cover" />
              <div className="flex-1">
                <p className="text-sm font-medium leading-snug">{item.name}</p>
                <p className="text-gold-600 text-sm mt-1">₹{item.price}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => updateQty(item.product, item.qty - 1)} className="p-1 border rounded-full">
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="text-sm w-5 text-center">{item.qty}</span>
                  <button onClick={() => updateQty(item.product, item.qty + 1)} className="p-1 border rounded-full">
                    <Plus className="h-3 w-3" />
                  </button>
                  <button onClick={() => removeItem(item.product)} className="ml-auto text-slateink-700/50">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-5 border-t border-nude-200">
          <div className="flex justify-between text-sm mb-4">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <Link
            to="/checkout"
            onClick={() => setOpen(false)}
            className={`block text-center py-3 rounded-full bg-slateink-900 text-nude-50 tracking-widest text-xs uppercase ${items.length === 0 ? 'pointer-events-none opacity-40' : ''
              }`}
          >
            Proceed to Checkout
          </Link>
        </div>
      </aside>
    </>
  );
}
