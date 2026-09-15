import { Link } from 'react-router-dom';

export default function PromoBanners() {
    const cards = [
        {
            id: 'gift',
            title: 'GIFT CARDS',
            subtitle: 'Give them exactly what they need',
            href: '/shop?filter=giftcards',
            image:
                'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600&auto=format&fit=crop',
        },
        {
            id: 'combo',
            title: 'Free Gifts',
            subtitle: 'On Orders ₹3000+',
            href: '/shop?filter=offers',
            image:
                'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop',
        },
        {
            id: 'season',
            title: 'Seasonal Sale',
            subtitle: 'Flat 15% Off On All Orders',
            href: '/shop?filter=seasonal',
            image:
                'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop',
        },
    ];

    return (
        <section className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
            <h3 className="text-2xl font-display mb-6" style={{ color: '#1A1A1A' }}>Unlock More Beauty</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {cards.map((c) => (
                    <Link
                        key={c.id}
                        to={c.href}
                        className="group block overflow-hidden rounded-xl shadow-sm transform transition hover:scale-105"
                        style={{ background: '#FFFFFF', border: '1px solid rgba(8,8,8,0.04)' }}
                    >
                        <div
                            className="h-44 md:h-56 bg-center bg-cover"
                            style={{ backgroundImage: `url('${c.image}')` }}
                        />
                        <div className="p-4 md:p-6">
                            <p className="text-xs tracking-[0.28em] uppercase font-semibold" style={{ color: '#1A1A1A' }}>{c.title}</p>
                            <h4 className="mt-2 text-lg font-semibold" style={{ color: '#1A1A1A' }}>{c.subtitle}</h4>
                            <div className="mt-4">
                                <span className="inline-block text-xs font-semibold px-3 py-2 rounded-full" style={{ border: '1px solid #111111', color: '#111111', background: 'transparent' }}>
                                    Shop Now
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
