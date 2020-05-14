// const mongoose = require('mongoose');
// const Plants = require('../models/plantModel');

// const DB_NAME = 'plantApp';

// mongoose.connect(`mongodb://localhost/${DB_NAME}`, {
//   useCreateIndex: true,
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

// let plants = [{
//     scientific_name: "Merremia quinquefolia",
//     common_name: "rock rosemary",
//     image_url: "",
//     average_temperature: 14,
//     precipitation_minimum: 0,
//     precipitation_maximum: 0,
//     shade_tolerance: 0,
//     toxicity: "unkown",
//     nickname: "Pretty Lady",
//     note: "Pretty Plant"
//   }
// ]

// Plants.create(plants, err => {
//   if (err) {
//     throw err;
//   }
//   console.log(`Created ${plants.length} plants`);
//   mongoose.connection.close();
// });