const mongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    minLength: 5,
    required: [true, `Please provide your username`],
  },
  email: {
    type: String,
    lowercase: true,
    required: [true, `Please provide your email`],
    validate: {
      validator: function (email) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
      },
      message: "Please provide a valid email address",
    },
  },
  password: {
    type: String,
    minLength: 6,
    required: true,
    select: false
  },
  resetToken: {
    type: String,
  },
  resetExpires: {
    type: Date,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isNew) {
    next();
  }

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async (inputPassword, password) => {
  return await bcrypt.compare(inputPassword, password)
};

userSchema.methods.generateResetToken = async function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.resetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetExpires = Date.now() + 30 * 60 * 1000;

    return resetToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User
