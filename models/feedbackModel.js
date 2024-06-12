const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  ratings: {type: Number, min: [1,'Invalid rating'], required: [true, 'Please provide rating']},
  experience: {type: String, min: [10, 'Too Short']},
  suggestions: {type: String, min: [10, 'Too Short']}
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
