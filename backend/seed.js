require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

const products = [
  {
    name: 'Hydrating Facial Cleanser for Normal to Dry Skin',
    slug: 'cerave-hydrating-facial-cleanser',
    brand: 'CeraVe',
    category: 'Facewashes',
    shortDescription: 'Gentle non-foaming cleanser with 3 essential ceramides and hyaluronic acid.',
    description:
      'Developed with dermatologists, CeraVe Hydrating Facial Cleanser cleanses and refreshes skin without over-stripping it or leaving it feeling tight and dry. Formulated with three essential ceramides and hyaluronic acid to restore the skin protective barrier.',
    price: 1250,
    compareAtPrice: 1450,
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1570172616996-8490bcef35b4?auto=format&fit=crop&w=900&q=80',
    ],
    ingredients: ['Ceramides 1, 3, 6-II', 'Hyaluronic Acid', 'Glycerin', 'Niacinamide'],
    stock: 65,
    rating: 4.8,
    numReviews: 340,
    ratingBreakdown: { 5: 280, 4: 45, 3: 10, 2: 3, 1: 2 },
    tags: ['cerave', 'cleanser', 'facewash', 'hydrating', 'skincare'],
    trending: true,
  },
  {
    name: 'Gentle Skin Cleanser for All Skin Types',
    slug: 'cetaphil-gentle-skin-cleanser',
    brand: 'Cetaphil',
    category: 'Facewashes',
    shortDescription: 'Dermatologist recommended hydrating cleanser for sensitive skin.',
    description:
      'This creamy formula is clinically proven to provide continuous hydration to protect against dryness. Formulated with Micellar Technology that gently yet effectively removes dirt, makeup and impurities.',
    price: 1050,
    compareAtPrice: 1200,
    images: [
      'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80',
    ],
    ingredients: ['Niacinamide (Vitamin B3)', 'Panthenol (Pro-Vitamin B5)', 'Glycerin'],
    stock: 80,
    rating: 4.8,
    numReviews: 480,
    ratingBreakdown: { 5: 400, 4: 65, 3: 10, 2: 3, 1: 2 },
    tags: ['cetaphil', 'cleanser', 'sensitive', 'facewash'],
    trending: true,
  },
  {
    name: 'Niacinamide 10% + Zinc 1% High-Strength Serum',
    slug: 'the-ordinary-niacinamide-10-zinc-1',
    brand: 'The Ordinary',
    category: 'Serums',
    shortDescription: 'Pore-refining formula for blemishes and uneven skin texture.',
    description:
      'Niacinamide 10% + Zinc 1% is a water-based serum that boosts skin brightness, improves skin smoothness, and reinforces the skin barrier over time. High concentration reduces visible congestion and balance sebum production.',
    price: 700,
    compareAtPrice: 850,
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1601049541289-9b1b7abc73f2?auto=format&fit=crop&w=900&q=80',
    ],
    ingredients: ['Niacinamide 10%', 'Zinc PCA 1%', 'Aqua', 'Pentylene Glycol'],
    stock: 120,
    rating: 4.7,
    numReviews: 820,
    ratingBreakdown: { 5: 650, 4: 120, 3: 35, 2: 10, 1: 5 },
    tags: ['the ordinary', 'niacinamide', 'serum', 'blemish control'],
    trending: true,
  },
  {
    name: 'Hyaluronic Acid 2% + B5 Hydration Serum',
    slug: 'the-ordinary-hyaluronic-acid-2-b5',
    brand: 'The Ordinary',
    category: 'Serums',
    shortDescription: 'Multi-depth hydration serum with multi-molecular hyaluronic acid.',
    description:
      'Combines low-, medium- and high-molecular weight hyaluronic acid molecules to deliver multi-depth hydration without stripping surface moisture. Infused with Vitamin B5 for enhanced surface hydration and skin plumping.',
    price: 850,
    compareAtPrice: 990,
    images: [
      'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80',
    ],
    ingredients: ['Hyaluronic Acid 2%', 'Pro-Vitamin B5', 'Aqua'],
    stock: 90,
    rating: 4.6,
    numReviews: 410,
    ratingBreakdown: { 5: 310, 4: 75, 3: 18, 2: 5, 1: 2 },
    tags: ['the ordinary', 'hyaluronic acid', 'serum', 'hydration'],
    trending: false,
  },
  {
    name: 'Skin Perfecting 2% BHA Liquid Exfoliant',
    slug: 'paulas-choice-skin-perfecting-2-bha-liquid-exfoliant',
    brand: "Paula's Choice",
    category: 'Skincare',
    shortDescription: 'Iconic leave-on exfoliant that unclogs pores and smooths wrinkles.',
    description:
      "Paula's Choice 2% BHA Liquid Exfoliant quickly unclogs pores, smooths wrinkles, brightens and evens out skin tone. Salicylic acid mimics the natural exfoliation process of younger skin by shedding extra layers while unclogging pores.",
    price: 2900,
    compareAtPrice: 3200,
    images: [
      'https://images.unsplash.com/photo-1571875257727-256c39da42af?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=900&q=80',
    ],
    ingredients: ['2% Salicylic Acid (BHA)', 'Green Tea Extract', 'Methylpropanediol'],
    stock: 45,
    rating: 4.9,
    numReviews: 630,
    ratingBreakdown: { 5: 560, 4: 55, 3: 10, 2: 3, 1: 2 },
    tags: ["paula's choice", 'bha', 'exfoliant', 'skincare', 'pores'],
    trending: true,
  },
  {
    name: 'Revitalift 1.5% Pure Hyaluronic Acid Serum',
    slug: 'loreal-paris-revitalift-hyaluronic-acid-serum',
    brand: "L'Oréal Paris",
    category: 'Serums',
    shortDescription: 'Intensive hydrating serum for radiant, plumped skin.',
    description:
      "Dermatologist-validated serum formulated with 1.5% pure Hyaluronic Acid to intensely hydrate, plump skin, and reduce fine lines in 1 week. Rapid absorption with non-greasy finish.",
    price: 999,
    compareAtPrice: 1299,
    images: [
      'https://images.unsplash.com/photo-1601049541289-9b1b7abc73f2?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80',
    ],
    ingredients: ['1.5% Pure Hyaluronic Acid', 'Glycerin', 'Ascorbyl Glucoside'],
    stock: 70,
    rating: 4.7,
    numReviews: 290,
    ratingBreakdown: { 5: 220, 4: 52, 3: 12, 2: 4, 1: 2 },
    tags: ["l'oreal", 'serum', 'hyaluronic acid', 'revitalift'],
    trending: true,
  },
  {
    name: 'Infallible 24H Fresh Wear Liquid Foundation',
    slug: 'loreal-paris-infallible-fresh-wear-foundation',
    brand: "L'Oréal Paris",
    category: 'Makeup',
    shortDescription: 'Breathable, weightless 24-hour full coverage foundation.',
    description:
      'Provides 24-hour fresh finish with breathable buildable coverage. Sweat-resistant, water-resistant, and transfer-resistant formula enriched with SPF 25.',
    price: 1299,
    compareAtPrice: 1499,
    images: [
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80',
    ],
    ingredients: ['Titanium Dioxide', 'SPF 25 Filter', 'Vitamin E', 'Dimethicone'],
    stock: 40,
    rating: 4.5,
    numReviews: 215,
    ratingBreakdown: { 5: 150, 4: 45, 3: 12, 2: 5, 1: 3 },
    tags: ["l'oreal", 'foundation', 'makeup', 'infallible'],
    trending: false,
  },
  {
    name: 'SuperStay Matte Ink Liquid Lipstick — Shade Lover 15',
    slug: 'maybelline-superstay-matte-ink-lover',
    brand: 'Maybelline',
    category: 'Makeup',
    shortDescription: 'Long-lasting 16-hour liquid matte lipstick with arrow applicator.',
    description:
      'Maybelline SuperStay Matte Ink Liquid Lipstick gives you a flawless matte finish in a range of super-saturated shades. Highly pigmented color that lasts up to 16 hours without smudging or drying.',
    price: 699,
    compareAtPrice: 799,
    images: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1631214499770-27d2bd0595d6?auto=format&fit=crop&w=900&q=80',
    ],
    ingredients: ['Isododecane', 'Dimethicone', 'Trimethylsiloxysilicate', 'Pigments'],
    stock: 110,
    rating: 4.6,
    numReviews: 940,
    ratingBreakdown: { 5: 720, 4: 160, 3: 40, 2: 12, 1: 8 },
    tags: ['maybelline', 'lipstick', 'matte ink', 'makeup'],
    trending: true,
  },
  {
    name: 'Lash Sensational Sky High Waterproof Mascara',
    slug: 'maybelline-lash-sensational-sky-high-mascara',
    brand: 'Maybelline',
    category: 'Makeup',
    shortDescription: 'Limitless length and volume mascara infused with bamboo extract.',
    description:
      'Sky High mascara impact from every angle! Delivers full volume and limitless length with an exclusive Flex Tower mascara brush that bends to volumize and extend every single lash.',
    price: 799,
    compareAtPrice: 899,
    images: [
      'https://images.unsplash.com/photo-1631214499770-27d2bd0595d6?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=900&q=80',
    ],
    ingredients: ['Bamboo Extract', 'Rayon Fibers', 'Cera Alba', 'Iron Oxides'],
    stock: 85,
    rating: 4.8,
    numReviews: 720,
    ratingBreakdown: { 5: 590, 4: 95, 3: 25, 2: 6, 1: 4 },
    tags: ['maybelline', 'mascara', 'makeup', 'sky high'],
    trending: true,
  },
  {
    name: 'Hydro Boost Water Gel Moisturizer with Hyaluronic Acid',
    slug: 'neutrogena-hydro-boost-water-gel',
    brand: 'Neutrogena',
    category: 'Skincare',
    shortDescription: 'Oil-free gel moisturizer that instantly quenches dry skin.',
    description:
      'Neutrogena Hydro Boost Water Gel quenches dry skin and keeps it looking smooth, supple and hydrated day after day. The unique light-weight water gel formula absorbs quickly like a gel, but has the long-lasting, intense moisturizing power of a cream.',
    price: 1150,
    compareAtPrice: 1350,
    images: [
      'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=900&q=80',
    ],
    ingredients: ['Hyaluronic Acid', 'Olive Extract', 'Dimethicone', 'Glycerin'],
    stock: 75,
    rating: 4.7,
    numReviews: 390,
    ratingBreakdown: { 5: 300, 4: 68, 3: 15, 2: 4, 1: 3 },
    tags: ['neutrogena', 'hydro boost', 'moisturizer', 'skincare'],
    trending: true,
  },
  {
    name: 'Ultra Sheer Dry-Touch Sunscreen SPF 50+',
    slug: 'neutrogena-ultra-sheer-dry-touch-spf-50',
    brand: 'Neutrogena',
    category: 'Sunscreens',
    shortDescription: 'Non-greasy, broad spectrum SPF 50+ protection with matte finish.',
    description:
      'Formulated with Helioplex Technology, Neutrogena Ultra Sheer Dry-Touch Sunscreen provides superior broad spectrum protection against aging UVA and burning UVB rays. Absorbs fast for a light, invisible, matte finish.',
    price: 850,
    compareAtPrice: 999,
    images: [
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=900&q=80',
    ],
    ingredients: ['Avobenzone', 'Homosalate', 'Octisalate', 'Helioplex Complex'],
    stock: 95,
    rating: 4.5,
    numReviews: 530,
    ratingBreakdown: { 5: 370, 4: 110, 3: 35, 2: 10, 1: 5 },
    tags: ['neutrogena', 'sunscreen', 'spf 50', 'dry touch'],
    trending: true,
  },
  {
    name: 'Soft Refreshing Light Moisturizing Cream',
    slug: 'nivea-soft-refreshing-light-moisturizing-cream',
    brand: 'Nivea',
    category: 'Skincare',
    shortDescription: 'Non-greasy, fast-absorbing moisturizing cream with Jojoba Oil.',
    description:
      'Nivea Soft is an all-in-one moisturizing cream for face, hands and body. Enriched with Jojoba Oil and Vitamin E, it deeply hydrates skin while leaving a refreshing, velvety soft touch.',
    price: 399,
    compareAtPrice: 499,
    images: [
      'https://images.unsplash.com/photo-1571875257727-256c39da42af?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=900&q=80',
    ],
    ingredients: ['Jojoba Seed Oil', 'Vitamin E (Tocopheryl Acetate)', 'Glycerin'],
    stock: 150,
    rating: 4.4,
    numReviews: 310,
    ratingBreakdown: { 5: 210, 4: 70, 3: 20, 2: 7, 1: 3 },
    tags: ['nivea', 'moisturizer', 'nivea soft', 'skincare'],
    trending: false,
  },
  {
    name: 'Sun Protect & Moisture SPF 50 Sun Lotion',
    slug: 'nivea-sun-protect-and-moisture-spf-50',
    brand: 'Nivea',
    category: 'Sunscreens',
    shortDescription: 'Immediate UVA/UVB protection with deep 48-hour moisture.',
    description:
      'Provides immediate broad spectrum protection against sunburn and premature skin aging. Water-resistant formula enriched with Vitamin E keeps skin hydrated for 48 hours.',
    price: 650,
    compareAtPrice: 750,
    images: [
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=900&q=80',
    ],
    ingredients: ['Vitamin E', 'UVA/UVB Filters', 'Glycerin', 'Panthenol'],
    stock: 80,
    rating: 4.5,
    numReviews: 270,
    ratingBreakdown: { 5: 190, 4: 55, 3: 18, 2: 5, 1: 2 },
    tags: ['nivea', 'sunscreen', 'spf 50', 'sun protect'],
    trending: false,
  },
  {
    name: 'C15 Super Booster 15% Vitamin C Serum',
    slug: 'paulas-choice-c15-super-booster-vitamin-c-serum',
    brand: "Paula's Choice",
    category: 'Serums',
    shortDescription: 'Concentrated 15% Vitamin C serum for brightened, firmer skin.',
    description:
      "Potent 15% Vitamin C (L-Ascorbic Acid) combined with Ferulic Acid and Vitamin E visibly brightens dull skin, smooths uneven texture, and reduces visible signs of aging for a radiant glow.",
    price: 3500,
    compareAtPrice: 3900,
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1601049541289-9b1b7abc73f2?auto=format&fit=crop&w=900&q=80',
    ],
    ingredients: ['15% L-Ascorbic Acid', '0.5% Ferulic Acid', 'Vitamin E', 'Hyaluronic Acid'],
    stock: 30,
    rating: 4.8,
    numReviews: 195,
    ratingBreakdown: { 5: 160, 4: 25, 3: 7, 2: 2, 1: 1 },
    tags: ["paula's choice", 'vitamin c', 'serum', 'radiance'],
    trending: true,
  },
  {
    name: 'AM Facial Moisturizing Lotion with Broad Spectrum SPF 30',
    slug: 'cerave-am-facial-moisturizing-lotion-spf-30',
    brand: 'CeraVe',
    category: 'Sunscreens',
    shortDescription: 'Daytime moisturizer with SPF 30, ceramides, and niacinamide.',
    description:
      'Formulated with broad spectrum SPF 30 sunscreen and micro-fine Zinc Oxide technology. Hydrates throughout the day while helping restore the protective skin barrier with 3 essential ceramides.',
    price: 1650,
    compareAtPrice: 1890,
    images: [
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=900&q=80',
    ],
    ingredients: ['Zinc Oxide', 'Ceramides 1, 3, 6-II', 'Niacinamide', 'Hyaluronic Acid'],
    stock: 50,
    rating: 4.6,
    numReviews: 240,
    ratingBreakdown: { 5: 180, 4: 45, 3: 10, 2: 3, 1: 2 },
    tags: ['cerave', 'sunscreen', 'spf 30', 'moisturizer'],
    trending: false,
  },
  {
    name: 'Moisturizing Cream with Hyaluronic Acid & Ceramides',
    slug: 'cerave-moisturizing-cream',
    brand: 'CeraVe',
    category: 'Skincare',
    shortDescription: 'Rich barrier-restoring cream for dry to very dry skin.',
    description:
      'Rich, non-greasy moisturizing cream that provides 24-hour hydration and helps restore the protective skin barrier with three essential ceramides and MVE Technology.',
    price: 1490,
    compareAtPrice: 1690,
    images: [
      'https://images.unsplash.com/photo-1571875257727-256c39da42af?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=900&q=80',
    ],
    ingredients: ['Ceramides 1, 3, 6-II', 'Hyaluronic Acid', 'Petrolatum'],
    stock: 85,
    rating: 4.9,
    numReviews: 512,
    ratingBreakdown: { 5: 460, 4: 42, 3: 7, 2: 2, 1: 1 },
    tags: ['cerave', 'moisturizer', 'skincare', 'barrier cream'],
    trending: true,
  },
];

