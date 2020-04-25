const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  plantId:[{type: Schema.Types.ObjectId, ref: 'Plant'}],
  isAdmin: Boolean
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);
module.exports = User;