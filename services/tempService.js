const fs = require('fs');
const path = require('path');
const CanteenMenu = require('../models/canteenMenuModel'); // Adjust the path as necessary

const menuDir = path.join(__dirname, '../public', 'img', 'menu');
const prices = [100, 340, 600]; // Example prices

module.exports.tempFun = async () => {
  try {
    const categories = fs.readdirSync(menuDir);
    
    for (const category of categories) {
      const categoryDir = path.join(menuDir, category);
      const files = fs.readdirSync(categoryDir);

      for (const file of files) {
        const itemName = file.replace(/^.*?-/, '').replace('.png', '');
        const price = prices[Math.floor(Math.random() * prices.length)]; // Random price selection

        const newItem = new CanteenMenu({
          itemName: itemName,
          price: price,
          category: category,
          available: true,
          image: path.join('img', 'menu', category, file) // Adjusted relative path to image
        });

        await newItem.save();
        console.log(`Added item: ${itemName} in category: ${category} with price: ${price}`);
      }
    }
    console.log('All items have been added to the database.');
  } catch (error) {
    console.error('Error adding items to the database:', error);
  }
};

