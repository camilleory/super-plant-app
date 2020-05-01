const mongoose = require("mongoose");
const Schema = mongoose.Schema;

function noValue(val) {
  if (val[0] === undefined) val = [{url: "images/no-image-found.jpg"}];
  return val;
}

const PlantSchema = new Schema({
  scientific_name: {
    type: String,
  },
  common_name: {
    type: String,
    required: true,
  },
  family_common_name: String,
  images: {
    type: Array,
    default: [{url: "images/no-image-found.jpg"}],
    set: noValue,
  },
  nickname: String,
  note: String,
});

const Plant = mongoose.model("Plant", PlantSchema);
module.exports = Plant;

//Can we have another data type in our model than the one in the API?
