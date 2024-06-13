const path = require('path')
const { asyncRequestHandler } = require('../utils/functionWrappers');
const { getTotalPrice } = require('../services/canteenMenuServices');
const { registerOrder, getOrderItems, getAllOrderForUser, getAllOrders, updateUserOrder, getOrderById } = require('../services/orderServices');
const { formatOrderForUser, formatOrderForStaff, unexpectedError, formatOrderTrackData } = require('../utils/format');
const { getUserName } = require('../services/authServices');

module.exports.placeOrder = asyncRequestHandler(async (req, res) => {
    const items = req.body.items;
    const transactionId = req.body.transactionId
    const address = req.body.address
    const user = req.userid;
    if (!user) {
       return res.status(400).json({ message: 'user not logged in', 'loginerror': true });
    }

    const price = await getTotalPrice(items);

    const savedOrder = await registerOrder({ user, items, price, transactionId, address });
     
    return res.status(200).json({ message: 'Order placed successfully', order: savedOrder });
});


module.exports.viewAllOrders = asyncRequestHandler(async (req, res) => {
    const orders = await getAllOrders();
    const ordersData = [];
    
    for (let order of orders) {
      const orderDetails = await getOrderItems(order._id);
      const username = await getUserName(order.user);
      const orderelement = formatOrderForStaff(order, orderDetails, username)
      ordersData.push(orderelement);
    }
    
    res.status(200).json(ordersData);
});


module.exports.updateOrderStatus = asyncRequestHandler(async (req, res) => {
    const { status, orderId } = req.body;

    const updatedOrder = await updateUserOrder(
      orderId,
      { status, updatedAt: Date.now() },
    );

    if (!updatedOrder) {
       throw unexpectedError(404);
    }

    res.status(200).json({ message: 'Order status updated successfully', order: updatedOrder });
})

module.exports.updatePickUptime = asyncRequestHandler(async (req, res) => {
    const { pickupTime, orderId } = req.body;

    const updatedOrder = await updateUserOrder(
      orderId,
      { pickupTime, updatedAt: Date.now() },
    );

    if (!updatedOrder) {
      throw unexpectedError(404);
    }

    res.status(200).json({ message: 'Order status updated successfully', order: updatedOrder });
})

module.exports.viewUserOrders = asyncRequestHandler(async (req, res) => {
    const userId = req.userid; 
    const userOrders = await getAllOrderForUser(userId);
    if(!userOrders){
      throw unexpectedError(404);
    }

    var userOrdersData = []
    for (const order of userOrders) {
      let orderdetails = await getOrderItems(order._id)
      let orderelement = formatOrderForUser(order, orderdetails)
      userOrdersData.push(orderelement);
    }
    res.status(200).json(userOrdersData);
})

module.exports.orderTrackData = asyncRequestHandler(async function(req,res){
    const orderId = req.body.orderId;
    const order = await getOrderById(orderId);
    if (!order) {
      throw unexpectedError(404);
    }
    const orderdata = await formatOrderTrackData(order);
    res.status(200).json({ order: orderdata });

});


module.exports.congrats = async function(req, res) {
  res.render('pages/congrats');
}

module.exports.getMyOrdersPage = async function(req, res) {
  res.render('pages/Your_Order');
}

module.exports.getorderrequest = async function(req, res) {
  res.render('pages/order_request');
}

module.exports.gettrackorder = async function(req, res) {
  res.render('pages/track');
}

