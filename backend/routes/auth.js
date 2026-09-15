const express = require('express');
const {
  register,
  login,
  getMe,
  registerValidators,
  loginValidators,
  handleValidation,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', registerValidators, handleValidation, register);
router.post('/login', loginValidators, handleValidation, login);
router.get('/me', protect, getMe);

module.exports = router;
