exports.COUPONS = {
  LUXE20: { type: 'percent', value: 20, min: 1499 },
  AURA10: { type: 'percent', value: 10, min: 0 },
  WELCOME15: { type: 'percent', value: 15, min: 999 },
  GOLD500: { type: 'flat', value: 500, min: 2999 },
};

exports.TAX_RATE = 0.18;
exports.FREE_SHIPPING_THRESHOLD = 1999;
exports.SHIPPING_FEE = 99;

exports.calculateTotals = (itemsPrice, couponCode) => {
  const coupons = exports.COUPONS;
  let discount = 0;
  const code = (couponCode || '').toUpperCase().trim();
  const coupon = coupons[code];

  if (coupon && itemsPrice >= coupon.min) {
    discount = coupon.type === 'percent' ? (itemsPrice * coupon.value) / 100 : coupon.value;
    discount = Math.min(discount, itemsPrice);
  }

  const taxable = Math.max(itemsPrice - discount, 0);
  const taxPrice = Math.round(taxable * exports.TAX_RATE);
  const shippingPrice = taxable >= exports.FREE_SHIPPING_THRESHOLD || taxable === 0 ? 0 : exports.SHIPPING_FEE;
  const totalPrice = Math.round(taxable + taxPrice + shippingPrice);

  return {
    itemsPrice,
    discount: Math.round(discount),
    taxPrice,
    shippingPrice,
    totalPrice,
    couponApplied: coupon && itemsPrice >= coupon.min ? code : '',
  };
};
