const { ifOrderIsCompleted, getOrderFeedback } = require("../services/orderServices");
const { asyncRequestHandler } = require("../utils/functionWrappers");
const { getError} = require('../utils/format')


module.exports.verifyFeedback = asyncRequestHandler(async (req, res, next)=>{
    const { order, ratings, experience, suggestions } = req.body;
    if(!order || !ratings ){
        throw getError(400, 'Invalid Feedback', 'Please provide a rating')
    }

    if(await ifOrderIsCompleted(order)){
        if(await getOrderFeedback(order)){
            throw getError(400, 'Invalid Feedback', 'Feedback is already provided')
        }
        return next()
    }

    throw getError(400, 'Invalid Feedback', 'Order is not completed yet')
})

