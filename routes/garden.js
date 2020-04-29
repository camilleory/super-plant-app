const express = require("express");
const router = express.Router();
const axios = require("axios");
const Plant = require("../models/plantModel");

// every route below ist protected through this middleware
// router.use((req, res, next) => {
//   if (req.isAuthenticated()) {
//     next();
//   } else {
//     res.redirect("auth/login");
//   }
// });

// router.get("/garden", (req, res, next) => {
//   res.render("garden/garden");
// });

// garden GET REQUEST (READ)
// If the user has a list of plants --> Display plants from Database 
// TO DO --> If the user is new, show some random plants (from API or from Database?)

router.get('/', (req, res, next) => {
  Plant.find().then((plants) => {
    //console.log("plants from Database:", plants + plants.length)
    res.render('garden/garden', {
      plantsList: plants
    });
  });
});

// AddPlant GET REQUEST (CREATE)
router.get('/addPlant', (req, res, next) => {
  res.render('garden/addPlant');
});

// AddPlant POST Request : User can enter the common or scientific name of the plant and we give him a list of all plants with this name
router.post('/addPlant', (req, res) => {
  axios.get('https://trefle.io/api/plants/', {
    params: {
      q: req.body.common_name,
      token: "ckZrTGRTdWdKKzVUenNvOVVqOFRGdz09"
    }
  }).then((response) => {
    console.log("This is the response from API", response.data)
    res.render('garden/chosePlant', {
      response: response.data
    })
  }).then(() => {
    console.log('ID parameter will be here')
  })
});

//chosePlant GET REQUEST
router.get('/chosePlant', (req, res, next) => {
  res.render('garden/chosePlant');
});

//chosePlant POST REQUEST --> Get plant ID and make a new post request to api, then save data into database
router.post('/chosePlant', (req, res) => {
  axios.get("https://trefle.io/api/plants/" + req.body.plantSelection, {
      params: {
        token: "ckZrTGRTdWdKKzVUenNvOVVqOFRGdz09"
      }
    })
    .then((response) => {
        console.log("chose plants route response", response.data)
        let plant = new Plant({
          scientific_name: response.data.scientific_name,
          common_name: response.data.common_name,
          // image_url: response.data.images[0].url,
          // average_temperature: 9,
          //precipitation_minimum: response.data.growth.precipitation_minimum,
          //precipitation_maximum: response.data.growth.precipitation_maximum,
          // temperature_minimum: response.data.growth.temperature_minimum,
          // shade_tolerance: response.data.growth.shade_tolerance,
          // toxicity:response.data.specifications.toxicity,
          // nickname: "some nickname",
          // note: "some note"
        })
        plant.save().then(() => {
          res.redirect('/garden')
        })
    });
})
// Delete Plant POST REQUEST
router.post('/delete/:id', (req, res) => {
  console.log(req.params.id)
  Plant.findByIdAndRemove(req.params.id).then(() => {
    res.redirect('/garden')
  })
})
// EditPlant GET REQUEST
router.get('/editPlant', (req, res, next) => {
  res.render('garden/editPlant');
});

module.exports = router;
