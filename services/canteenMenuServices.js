const { asyncHandler } = require("../utils/errorHandlers");
const CanteenMenu = require('../models/canteenMenuModel');
const fs = require('fs').promises

module.exports.addNewItemInMenu = asyncHandler(async (data)=>{
   const newItem = await CanteenMenu(data);
   return newItem.save();
})

module.exports.getAllItemsInMenu = asyncHandler(async ()=>{
    const items = await CanteenMenu.find();
    return items;
})

module.exports.removeItemFromMenu = asyncHandler(async (id)=>{
    return CanteenMenu.findByIdAndDelete(id);
})

module.exports.updateMenuItemImage = asyncHandler(async (id, image)=>{
    const item = await CanteenMenu.findById(id);
    await fs.unlink(`./public/${item.image}`)
    return CanteenMenu.findByIdAndUpdate(id, {image: image});
})

module.exports.updateMenuItem = asyncHandler(async (id, item)=>{
    if(typeof item !== 'object'){
        throw getError(400, 'Invalid', 'Invalid Item Details');
    }

    return CanteenMenu.findByIdAndUpdate(id, item);
})

module.exports.getTotalPrice = asyncHandler(async (items)=>{
    var price = 0;
    for (let item of items) {
       let item_ = await CanteenMenu.findById(item.menuItem);
       price += item_.price*item.quantity;
    }
    return price;
})