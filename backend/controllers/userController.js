const User = require('../models/User');

const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.name = req.body.name || user.name;
    user.phone = req.body.phone ?? user.phone;
    if (req.body.password) user.password = req.body.password;
    const updated = await user.save();
    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      phone: updated.phone,
      addresses: updated.addresses,
    });
  } catch (error) {
    next(error);
  }
};

const addAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (req.body.isDefault) {
      user.addresses.forEach((a) => {
        a.isDefault = false;
      });
    }
    user.addresses.push(req.body);
    await user.save();
    res.status(201).json(user.addresses);
  } catch (error) {
    next(error);
  }
};

const updateAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const address = user.addresses.id(req.params.addressId);
    if (!address) {
      res.status(404);
      throw new Error('Address not found');
    }
    Object.assign(address, req.body);
    if (req.body.isDefault) {
      user.addresses.forEach((a) => {
        if (a._id.toString() !== address._id.toString()) a.isDefault = false;
      });
    }
    await user.save();
    res.json(user.addresses);
  } catch (error) {
    next(error);
  }
};

const deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter((a) => a._id.toString() !== req.params.addressId);
    await user.save();
    res.json(user.addresses);
  } catch (error) {
    next(error);
  }
};

module.exports = { updateProfile, addAddress, updateAddress, deleteAddress };
