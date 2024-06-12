const { addNewItemInMenu, removeItemFromMenu, updateMenuItemImage, getAllItemsInMenu, updateMenuItem } = require('../services/canteenMenuServices');
const { asyncRequestHandler } = require('../utils/errorHandlers');
const { unexpectedError, getError } = require('../utils/format');

const fs = require('fs').promises

module.exports.addItem = asyncRequestHandler(async (req, res) => {
    const savedItem = await addNewItemInMenu(req.body);
    if(!savedItem){
        throw unexpectedError(400);
    }

    res.status(200).json({ message: 'Item added successfully', item: savedItem });
});


module.exports.deleteItem = asyncRequestHandler(async (req, res) => {
    const itemId = req.body.id;
    if(!itemId){
       throw getError(400, 'Failed', 'Invalid Item')
    }

    const deletedItem = await removeItemFromMenu(itemId);

    let imagepath = deletedItem.image
    await fs.unlink(`./public/${imagepath}`)

    res.status(200).json({ message: 'Item deleted successfully', item: deletedItem });
});


module.exports.updateItemImage = asyncRequestHandler(async (req, res) => {
    const image = req.body.image;
    const itemId = req.body.id;
    const updatedItem = await updateMenuItemImage(itemId, image)

    res.status(200).json({ message: 'Item updated successfully', item: updatedItem });
})


module.exports.updateItem = async (req, res) => {
    const itemId = req.body.id;
    const {itemName, price, category, available} = req.body;

    const updatedItem = await updateMenuItem(
      itemId,
      {
        itemName,
        price,
        category,
        available: available || true
      }
    )

    res.status(200).json({ message: 'Item updated successfully', item: updatedItem });
};


module.exports.getAllItems = asyncRequestHandler(async (req, res) => {
    const items = await getAllItemsInMenu();
    res.status(200).json(items);
});

