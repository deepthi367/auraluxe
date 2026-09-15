const express = require('express');
const {
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.put('/profile', protect, updateProfile);
router.post('/addresses', protect, addAddress);
router.put('/addresses/:addressId', protect, updateAddress);
router.delete('/addresses/:addressId', protect, deleteAddress);

module.exports = router;
