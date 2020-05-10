const express = require("express");
const router = express.Router();
const axios = require("axios");
const Plant = require("../models/plantModel");
const passport = require("passport");

const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
// package to allow <input type="file"> in forms
const multer = require("multer");

// every route below ist protected through this middleware, only accessable after login and email verification
router.use((req, res, next) => {
  if (req.isAuthenticated() && req.user.verifiedEmail === true) {
    next();
  } else {
    res.redirect("/auth/login");
  }
});

// garden GET REQUEST (READ)
// If the user has a list of plants --> Display plants from Database
// TO DO --> If the user is new, show some random plants (from API or from Database?)

router.get("/", (req, res, next) => {
  Plant.find({
    owner: req.user,
  }).then((plants) => {
    console.log(req.user);
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
      res.render("garden/selectPlant", {
        response: response.data,
      });
    })
    .then(() => {
      console.log("ID parameter will be here");
    });
});

//selectPlant GET REQUEST
// Here we get the list of plants.
router.get("/selectPlant", (req, res) => {
  res.render("garden/selectPlant");
});

// We need a post request to get to the full data and retrieve the plant pictures

router.post("/selectPlant", (req, res) => {
  //console.log('information sent to backend'+ req.body.id)
  let idArray = req.body.id;
  console.log("idArray", idArray);
  let promises = [];

  idArray.map((el, i) => {
    promises.push(
      axios.get("https://trefle.io/api/plants/" + el, {
        params: {
          token: process.env.TREFLE_TOKEN,
        },
      })
    );
  });
  //console.log(promises)
  Promise.all(promises).then((response) => {
    res.render("garden/chosePlant", {
      fullData: response,
    });
  });
});

//chosePlant GET REQUEST
router.get("/chosePlant", (req, res) => {
  res.render("garden/chosePlant");
});

//chosePlant POST REQUEST --> Get chosen plant ID and make a new post request to api, then save data into database

router.post("/chosePlant", (req, res) => {
  let selPlant = req.body.id;
  console.log("plant id", req.body.id);

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
      });
      plant.save().then(() => {
        res.redirect("/garden/addDetails/" + plant.id);
      });
    });
});

//addDetails GET REQUEST
router.get("/addDetails/:id", (req, res) => {
  Plant.findById(req.params.id).then((plant) => {
    res.render("garden/addDetails", {
      myPlant: plant,
    });
  });
});

// addDetail POST REQUEST

router.post("/addDetails/:id", (req, res) => {
  Plant.findByIdAndUpdate(req.params.id, {
    nickname: req.body.nickname,
    note: req.body.note,
    water: req.body.water,
    position: req.body.position,
  }).then(() => {
    res.redirect("/garden");
  });
});

//Detail page GET REQUEST
router.get("/plantDetails/:id", (req, res, next) => {
  Plant.findById(req.params.id).then((plant) => {
    res.render("garden/plantDetails", {
      myPlant: plant,
    });
  });
});

// EditPlant GET REQUEST
router.get("/editPlant/:id", (req, res, next) => {
  Plant.findById(req.params.id).then((plant) => {
    res.render("garden/editPlant", {
      myPlant: plant,
    });
  });
});

// EditPlant POST REQUEST including image deletion

router.post("/editPlant/:id", (req, res) => {

  let notToDeleteList = req.body.notToDelete;
  let images = [];

  console.log(notToDeleteList);

  // if (notToDeleteList === undefined) {
  //   return  images.push({ url: "/public/images/no-image-found.jpg" });
  // } 

  if (notToDeleteList !== Object) {
    images.push({ url: notToDeleteList });
  } else {
    notToDeleteList.forEach((el) => {
      images.push({ url: el });
    });
  }

  Plant.findByIdAndUpdate(req.params.id, {
    //scientific_name: req.body.scientific_name,
    //common_name: req.body.common_name,
    nickname: req.body.nickname,
    note: req.body.note,
    water: req.body.water,
    position: req.body.position,
    images: images,
  }).then(() => {
    res.redirect("/garden/plantDetails/" + req.params.id);
  });
});

// cloudinary setup
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

var storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: "plant-images", // The name of the folder in cloudinary
  allowedFormats: ["jpg", "png"],
  filename: function (req, file, cb) {
    cb(null, file.originalname); // The file on cloudinary would have the same name as the original file name
  },
});

// UPLOAD USER IMAGE and push to first position of plant image array
const uploadCloud = multer({
  storage: storage,
});

router.post(
  "/plantDetails/uploadImage/:id",
  uploadCloud.single("user-image"),
  (req, res) => {
    const imageURL = req.file.url;

    Plant.findByIdAndUpdate(req.params.id, {
      $push: {
        images: {
          $each: [
            {
              url: imageURL,
            },
          ],
          $position: 0,
        },
      },
      new: true,
    }).then((plant) => {
      res.redirect("/garden/plantDetails/" + req.params.id);
    });
  }
);

// Delete Plant POST REQUEST
router.post("/delete/:id", (req, res) => {
  console.log(req.params.id);
  Plant.findByIdAndRemove(req.params.id).then(() => {
    res.redirect("/garden");
  });
});

module.exports = router;
