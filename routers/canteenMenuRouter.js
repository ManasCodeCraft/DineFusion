const express = require('express')
const { addItem, updateItem, deleteItem, getAllItems, updateItemImage } = require('../controllers/canteenMenuControllers')
const { OwnerProtectRoute } = require('../middlewares/authMiddlewares')
const { verifyNewItem, itemimageupload, managefilepath } = require('../middlewares/canteenMenuMiddlewares')

const canteenMenuRouter = express.Router()

canteenMenuRouter.route('/addItem').post(OwnerProtectRoute, itemimageupload, managefilepath , verifyNewItem, addItem)
canteenMenuRouter.route('/deleteItem').post(OwnerProtectRoute, deleteItem)
canteenMenuRouter.route('/updateItemImage').post(OwnerProtectRoute, itemimageupload, managefilepath, updateItemImage)
canteenMenuRouter.route('/updateItem').post(OwnerProtectRoute, updateItem)
canteenMenuRouter.route('/fetchallitem').get(getAllItems)

module.exports = canteenMenuRouter