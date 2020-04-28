const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const PlantSchema = new Schema({
  scientific_name: {
    type: String,
  },
  common_name: {
    type:String,
    required: true
  },
  image_url: String,
  average_temperature: Number,
  precipitation_minimum: Number,
  precipitation_maximum: Number, 
  shade_tolerance: String,
  toxicity: String,
  nickname: String,
  note: String

});

const Plant = mongoose.model("Plant", PlantSchema);
module.exports = Plant;


//Can we have another data type in our model than the one in the API?