const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: String,
    email: String,
    password: String,
    googleID: String,
    token: String,  
    verifiedEmail: {
      type: Boolean,
      default: false,
    },
});

const User = mongoose.model("User", userSchema);
module.exports = User;


