const mongoose = require('mongoose');
const { dbConnectonLink } = require('./config');

mongoose.connect(dbConnectonLink).then(()=>{
    console.log('MongoDB connection established')
}).catch((error)=>{
    console.error('MongoDB connection error', error)
})

module.exports = mongoose;