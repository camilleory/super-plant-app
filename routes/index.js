const express = require('express');
const router  = express.Router();
const passport = require("passport");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index', {user: req.user});
});










module.exports = router;
