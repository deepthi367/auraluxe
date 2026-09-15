const Product = require('../models/Product');

const getProducts = async (req, res, next) => {
  try {
    const {
      q,
      category,
      minPrice,
      maxPrice,
      minRating,
      sort,
      trending,
      limit = 24,
      page = 1,
    } = req.query;

    const filter = {};
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
      ];
    }
    if (category && category !== 'All') {
      const lowerCat = category.trim().toLowerCase();
      if (lowerCat === 'makeup') {
        filter.category = { $in: ['Makeup', 'Luxury Makeup', 'Lipsticks', /^makeup$/i] };
      } else {
        filter.category = { $regex: new RegExp(`^${category.trim()}$`, 'i') };
      }
    }
    // brand filter (exact match, case-insensitive)
    if (req.query.brand) {
      const brand = req.query.brand.trim();
      if (brand) filter.brand = { $regex: new RegExp(`^${brand}$`, 'i') };
    }
    // subcategory filter: match tags or category or name
    if (req.query.subcategory) {
      const sub = req.query.subcategory.trim();
      if (sub) {
        const rx = { $regex: new RegExp(sub, 'i') };
        filter.$or = filter.$or || [];
        filter.$or.push({ tags: rx }, { category: rx }, { name: rx });
      }
    }
    if (trending === 'true') filter.trending = true;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (minRating) filter.rating = { $gte: Number(minRating) };

    let query = Product.find(filter);
    if (sort === 'price_asc') query = query.sort({ price: 1 });
    else if (sort === 'price_desc') query = query.sort({ price: -1 });
    else if (sort === 'top_rated') query = query.sort({ rating: -1, numReviews: -1 });
    else query = query.sort({ createdAt: -1 });

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      query.skip(skip).limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    res.json({ products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    next(error);
  }
};

const suggestProducts = async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return res.json([]);
    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
      ],
    })
      .select('name slug images price category brand')
      .limit(8);
    res.json(products);
  } catch (error) {
    next(error);
  }
};

const getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    res.json({ message: 'Product removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  suggestProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
};
