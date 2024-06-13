const Order = require('../models/Order')
const User = require('../models/authModel')
const CanteenMenuModel = require('../models/canteenMenuModel')
const { asyncHandler } = require('../utils/functionWrappers')

module.exports.ifOrderIsCompleted = asyncHandler(async (id)=>{
    const order = await Order.findById(id)
    if(order.status === 'completed'){
        return true
    }else{
        return false
    }
})

module.exports.getOrderFeedback = asyncHandler(async (id)=>{
    const order = await Order.findById(id)
    return order.feedback;
})

module.exports.getOrderItems = asyncHandler(async (id)=>{
    let order = await Order.findById(id);
    let items = order.items;
    let user = await User.findById(order.user)
    let username = 'user not found'
    if(user){
       username = user.name
    }
    let orderdetails = "";
    for (const item of items) {
      let item_ = await CanteenMenuModel.findById(item.menuItem);
      let item_name = item_.itemName;
      orderdetails += `${item.quantity} X ${item_name}, `;
    }
    orderdetails = orderdetails.replace(/, $/, ''); 
    return {'orderdetails': orderdetails, 'user': username}
})

module.exports.registerOrder = asyncHandler(async (data)=>{
    const newOrder = new Order(data);
    const savedOrder = await newOrder.save();
    return savedOrder;
})

module.exports.getAllOrderForUser = asyncHandler(async (userId)=>{
    const orders = await Order.find({user: userId})
    return orders;
})

module.exports.getAllOrders = asyncHandler(async ()=>{
    const orders = await Order.find()
    return orders;
})


module.exports.updateUserOrder = asyncHandler(async (id, data)=>{
    return await Order.findByIdAndUpdate(id, data);
})

module.exports.getOrderById = asyncHandler(async (id)=>{
    return Order.findById(id);
})