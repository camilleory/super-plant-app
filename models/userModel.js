const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: String,
    email: String,
    password: String,
    isAdmin: Boolean,
    googleID: String,
    verifiedEmail: {
      type: Boolean, default: false
    },
    token: String,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;


