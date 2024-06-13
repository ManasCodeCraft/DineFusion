const mongoose = require("../config/database");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    validate: {
      validator: function () {
        return !(this.password === undefined && this.googleId === undefined);
      },
      message: "Invalid login attempt",
    },
  },
  name: { type: String, required: [true, "Name is required"] },
  email: {
    type: String,
    unique: true,
    match: [
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      "Please enter a valid email address",
    ],
    required: [true, 'Email is required']
  },
  password: {
    type: String,
    validate: {
      validator: function () {
        if(this.googleId){
           return true;
        }
        return this.password;
      },
      message: "Password is required",
    },
    minlength: [8, "Password must be at least 8 characters"],
  },
  confirmPassword: {
    type: String,
    validate: {
      validator: function () {
        if(this.googleId){
           return true;
        }
        if (this.confirmPassword && (this.confirmPassword === this.password)) {
          return true;
        }
        return false;
      },
      message: "Confirm Password is required",
    },
  },
  // collegeId: {
  //   type: String,
  //   match: [
  //     /^[a-zA-Z]+(?:\.[0-9]+)@mnnit\.ac\.in$/,
  //     "Please sign in with your college id",
  //   ],
  //   unique: true,
  //   validate: {
  //     validator: function () {
  //       if(this.googleId){
  //           return this.collegeId;
  //       }
  //       return true;
  //     },
  //     message: "CollegeId is required",
  //   },
  // },
  role: {
    type: String,
    enum: ["student", "staff"],
    required: [true, "Role is required"],
  },
});

userSchema.pre("save", async function (next) {
  try {
    if(this.googleId){
       this.email = this.collegeId;
       this.collegeId = undefined;
    }
    if (this.password) {
      if (this.password != this.confirmPassword) {
        throw new Error("Passwords do not match");
      }
      this.confirmPassword = undefined;
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
    return false;
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
