const { asyncRequestHandler } = require("../utils/functionWrappers");
const { getError } = require("../utils/format");
const jwt = require("jsonwebtoken");
const { checkEmailVerified } = require("../services/authServices");
const logincookietoken = require("../config/config").logincookietoken;
const hashkey = require('../config/config').jwtKey

module.exports.verifySignUpData = asyncRequestHandler(async (req,res,next)=>{
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    if(!email || !password || !confirmPassword || !name){
        throw getError(400, 'SignUp Failed', 'Fill all input fields')
    }
    next();
})

module.exports.verifyLoginData = asyncRequestHandler(async (req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    if(!email || !password){
        throw getError(400, 'Login Failed', 'Fill all input fields')
    }
    next();
})

module.exports.verifyRegisterStaff = asyncRequestHandler(async (req, res, next)=>{
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    if(!email || !password || !confirmPassword || !name){
        throw getError(400, 'Register Staff Failed', 'Fill all input fields')
    }
    req.body.role = 'staff';
    next();
})


module.exports.protectRoute = asyncRequestHandler(async (req, res, next) => {
    let token = req.cookies[logincookietoken];
    if (!token) {
      req.userid = null;
      return next();
    }
    jwt.verify(token, hashkey, async (err, decoded) => {
      if (err) {
        console.log(err);
        req.userid = null;
        return next();
      }
      if(decoded.owner){
        return next()
      }
      if(decoded.user){
      const userid = decoded.user._id;
      if(!(await checkEmailVerified(userid))){
        req.userid = null
        const error = getError(401, 'Verify Email', 'Please verify your email first')
        return next(error);
      }
      req.userid = userid;
      }
      next();
    });
});

module.exports.StaffProtectRoute = async function (req, res, next) {
    let token = req.cookies[logincookietoken];
    if (!token) {
      req.userid = null;
      return res.redirect("/");
    }
    jwt.verify(token, hashkey, async (err, decoded) => {
      if (err) {
        console.log(err);
        req.userid = null;
        return res.redirect("/");
      }
      if(decoded.owner){
        return next()
      }
      const userid = decoded.user._id;
      req.userid = userid;
      const role = decoded.user.role;
      if (role != "staff") {
        return res
          .status(401)
          .send("<h1> Error 401: You are not allowed to view this page</h1>");
      }
      if(!(await checkEmailVerified(userid))){
        req.userid = null
        const error = getError(401, 'Verify Email', 'Please verify your email first')
        return next(error);
      }
      next();
    });
};

module.exports.OwnerProtectRoute = async function (req, res, next) {
    let token = req.cookies[logincookietoken];
    if (!token) {
      return res
        .status(401)
        .send("<h1> Error 401: You are not allowed to view this page</h1>");
    }
    jwt.verify(token, hashkey, (err, decoded) => {
      if (err) {
        console.log(err);
        return res
          .status(401)
          .send("<h1> Error 401: You are not allowed to view this page</h1>");
      }
      const isowner = decoded.owner;
      if (!isowner) {
        return res
          .status(401)
          .send("<h1> Error 401: You are not allowed to view this page</h1>");
      }
      next();
    });
};