const express = require('express')
const { getAllFeedback, createFeedback } =require('../controllers/feedbackControllers.js')
const { GetFeedbackPage, feedbackthanks } = require('../controllers/mainController')
const { StaffProtectRoute } = require('../middlewares/authMiddlewares')
const { verifyFeedback } = require('../middlewares/feedbackMiddlewares.js')

const feedbackRouter = express.Router()

feedbackRouter.route('/fetchallfeedback').get(StaffProtectRoute, getAllFeedback)
feedbackRouter.route('/create').post(verifyFeedback ,createFeedback)
feedbackRouter.route('/getfeedbackpage').get(StaffProtectRoute, GetFeedbackPage)
feedbackRouter.route('/thanks').get(feedbackthanks)

module.exports = feedbackRouter