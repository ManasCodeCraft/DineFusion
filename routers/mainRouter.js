const {mainpage, menupage, editmenu, managestaff, userFeedback, getPaymentPage} = require('../controllers/mainController')
const { OwnerProtectRoute, protectRoute } = require('../controllers/authControllers')
const express = require('express')

const mainRouter = express.Router()

mainRouter.route('/').get(mainpage)
mainRouter.route('/menu').get(menupage)
mainRouter.route('/editablemenu').get(OwnerProtectRoute, editmenu)
mainRouter.route('/managestaff').get(OwnerProtectRoute, managestaff)
mainRouter.route('/userFeedback').get(protectRoute, userFeedback)
mainRouter.route('/paymentportal').get(protectRoute, getPaymentPage)

module.exports = mainRouter