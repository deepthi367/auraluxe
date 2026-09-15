const crypto = require('crypto');
const Razorpay = require('razorpay');
const { calculateTotals } = require('../utils/pricing');
const Product = require('../models/Product');

const getRazorpay = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) return null;
  return new Razorpay({ key_id, key_secret });
};

const getKey = (req, res) => {
  res.json({
    key: process.env.RAZORPAY_KEY_ID || '',
    demo: !process.env.RAZORPAY_KEY_ID,
  });
};

const createRazorpayOrder = async (req, res, next) => {
  try {
    const { items, couponCode } = req.body;
    if (!items?.length) {
      res.status(400);
      throw new Error('Bag is empty');
    }

    let itemsPrice = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        res.status(400);
        throw new Error('Product not found');
      }
      itemsPrice += product.price * item.qty;
    }

    const totals = calculateTotals(itemsPrice, couponCode);
    const amountPaise = totals.totalPrice * 100;
    const instance = getRazorpay();

    if (!instance) {
      return res.json({
        demo: true,
        amount: amountPaise,
        currency: 'INR',
        totals,
        orderId: `demo_${Date.now()}`,
      });
    }

    const order = await instance.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: `alx_${Date.now()}`,
    });

    res.json({
      demo: false,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      totals,
    });
  } catch (error) {
    next(error);
  }
};

const verifyPayment = (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!secret) {
      return res.json({ valid: true, demo: true });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto.createHmac('sha256', secret).update(body).digest('hex');
    if (expected !== razorpay_signature) {
      res.status(400);
      throw new Error('Payment verification failed');
    }
    res.json({ valid: true });
  } catch (error) {
    next(error);
  }
};

module.exports = { getKey, createRazorpayOrder, verifyPayment };
