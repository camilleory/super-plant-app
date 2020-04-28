const express = require('express');
const router  = express.Router();

/* GET home page */

  
const passport = require("passport");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index', {user: req.user});
});










module.exports = router;


//https://trefle.io/api/plants?q=rosemary&token=ckZrTGRTdWdKKzVUenNvOVVqOFRGdz09