const { asyncRequestHandler } = require("../utils/functionWrappers");
const { getError } = require("../utils/format");


module.exports.verifyPlaceOrder = asyncRequestHandler(async (req, res, next)=>{
    const items = req.body.items;
    const transactionId = req.body.transactionId
    const address = req.body.address
    const user = req.userid;

    if(!user){
        throw getError(401, 'Login Required', 'Please login first before placing order');
    }

    if(!items || !transactionId || !address){
        throw getError(400, 'Bad Request', 'Please fill all the fields');
    }

    next();
})