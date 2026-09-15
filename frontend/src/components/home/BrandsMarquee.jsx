import { useEffect, useRef } from 'react';

const brands = ['Maybelline', 'MAC', 'Minimalist', 'Dot & Key', 'Derma Co', 'CeraVe', 'The Ordinary'];

export default function BrandsMarquee() {
    const ref = useRef(null);
    useEffect(() => {
        const el = ref.current;
        let pos = 0;
        let raf;
        const step = () => {
            pos -= 0.5;
            if (!el) return;
            el.style.transform = `translateX(${pos}px)`;
            if (Math.abs(pos) > el.scrollWidth / 2) pos = 0;
            raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
        return () => cancelAnimationFrame(raf);
    }, []);

    return (
        <div className="overflow-hidden py-4" style={{ backgroundColor: 'var(--offwhite)', borderTop: '1px solid rgba(8,8,8,0.04)', borderBottom: '1px solid rgba(8,8,8,0.04)' }}>
            <div className="flex whitespace-nowrap gap-8 items-center max-w-7xl mx-auto px-4 lg:px-8">
                <div ref={ref} className="flex gap-8 will-change-transform">
                    {brands.concat(brands).map((b, i) => (
                        <div key={i} className="text-sm font-medium px-3 py-2 rounded" style={{ color: 'var(--deep)' }}>
                            {b}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
