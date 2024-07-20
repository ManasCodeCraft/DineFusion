const { asyncHandler } = require("../utils/functionWrappers");
const crypto = require("crypto");
const User = require("../models/authModel");
const { sendVerifyEmailLink } = require("../utils/sendMail");
const { getError } = require("../utils/format");

module.exports.registerUser = asyncHandler(async (user)=>{
    const pre_user = await User.findOne({email: user.email});
    if(pre_user){
        if(pre_user.verifyEmailToken){
           module.exports.sendVerifyLink(pre_user._id);
           throw getError(400, "Already Signed up", "Please do verify your email with the link sent to your email")
        }
        else{
            throw getError(400, "Already Signed up", "Please login");
        }
    }

    const userObj = new User(user);
    const user_ =  await userObj.save();
    module.exports.sendVerifyLink(userObj._id);
    return user_;
})

module.exports.verifyUserEmail = asyncHandler(async (id, hash)=>{
    const user = await User.findById(id);
    if(!user){
        throw new Error('User not found');
    }
    if(user.verifyEmailToken !== hash){
        throw new Error('Invalid verification token');
    }
    user.verifyEmailToken = undefined;
    await user.save();
    return user;
})

module.exports.sendVerifyLink = asyncHandler(async (userId)=>{
    const randomBytes = crypto.randomBytes(16);
    const hash = crypto.createHash('sha256').update(randomBytes).digest('hex');
    const user = await User.findByIdAndUpdate(userId, {verifyEmailToken: hash}, {new: true});
    if(!user) throw unexpectedError(400);
    await sendVerifyEmailLink(user)
})

module.exports.checkEmailVerified = asyncHandler(async (userId)=>{
    const user = await User.findById(userId);
    if(!user || user.verifyEmailToken) return null;
    return user;
})

module.exports.getUserByEmail = asyncHandler(async (email)=>{
    return await User.findOne({email: email});
})

module.exports.fetchAllStaff = asyncHandler(async ()=>{
    const staff = await User.find({ role: 'staff' });
    const filtered = staff.filter(st=>{
        if(st.verifyEmailToken){
            return false;
        }
        return true;
    })
    return filtered;
})

module.exports.removeStaffMember = asyncHandler(async (staffId)=>{
    return await User.findByIdAndDelete(staffId);
})

module.exports.getUserByGoogleId = asyncHandler(async (googleId)=>{
    return await User.findOne({googleId: googleId});
})

module.exports.getUserName = asyncHandler(async (userId)=>{
    var user = await User.findById(userId);
    if(!user){
        user = {name : ''}
    }   
    return user.name;
})