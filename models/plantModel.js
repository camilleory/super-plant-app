const mongoose      = require("mongoose");
const Schema        = mongoose.Schema;

function noValue(val) {
  if (val[0] === undefined) val = [{url: "/images/no-image-found.jpg"}];
  return val;
}

function lowercase(val) {
  return val.toLowerCase();
}

const PlantSchema = new Schema({
  scientific_name: {
    type: String,
    set: lowercase,
  },
  common_name: {
    type: String,
    required: true,
    set: lowercase,
  },
  images: {
    type: Array,
    default: [{url: "/images/no-image-found.jpg"}],
    set: noValue,
  },
  family_common_name: {
    type: String,
    set: lowercase,
  },
  nickname: {
    type: String,
    set: lowercase,
  },
  note: {
    type: String,
    set: lowercase,
  },
  owner: Schema.Types.ObjectId,
  water: String,
  position: String
});

const Plant = mongoose.model("Plant", PlantSchema);
module.exports = Plant;


