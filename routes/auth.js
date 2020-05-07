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

const nodemailer = require("nodemailer");

// signup with email

let transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.OUR_EMAIL,
    pass: process.env.OUR_EMAIL_PW,
  },
});

//signup and stay logged in
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {

  const { email, password, name } = req.body;
  const token = Math.floor(Math.random() * 1000000);

  if (!email || !password) {
    res.render("auth/signup", {
      message: "Email or Password can't be blank",
    });
    return;
  }

  transporter.sendMail({
    from: ' "Super Plant App" <masterOfPlants@superplantapp.com>',
    to: email,
    subject: "Login to Super Plant App",
    html: `Click on this link to verify your email adress for Super Plant App: http://localhost:3000/auth/verify-email/${token}`,
  });

  User.findOne({ email })
    .then((user) => {
      
      if (user !== null) {
        res.render("auth/signup", {
          message: "User already exists",
        });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashedPassword = bcrypt.hashSync(req.body.password, salt);

      let newUser = new User({
        email: email,
        password: hashedPassword,
        token: token,
        name: name,
      });

      return newUser.save();
    })

    .then(() => {
      res.render("auth/verify" /*, { message: req.flash("error") } */);
    })

    .catch((error) => {
      res.render("auth/verify", /*{ message: "Something went wrong" } */);
    });
});

router.get("/verify-email/:token", (req, res) => {

  User.findOne({ token: req.params.token })
  
  .then((user) => {

    req.login(user, () => {
      req.user.verifiedEmail = true;
      req.user.save()
      
      .then(() => {
        res.redirect("/garden");
      });
    });
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
    failureRedirect: "/login",
    passReqToCallback: true,
  })
);

// logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
