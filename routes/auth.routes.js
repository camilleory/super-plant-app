// routes/auth-routes.js
const express = require("express");
const router = express.Router();

// User model
const User = require("../models/userModel");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

//passport setup
const passport      = require("passport");
const session       = require('express-session');
const flash         = require('connect-flash');


//signup and stay logged in
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res) => {
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashedPassword = bcrypt.hashSync(req.body.password, salt);

  let user = new User({
    username: req.body.username,
    password: hashedPassword,
  });

  user.save().then((signedUpUser) => {
    req.login(signedUpUser, () => {
      res.redirect('/');
    });
  });
});


//login
router.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash('error')} );
  // console.log(req.flash('error'))
  // flash errors are always an array!!!
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true,
  })
);



// login google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email"
    ]
  })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login" // here you would redirect to the login page using traditional login approach
  })
);



// logout
router.get("/logout", (req, res) => {
  req.logout()
  res.redirect("/")
})



module.exports = router;


