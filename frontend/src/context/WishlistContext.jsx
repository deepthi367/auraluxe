import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);
const STORAGE_KEY = 'auraluxe_wishlist';

export const WishlistProvider = ({ children }) => {
    const [items, setItems] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        } catch {
            return [];
        }
    });

    const [toast, setToast] = useState('');

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    const { user } = useAuth();

    const add = async (product) => {
        setItems((prev) => {
            if (prev.find((p) => p._id === product._id)) return prev;
            return [...prev, { _id: product._id, name: product.name, slug: product.slug, price: product.price, image: product.images?.[0] || product.image }];
        });
        setToast('Saved to Beauty Selection');
        setTimeout(() => setToast(''), 2500);

        // Attempt to persist to backend when user is logged in
        if (user && user.token) {
            try {
                await api.post('/users/wishlist', { productId: product._id });
            } catch (err) {
                // ignore backend errors - local state remains authoritative
                console.warn('Wishlist sync failed (add):', err?.message || err);
            }
        }
    };

    const remove = async (productId) => {
        setItems((prev) => prev.filter((p) => p._id !== productId));
        setToast('Removed from Beauty Selection');
        setTimeout(() => setToast(''), 2000);

        if (user && user.token) {
            try {
                await api.delete(`/users/wishlist/${productId}`);
            } catch (err) {
                console.warn('Wishlist sync failed (remove):', err?.message || err);
            }
        }
    };

    const toggle = (product) => {
        if (items.find((p) => p._id === product._id)) remove(product._id);
        else add(product);
    };

    const isInWishlist = (productId) => items.some((p) => p._id === productId);

    const value = useMemo(() => ({ items, add, remove, toggle, isInWishlist, toast }), [items, toast]);

    return (
        <WishlistContext.Provider value={value}>
            {children}
            {/* simple toast */}
            <div aria-live="polite" className="fixed right-6 top-6 z-50 pointer-events-none">
                {toast && (
                    <div className="bg-slateink-900 text-nude-50 px-4 py-2 rounded-2xl shadow-md pointer-events-auto">{toast}</div>
                )}
            </div>
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
