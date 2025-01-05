const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const { createTokenForUser } = require("../services/authentication");  // Assuming token creation is handled here

// User Schema Definition
const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default: "/images/defaultProfile.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

// Hash Password Before Saving
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Static Method for Password Validation
userSchema.methods.matchPassword = async function(password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
}

// Create and Export User Model
const User = model("User", userSchema);
module.exports = User;
