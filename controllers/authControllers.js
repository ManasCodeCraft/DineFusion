const jwt = require("jsonwebtoken");
const passport = require("passport");
const { prepareLoginCookie } = require("../utils/cookieHelpers");
const { googleClientID, googleClientSecret, googleCallBack, logincookietoken, ownerlogintoken } = require("../config/config");
const { registerUser, getUserByEmail, fetchAllStaff, removeStaffMember, getUserByGoogleId, verifyUserEmail, sendVerifyLink, checkEmailVerified } = require("../services/authServices");
const { asyncRequestHandler } = require("../utils/functionWrappers");
const { unexpectedError, getError } = require("../utils/format");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const hashkey = require("../config/config").jwtKey;

passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientID,
      clientSecret: googleClientSecret,
      callbackURL: googleCallBack,
    },
    async function(accessToken, refreshToken, profile, cb) {
      try {
        let existingUser = await getUserByGoogleId(profile.id);
        if (existingUser) {
          return cb(null, existingUser);
        } else {
          let userData = {
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            role: 'user'
          }
          const newUser = await registerUser(userData);
          return cb(null, newUser);
        }
      } catch (err) {
        if(err.name == 'ValidationError'){
          const errors = {};
          for (const field in err.errors) {
            errors[field] = err.errors[field].message;
          }
          if(errors['googleId']){
            err.message = errors['googleId'];
          }
          else if(errors['email']){
            err.message = errors['email']
          }
          else{
            err.message = 'user login failed'
          }
        }
        else{
          err.message = 'user login failed'
        }
        return cb(err);
      }
    }
  )
);


module.exports.googleSignInCallback = function(req, res, next) {
  passport.authenticate('google', function(err, user, info) {
    if (err) {
      return res.redirect('/?error=' + encodeURIComponent(err.message));
    }
    if (!user) {
      return res.redirect('/?error=User%20login%20failed');
    }
    const mycookie = {
      user: user,
      login: true,
    };

    let cookieValue = prepareLoginCookie(mycookie);

    res.cookie(...cookieValue);
    req.userid = user._id;
    res.redirect('/');
  })(req, res, next);
};

module.exports.googlesignIn = passport.authenticate('google', { scope: ['profile', 'email'] });

module.exports.postCreateAccount = asyncRequestHandler(async (req, res) => {
    let userdata = await registerUser(req.body);
    if(!userdata){
        throw unexpectedError(400);
    }

    res.cookie(...prepareLoginCookie({user: userdata, login: true}));
    res.status(200).send();
})

module.exports.loginUser = asyncRequestHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);

    if (!user) {
        throw getError(400, 'Login Failed', 'User not found')
    }

    let check = await user.verifyPassword(password)
    if (!check) {
      throw getError(400, 'Login Failed', 'Incorrect password')
    }

    if(user.verifyEmailToken){
       sendVerifyLink(user._id);
       throw getError(400, 'Login Failed', 'Please verify your email')
    }

    const mycookie = {
      user: user,
      login: true,
    };

    let cookieValue = prepareLoginCookie(mycookie)

    res.cookie(...cookieValue);
    req.userid = user._id;

    res.status(200).send();
})

module.exports.verifyEmail = asyncRequestHandler(async function (req,res){
  const { userId, token} = req.params;
  const result = await verifyUserEmail(userId, token);
  if(result){
     return res.status(200).redirect('/');
  } 
  throw getError(400, 'Email Verification Failed', 'Invalid token')
})

module.exports.ownerlogin = asyncRequestHandler(async function (req, res) {
    const { token } = req.body;

    if (token != ownerlogintoken) {
       throw getError(400, 'Login Failed', 'Invalid token')
    }

    const mycookie = {
      owner: true,
      login: true,
    };

    const cookieValue = prepareLoginCookie(mycookie)

    res.cookie(...cookieValue);

    res.status(200).json({ message: "Login successful" });
})

module.exports.logoutUser = asyncRequestHandler((req, res) => {
    res.clearCookie(logincookietoken);
    res.status(200).json({ message: "Logout successful" });
});

module.exports.checkuserlogin = asyncRequestHandler(async function (req, res){
    let token = req.cookies[logincookietoken];
    if (!token) {
      return res.status(400).json({'login':false})
    }
    jwt.verify(token, hashkey, async (err, decoded) => {
      if (err) {
       return res.status(400).json({'login':false})
      }
      if(!decoded.user){
        return res.status(400).json({'login':false})
      }
      if(decoded.user.role === 'staff'){
        return res.status(400).json({'login':false})
      }
      if(!(await checkEmailVerified(decoded.user._id))){
         return res.status(400).json({'login':false})
      }
      res.status(200).json({'login':true})
    });
})

module.exports.checkstafflogin = async function (req, res){
    let token = req.cookies[logincookietoken];
    if (!token) {
      req.userid = null;
      return res.status(400).json({'login':false})
    }
    jwt.verify(token, hashkey, async (err, decoded) => {
      if (err) {
        req.userid = null;
       return res.status(400).json({'login':false})
      }
      if(decoded.owner){
        return res.status(400).json({'login': false})
      }
      if(decoded.user.role === 'staff'){
        if(!(await checkEmailVerified(decoded.user._id))){
          return res.status(400).json({'login':false})
         }
        return res.status(200).json({'login':true})
      }
      res.status(400).json({'login':false})
    });
}

module.exports.fetchstaff = async function (req, res) {
    const staff = await fetchAllStaff();
    res.status(200).json({ staff:staff });
}

module.exports.addstaff = async function (req, res) {
    const staff = await registerUser(req.body);
    if(!staff){
      throw unexpectedError(400);
    }
    res.status(200).json({ message: "Staff added successfully" });
}

module.exports.removestaff = async function (req, res) {
    const { staffId } = req.body;
    const deletedStaff = await removeStaffMember(staffId);
    if (!deletedStaff) {
      throw unexpectedError(400);
    }
    res.status(200).json({ message: "Staff removed successfully" });
}


