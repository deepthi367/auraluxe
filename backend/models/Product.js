const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: String,
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    brand: { type: String, default: 'AuraLuxe' },
    category: {
      type: String,
      required: true,
      enum: ['Facewashes', 'Skincare', 'Makeup', 'Luxury Makeup', 'Serums', 'Sunscreens', 'Lipsticks', 'Eye Care', 'Toners'],
    },
    description: { type: String, required: true },
    shortDescription: { type: String, default: '' },
    price: { type: Number, required: true },
    compareAtPrice: { type: Number },
    images: [{ type: String, required: true }],
    ingredients: [{ type: String }],
    stock: { type: Number, required: true, default: 0 },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    ratingBreakdown: {
      5: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      1: { type: Number, default: 0 },
    },
    tags: [{ type: String }],
    trending: { type: Boolean, default: false },
    reviews: [reviewSchema],
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', brand: 'text', category: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
