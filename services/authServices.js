const { asyncHandler } = require("../utils/errorHandlers");
const User = require("../models/authModel");

module.exports.registerUser = asyncHandler(async (user)=>{
    const userObj = new User(user);
    return await userObj.save();
})

module.exports.getUserByEmail = asyncHandler(async (email)=>{
    return await User.findOne({email: email});
})

module.exports.fetchAllStaff = asyncHandler(async ()=>{
    const staff = await User.find({ role: 'staff' });
    return staff;
})

module.exports.removeStaffMember = asyncHandler(async (staffId)=>{
    return await User.findByIdAndDelete(staffId);
})

module.exports.getUserByGoogleId = asyncHandler(async (googleId)=>{
    return await User.findOne({googleId: googleId});
})