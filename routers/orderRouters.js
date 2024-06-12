const express = require('express')
const { viewUserOrders, placeOrder, congrats, getorderrequest, viewAllOrders, updateOrderStatus, getMyOrdersPage, gettrackorder, updatePickUptime, orderTrackData } = require('../controllers/orderController')
const { protectRoute, StaffProtectRoute } = require('../middlewares/authMiddlewares')
const { verifyPlaceOrder } = require('../middlewares/orderMiddlewars')
const orderRouter = express.Router()

orderRouter.route('/fetchuserorder').get(protectRoute,viewUserOrders)
orderRouter.route('/placeorder').post(protectRoute, verifyPlaceOrder,placeOrder)
orderRouter.route('/congrats').get(protectRoute,congrats)
orderRouter.route('/order-request').get(StaffProtectRoute ,getorderrequest)
orderRouter.route('/fetchorderrequest').get(StaffProtectRoute, viewAllOrders)
orderRouter.route('/updateorderstatus').post(updateOrderStatus)
orderRouter.route('/myorders').get(protectRoute,getMyOrdersPage)
orderRouter.route('/track').get(protectRoute, gettrackorder)
orderRouter.route('/updatepickuptime').post(protectRoute, updatePickUptime)
orderRouter.route('/trackorderdata').post(protectRoute, orderTrackData)

module.exports = orderRouter