const jwt = require('jsonwebtoken');
const { syncHandler, asyncHandler } = require('./errorHandlers');
const { logincookietoken } = require('../config/config');
const jwtKey = require('../config/config').jwtKey;

// function for preparation of login cookie
module.exports.prepareLoginCookie = syncHandler(function (value){
    const hashValue = jwt.sign(value, jwtKey);
    
    var options = {};
    if(process.env.NODE_ENV !== 'production'){
        options = {
            httpOnly: true,
            secure: false
        }
    }
    else{
        // for production environment
        options = {
            httpOnly: true,
            secure: true
        }
    }

    const cookie = [logincookietoken, hashValue, options];
    return cookie;
})
