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
// const nodemailer = require("nodemailer"); // UNCOMMENT THIS LINE TO RESTORE AUTH EMAIL VERIFICATION


// UNCOMMENT THIS BLOCK TO RESTORE AUTH EMAIL VERIFICATION
// signup with email
// let transporter = nodemailer.createTransport({
//   service: "Gmail",
//   auth: {
//     user: process.env.OUR_EMAIL,
//     pass: process.env.OUR_EMAIL_PW,
//   },
// });

//signup and stay logged in
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const { email, password, name } = req.body;
  // const token = Math.floor(Math.random() * 1000000);  // UNCOMMENT THIS LINE TO RESTORE AUTH EMAIL VERIFICATION

  if (!email || !password) {
    res.render("auth/signup", {
      message: "Email or Password can't be blank",
    });
    return;
  }

  // UNCOMMENT THIS BLOCK TO RESTORE AUTH EMAIL VERIFICATION
  // transporter.sendMail({
  //   from: ' "All My Plants" <masterOfPlants@superplantapp.com>',
  //   to: email,
  //   subject: "Login to All My Plants App",
  //   html: `Hello there! <br><br>
  //   Please click on this link to verify your email adress and get access to All My Plants App: <br> 
  //   ${process.env.EMAIL_LINK}/${token} <br><br>
  //   Take care (of your plants)!`,
  // });

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
        // token: token, // UNCOMMENT THIS LINE TO RESTORE AUTH EMAIL VERIFICATION
        name: name,
      });

      return newUser.save();
    })

    .then(() => {
      res.render("auth/login" /*, { message: req.flash("error") } */);
    })

    .catch((error) => {
      res.render("auth/login" /*{ message: "Something went wrong" } */);
    });
});

// UNCOMMENT THIS BLOCK TO RESTORE AUTH EMAIL VERIFICATION
// router.get("/verify-email/:token", (req, res) => {
//   User.findOne({ token: req.params.token })
//   .then((user) => {
//     req.login(user, () => {
//       req.user.verifiedEmail = true;
//       req.user
//         .save()

//         .then(() => {
//           res.redirect("/garden");
//         });
//     });
//   });
// });

//login
router.get("/login", (req, res, next) => {
  res.render("auth/login", { message: req.flash("error") });
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
