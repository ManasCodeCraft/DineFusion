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
    required: [true, "Email is required"],
    validate: {
      validator: function () {
        if(this.googleId){
            let regex = /^[a-zA-Z]+\.\d{8}@mnnit\.ac\.in$/
            return regex.test(this.email)
        }
        else{
          let regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/
          return regex.test(this.email)
        }
      },
      message: "Invalid email or collegeId"
    },
  },
  verifyEmailToken: {
    type: String,
  },
  password: {
    type: String,
    validate: {
      validator: function () {
        if (this.googleId) {
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
  },
  role: {
    type: String,
    enum: ["student", "staff"],
    required: [true, "Role is required"],
  },
});

userSchema.pre("save", async function (next) {
  try {
    if (this.googleId) {
      this.email = this.collegeId;
      this.collegeId = undefined;
    }

    if (this.password) {
      if (this.isModified('password')) {
        if (this.password !== this.confirmPassword) {
          throw new Error("Passwords do not match");
        }
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
      }
      this.confirmPassword = undefined;
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