const seedDatabase = async (force = false) => {
  try {
    const existingCount = await Product.countDocuments();
    if (existingCount > 0 && !force) {
      console.log(`Database already contains ${existingCount} products. Auto-seed skipped.`);
      return;
    }

    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    await User.create({
      name: 'AuraLuxe Atelier',
      email: 'admin@auraluxe.com',
      password: 'Admin@123',
      role: 'admin',
      phone: '9876543210',
    });

    await User.create({
      name: 'Aanya Mehra',
      email: 'aanya@auraluxe.com',
      password: 'Guest@123',
      role: 'customer',
      phone: '9123456780',
      addresses: [
        {
          label: 'Home',
          fullName: 'Aanya Mehra',
          phone: '9123456780',
          line1: '14, Orchid Residences',
          line2: 'Bandra West',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400050',
          isDefault: true,
        },
      ],
    });

    await Product.insertMany(products);
    console.log(`Successfully seeded ${products.length} real-world global brand products, admin, and demo customer.`);
    console.log('Admin: admin@auraluxe.com / Admin@123');
    console.log('Customer: aanya@auraluxe.com / Guest@123');
  } catch (error) {
    console.error('Error seeding database:', error);
    if (force) process.exit(1);
  }
};

if (require.main === module) {
  (async () => {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.error('MONGO_URI is not set in environment. Aborting seed.');
      process.exit(1);
    }

    try {
      await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 5000, dbName: 'auraluxe' });
      console.log(`Connected to MongoDB Atlas: ${mongoose.connection.host}`);
      console.log(`Using database: ${mongoose.connection.name}`);
    } catch (connErr) {
      console.error('Failed to connect to MongoDB Atlas:', connErr.message);
      process.exit(1);
    }

    try {
      await seedDatabase(true);
      await mongoose.disconnect();
      console.log('Seeding completed and connection closed.');
      process.exit(0);
    } catch (err) {
      console.error('Seeding failed:', err);
      try {
        await mongoose.disconnect();
      } catch (e) { }
      process.exit(1);
    }
  })();
}

module.exports = seedDatabase;
