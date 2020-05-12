const mongoose = require("mongoose");
const Schema = mongoose.Schema;

function noValue(val) {
  if (val[0] === undefined) val = [{url: "/images/no-image-found.jpg"}];
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
  images: {
    type: Array,
    default: [{url: "/images/no-image-found.jpg"}],
    set: noValue,
  },
  owner: Schema.Types.ObjectId,
  family_common_name: String,
  nickname: String,
  note: String,
  water: String,
  position: String
});

const Plant = mongoose.model("Plant", PlantSchema);
module.exports = Plant;


