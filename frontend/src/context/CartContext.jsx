import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'auraluxe_bag';

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product === product._id);
      if (existing) {
        return prev.map((i) =>
          i.product === product._id ? { ...i, qty: Math.min(i.qty + qty, product.stock) } : i
        );
      }
      return [
        ...prev,
        {
          product: product._id,
          name: product.name,
          image: product.images[0],
          price: product.price,
          slug: product.slug,
          stock: product.stock,
          qty,
        },
      ];
    });
    setOpen(true);
    setToast('Added to Bag');
    setTimeout(() => setToast(''), 2200);
  };

  const updateQty = (productId, qty) => {
    setItems((prev) =>
      prev.map((i) => (i.product === productId ? { ...i, qty: Math.max(1, qty) } : i))
    );
  };

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((i) => i.product !== productId));
    setToast('Removed from Bag');
    setTimeout(() => setToast(''), 1800);
  };

  const clear = () => setItems([]);

  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const value = useMemo(
    () => ({
      items,
      open,
      setOpen,
      addItem,
      updateQty,
      removeItem,
      clear,
      count,
      subtotal,
      toast,
    }),
    [items, open, count, subtotal]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <div aria-live="polite" className="fixed right-6 top-6 z-50 pointer-events-none">
        {toast && (
          <div className={`auraluxe-toast show`}>{toast}</div>
        )}
      </div>
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
