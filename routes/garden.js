const express       = require("express");
const router        = express.Router();
const axios         = require('axios')
const Plant         = require('../models/plantModel')

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login')
  }
}

// router.get("/", (req, res) => {
//   res.render("garden/garden", {user: req.user}) 
// })

router.get('/', (req, res, next) => {
  Plant.find().then((plants) => {

    console.log("plants from Database:", plants + plants.length)

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
  }).then (()=> {
      console.log('ID parameter will be here')

  })
});

/*POST addPlant*/

// router.post('/addPlant', (req, res) => {

//   let plant = new Plant({
//     common_name: req.body.common_name,
//     scientific_name: req.body.scientific_name,
//     nickname: req.body.nickname,
//     note: req.body.note
//   })

//   plant.save().then(() => {
//     res.redirect('/plants')
//   })
// })

//chosePlant GET REQUEST

router.get('/chosePlant', (req, res, next) => {

  res.render('garden/chosePlant');
});

//chosePlant POST REQUEST --> Get plant ID and make a new post request to api, then save data into database


router.post('/chosePlant', (req, res) => {

  axios.get('https://trefle.io/api/plants/${req.params.selectedPlant}', (req, res) => {
  }).then((response) => {
    console.log("This is the response from API", response.data)
    res.render('garden/garden', {response: response.data} )
  });
})

















module.exports = router;
