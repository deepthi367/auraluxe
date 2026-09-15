const Order = require('../models/Order');
const Product = require('../models/Product');
const { calculateTotals, COUPONS } = require('../utils/pricing');

const validateCoupon = (req, res) => {
  const code = (req.body.code || '').toUpperCase().trim();
  const itemsPrice = Number(req.body.itemsPrice) || 0;
  const coupon = COUPONS[code];
  if (!coupon) {
    return res.status(400).json({ message: 'Invalid coupon code' });
  }
  if (itemsPrice < coupon.min) {
    return res.status(400).json({
      message: `Coupon requires a minimum subtotal of ₹${coupon.min}`,
    });
  }
  const totals = calculateTotals(itemsPrice, code);
  res.json({ ...totals, message: `${code} applied` });
};

const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, couponCode, paymentResult } = req.body;
    if (!items || items.length === 0) {
      res.status(400);
      throw new Error('Bag is empty');
    }
    if (!shippingAddress) {
      res.status(400);
      throw new Error('Shipping address is required');
    }

    let itemsPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        res.status(400);
        throw new Error(`Product not found: ${item.product}`);
      }
      if (product.stock < item.qty) {
        res.status(400);
        throw new Error(`${product.name} is out of stock`);
      }
      itemsPrice += product.price * item.qty;
      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0],
        price: product.price,
        qty: item.qty,
      });
    }

    const totals = calculateTotals(itemsPrice, couponCode);

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      couponCode: totals.couponApplied,
      discount: totals.discount,
      itemsPrice: totals.itemsPrice,
      taxPrice: totals.taxPrice,
      shippingPrice: totals.shippingPrice,
      totalPrice: totals.totalPrice,
      paymentMethod: 'Razorpay',
      paymentResult: paymentResult || {},
      isPaid: Boolean(paymentResult?.id),
      paidAt: paymentResult?.id ? new Date() : undefined,
      status: 'Pending',
    });

    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.qty } });
    }

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to view this order');
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }
    order.status = req.body.status || order.status;
    if (order.status === 'Delivered') order.deliveredAt = new Date();
    await order.save();
    res.json(order);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validateCoupon,
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
