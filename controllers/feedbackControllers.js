const { asyncRequestHandler } = require('../utils/functionWrappers');
const { addFeedback, getAllFeedbacks } = require('../services/feedbackServices');
const { getOrderItems } = require('../services/orderServices');

module.exports.createFeedback = asyncRequestHandler(async (req, res) => {
    const feedback = await addFeedback(req.body);
    res.status(201).json({
        success: true,
        data: feedback
    });            
})
  

module.exports.getAllFeedback = asyncRequestHandler(async (req, res) => {
    const feedback = await getAllFeedbacks();
    var feedbackdata = []
    for(let feedback_ of feedback){
      let data_ = await getOrderItems(feedback_.order)
      feedbackelement = {
        id: feedback_._id,
        orderDetails: data_['orderdetails'],
        user: data_['user'],
        ratings: feedback_.ratings,
        experience: feedback_.experience,
        suggestions: feedback_.suggestions
      }
      feedbackdata.push(feedbackelement)
    }
    res.status(200).json({ feedback: feedbackdata });
});

