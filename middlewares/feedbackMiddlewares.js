const { ifOrderIsCompleted, getOrderFeedback } = require("../services/orderServices");
const { asyncRequestHandler } = require("../utils/functionWrappers");


module.exports.verifyFeedback = asyncRequestHandler(async (req, res, next)=>{
    const { order, ratings, experience, suggestions } = req.body;
    if(!order || !ratings || !experience || !suggestions){
        throw getError(400, 'Invalid Feedback', 'Please fill all the require fields')
    }

    if(await ifOrderIsCompleted(order) && !(await getOrderFeedback(order))){
       next()
    }

    throw getError(400, 'Invalid Feedback', 'Order is not completed or feedback is already provided')
})

