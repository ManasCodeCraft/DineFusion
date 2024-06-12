const mongoose = require('../database');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  googleId: {type: String, 
    validate: {
      validator: function(){
        return !(this.password === undefined && this.googleId === undefined)
      },
      message: 'Invalid login attempt'
    }
  },
  name: { type: String, required: [true, 'Name is required'] },
  email: {
    type: String,
    unique: true,
    match: [
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      'Please enter a valid email address',
    ],
    validate: {
      validator: function () {
        return (this.email !== undefined || this.collegeId !== undefined);
      },
      message: 'Email is required',
    }
  },
  password: {
    type: String,
    validate: {
      validator: function(){
        return !(this.password === undefined && this.googleId === undefined)
      },
      message: 'Password is required'
    },
    minlength: [8, 'Password must be at least 8 characters'],
  },
  confirmPassword: {
    type: String,
    validate: {
      validator: function(){
        if(this.password != undefined && this.confirmPassword === undefined){
          return false;
        }
        return true;
      },
      message: 'Confirm Password is required'
    }
  },
  collegeId: {
    type: String,
    unique: true,
    match: [
        /^[a-zA-Z]+(?:\.[0-9]+)@mnnit\.ac\.in$/,
        'Please sign in with your college id',
      ],
      validate: {
        validator: function () {
          return (this.email == undefined || this.collegeId == undefined);
        },
        message: 'CollegeId is required',
      },
  },
  role: {
    type: String,
    enum: ['student', 'staff'],
    required: [true, 'Role is required'],
  },
});

userSchema.pre('save', async function (next) {
  try {
    if(this.password){
      if(this.password != this.confirmPassword){
        throw new Error('Passwords do not match');
      }
      this.confirmPassword = undefined
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.verifyPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    return false
  }
};


const User = mongoose.model('User', userSchema);

module.exports = User;
