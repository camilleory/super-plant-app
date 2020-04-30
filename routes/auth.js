// routes/auth-routes.js
const express = require("express");
const router = express.Router();

// User model
const User = require("../models/userModel");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

//passport setup
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash");

//signup and stay logged in
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {

  const { username, password } = req.body;

  if (!username || !password) {
    res.render("auth/signup", {
      message: "Username or Password can't be blank",
    });
    return;
  }

  User.findOne({username})
    .then((user) => {

      if (user !== null) {
        res.render("auth/signup", { message: "The username already exists" });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashedPassword = bcrypt.hashSync(req.body.password, salt);

      let newUser = new User({
        username: username,
        password: hashedPassword,
      });

      newUser.save().then((signedUpUser) => {
        req.login(signedUpUser, () => {
          res.redirect("/garden");
        });
      })
    })

    .catch((error) => {
      res.render("auth/signup", { message: "Something went wrong" });
    });
});

//login
router.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash("error") });
  // console.log(req.flash('error'))
  // flash errors are always an array!!!
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/garden",
    failureRedirect: "/auth/login",
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
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "/garden",
    failureRedirect: "/login", // here you would redirect to the login page using traditional login approach
  })
);

// logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
