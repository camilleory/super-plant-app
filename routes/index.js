const express         = require("express");
const router          = express.Router();
const passport        = require("passport");

router.get("/", (req, res, next) => {
  if (req.user) {
    res.redirect("/garden")
  } else {
  res.render("index");
  }
});

router.get("/about", (req, res) => {
  res.render("about", { user: req.user });
});

module.exports = router;
