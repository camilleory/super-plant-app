const express = require("express");
const router = express.Router();
const axios = require("axios");
const Plant = require("../models/plantModel");
const passport = require("passport");

// every route below ist protected through this middleware, only accessable after login
router.use((req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/auth/login");
  }
});

// garden GET REQUEST (READ)
// If the user has a list of plants --> Display plants from Database
// TO DO --> If the user is new, show some random plants (from API or from Database?)

router.get("/", (req, res, next) => {
  Plant.find({owner: req.user}).then((plants) => {
    console.log(req.user)
    res.render("garden/garden", {
      plantsList: plants,
      user: req.user,
    });
  });
});

// AddPlant GET REQUEST (CREATE)
router.get("/addPlant", (req, res, next) => {
  res.render("garden/addPlant");
});

// AddPlant POST Request : User can enter the common or scientific name of the plant and we give him a list of all plants with this name
router.post("/addPlant", (req, res) => {
  axios
    .get("https://trefle.io/api/plants/", {
      params: {
        q: req.body.common_name,
        token: process.env.TREFLE_TOKEN,
      },
    })
    .then((response) => {
      console.log("This is the response from API", response.data);
      res.render("garden/chosePlant", {
        response: response.data,
      });
    })
    .then(() => {
      console.log("ID parameter will be here");
    });
});

//chosePlant GET REQUEST
router.get("/chosePlant", (req, res, next) => {
  res.render("garden/chosePlant");
});

//chosePlant POST REQUEST --> Get plant ID and make a new post request to api, then save data into database

router.post("/chosePlant", (req, res) => {
  let selPlant = req.body.plantSelection;

  axios
    .get("https://trefle.io/api/plants/" + selPlant, {
      params: {
        token: process.env.TREFLE_TOKEN,
      },
    })
    .then((response) => {
      console.log("chose plants route response", response.data);
      let plant = new Plant({
        scientific_name: response.data.scientific_name,
        common_name: response.data.common_name,
        family_common_name: response.data.family_common_name,
        images: response.data.images,
        owner: req.user.id,
        nickname: "some nickname",
        note: "some note",
        water: "water amount",
        position:"sun or shadow"
      });
      plant.save().then(() => {
        res.redirect("/garden");
      });
    });
});


//Detail page GET REQUEST
router.get("/plantDetails/:id", (req, res, next) => {
  Plant.findById(req.params.id).then((plant)=>{
    res.render("garden/plantDetails", {myPlant: plant});
});
});






// EditPlant GET REQUEST
router.get("/editPlant/:id", (req, res, next) => {
  Plant.findById(req.params.id).then((plant)=>{
    res.render("garden/editPlant", {myPlant: plant});
  })
});


// EditPlant POST REQUEST

router.post("/editPlant/:id", (req, res) => {

  Plant.findByIdAndUpdate(req.params.id, {
    scientific_name: req.body.scientific_name,
    common_name: req.body.common_name,
    nickname: req.body.nickname,
    note: req.body.note,
    water: req.body.water,
    position: req.body.position
  }).then(() => {
    res.redirect('/garden')
  });
});



// Delete Plant POST REQUEST
router.post("/delete/:id", (req, res) => {
  console.log(req.params.id);
  Plant.findByIdAndRemove(req.params.id).then(() => {
    res.redirect("/garden");
  });
});



module.exports = router;
