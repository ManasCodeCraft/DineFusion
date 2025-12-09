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
        let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(this.email);
      },
      message: "Invalid email format"
    },
  },

  verifyEmailToken: { type: String },

  password: {
    type: String,
    validate: {
      validator: function () {
        if (this.googleId) return true;
        return !!this.password;
      },
      message: "Password is required",
    },
    minlength: [8, "Password must be at least 8 characters"],
  },

  confirmPassword: { type: String },

  role: {
    type: String,
    enum: ["user", "staff"],
    required: [true, "Role is required"],
  },
});

userSchema.pre("save", async function (next) {
  try {
    if (this.googleId) {
      this.confirmPassword = undefined;
    }

    if (this.password && !this.googleId) {
      if (this.isModified("password")) {
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
  } catch {
    return false;
  }
};

const User = mongoose.model("User", userSchema);
module.exports = User;
