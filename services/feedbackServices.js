const Feedback = require('../models/feedbackModel');
const Order = require('../models/Order')
const { asyncHandler } = require('../utils/errorHandlers')

module.exports.addFeedback = asyncHandler(async (data)=>{
    const feedback = new Feedback(data);
    await feedback.save();

    await Order.findByIdAndUpdate(data.order, {feedback: feedback._id})
    return feedback;
})

module.exports.getAllFeedbacks = asyncHandler(async ()=>{
    return await Feedback.find();
})