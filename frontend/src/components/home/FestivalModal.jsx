import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export default function FestivalModal() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const seen = sessionStorage.getItem('seenFestivalModal');
        if (seen) return;
        const t = setTimeout(() => setOpen(true), 2000);
        return () => clearTimeout(t);
    }, []);

    const close = (claim = false) => {
        sessionStorage.setItem('seenFestivalModal', '1');
        if (claim) window.location.href = '/shop?filter=offers';
        setOpen(false);
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 grid place-items-center">
            <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => close(false)} />
            <div className="relative rounded-2xl p-6 max-w-md w-full shadow-xl" style={{ background: 'linear-gradient(180deg, var(--cream) 0%, var(--offwhite) 100%)', border: '1px solid rgba(8,8,8,0.06)' }}>
                <button className="absolute right-3 top-3 p-1" onClick={() => close(false)} aria-label="Close">
                    <X className="h-5 w-5" style={{ color: 'var(--deep)' }} />
                </button>
                <h3 className="text-lg font-semibold" style={{ color: 'var(--deep)' }}>Dussehra & Diwali Special</h3>
                <p className="mt-2 text-sm" style={{ color: 'var(--deep)', opacity: 0.9 }}>Extra 15% OFF with code <span className="font-bold" style={{ color: 'var(--rose)' }}>LUXE15</span></p>
                <div className="mt-5 flex justify-end gap-3">
                    <button onClick={() => close(false)} className="px-4 py-2 rounded-full border" style={{ borderColor: 'rgba(8,8,8,0.08)', color: 'var(--deep)' }}>
                        Close
                    </button>
                    <button onClick={() => close(true)} className="px-4 py-2 rounded-full" style={{ backgroundColor: 'var(--rose)', color: 'var(--deep)' }}>
                        Claim Offer / Shop Now
                    </button>
                </div>
            </div>
        </div>
    );
}
