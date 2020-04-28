// const express = require('express');
// const router = express.Router();
// const axios = require('axios')
// const Plant = require('../models/plantModel')


// garden GET REQUEST (READ)

// If the user has a list of plants --> Display plants from Database 
// TO DO --> If the user is new, show some random plants (from API or from Database?)

// router.get('/garden', (req, res, next) => {
//   Plant.find().then((plants) => {

//     console.log("plants from Database:", plants + plants.length)

//     res.render('garden', {
//       plantsList: plants
//     });
//   });
// });


// // AddPlant GET REQUEST (CREATE)

// router.get('/addPlant', (req, res, next) => {

//   res.render('addPlant');
// });


// AddPlant POST Request : User can enter the common or scientific name of the plant and we give him a list of all plants with this name
\


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

// router.get('/chosePlant', (req, res, next) => {

//   res.render('chosePlant');
// });

//chosePlant POST REQUEST --> Get plant ID and make a new post request to api, then save data into database


// router.post('/chosePlant', (req, res) => {

//   axios.get('https://trefle.io/api/plants/${id}', (req, res) => {
//     id=req.params.selectedPlant
//   }).then((response) => {
//     console.log("This is the response from API", response.data)
//     res.render('garden' /*, {response: response.data}*/ )
//   });
// })


// Delete Plant
// router.post('garden/delete/:id', (req, res) => {

//   console.log(req.params.id)

//   Plant.findByIdAndDelete(req.params.id).then(() => {
//     res.redirect('/garden')
//   })

// })



// module.exports = router;