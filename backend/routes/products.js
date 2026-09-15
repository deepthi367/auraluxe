const express = require('express');
const {
  getProducts,
  suggestProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

router.get('/', getProducts);
router.get('/suggest', suggestProducts);
router.get('/slug/:slug', getProductBySlug);
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
