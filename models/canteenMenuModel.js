const mongoose = require('mongoose');

const canteenMenuSchema = new mongoose.Schema({
  itemName: { type: String, required: [true, 'Item name is required'], unique: true },
  price: { type: Number, required: [true, 'Price is required'], min: [0, 'Price must be non-negative'] },
  category: { type: String, required: [true, 'Category is required'] },
  available: { type: Boolean, default: true },
  image: { type: String }, 
});

const CanteenMenu = mongoose.model('CanteenMenu', canteenMenuSchema);

module.exports = CanteenMenu;
