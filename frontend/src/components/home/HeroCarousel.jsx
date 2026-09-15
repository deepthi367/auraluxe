import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
    {
        title: 'Festive Glow Sale — Up to 40% Off on Skincare Sets',
        image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=1200&auto=format&fit=crop',
    },
    {
        title: 'Luxury Velvet Lipsticks — Buy 2 Get 1 Free',
        image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=1200&auto=format&fit=crop',
    },
    {
        title: 'New Arrivals — Organic Hair Care Serums',
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1200&auto=format&fit=crop',
    },
];

export default function HeroCarousel() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
        return () => clearInterval(t);
    }, []);

    return (
        <section className="relative">
            <div className="h-[60vh] relative overflow-hidden">
                {slides.map((s, i) => (
                    <div
                        key={s.title}
                        className={`absolute inset-0 transition-opacity duration-700 ${i === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                    >
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${s.image}')` }} />
                        {/* dark overlay behind text for readability */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
                        <div className="relative z-20 max-w-7xl mx-auto px-4 lg:px-8 py-16 flex flex-col justify-center h-full">
                            <p className="tracking-[0.4em] text-xs uppercase font-medium text-white/90">The Beauty Haven</p>
                            <h2 className="font-display text-4xl md:text-6xl leading-tight mt-4 max-w-2xl text-white">{s.title}</h2>
                            <div className="mt-6">
                                <a href="/shop" className="inline-block px-6 py-3 rounded-full text-sm font-semibold mr-3 bg-black text-white transition-transform transform-gpu hover:scale-105">Shop Now</a>
                                <a href="/offers" className="inline-block px-5 py-3 rounded-full text-sm font-semibold border border-gray-900 text-gray-900 bg-transparent hover:bg-gray-50">Explore Offers</a>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Arrows */}
                <button
                    onClick={() => setIndex((idx) => (idx - 1 + slides.length) % slides.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:scale-105"
                    aria-label="Prev"
                >
                    <ChevronLeft className="h-5 w-5 text-gray-900" />
                </button>
                <button
                    onClick={() => setIndex((idx) => (idx + 1) % slides.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:scale-105"
                    aria-label="Next"
                >
                    <ChevronRight className="h-5 w-5 text-gray-900" />
                </button>

                {/* Dots */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-6 flex gap-2 z-30">
                    {slides.map((_, i) => (
                        <button key={i} onClick={() => setIndex(i)} className={`h-2 w-8 rounded-full ${i === index ? 'bg-gray-900' : 'bg-gray-200'}`} />
                    ))}
                </div>
            </div>
        </section>
    );
}
