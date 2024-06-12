const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'CanteenMenu', required: true },
      quantity: { type: Number, required: true },
    },
  ],
  price: { type: Number, required: true, min: 0 },
  transactionId: { type: String, required: true },
  address: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Accepted', 'Declined', 'In Progress', 'Completed', 'Pending Approval to Cancel', 'Cancelled', 'On the Way'], default: 'Pending' },
  pickupTime: { type: String, default: formatPickupTime(new Date(Date.now() + 30 * 60000)) },
  feedback: { type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

function formatPickupTime(date) {
  if(date instanceof Date){
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  return `${formattedHours}:${minutes} ${ampm}`;
  }
  return date
}

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
