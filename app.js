require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const passport = require("passport");
const session = require("express-session");

const LocalStrategy = require("passport-local").Strategy;
const MongoStore = require("connect-mongo")(session);
const User = require("./models/userModel");
const bcrypt = require("bcrypt");
const flash = require("connect-flash");

mongoose
  .connect("mongodb://localhost/plantapp", { useNewUrlParser: true })
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch((err) => {
    console.error("Error connecting to mongo", err);
  });

const app_name = require("./package.json").name;
const debug = require("debug")(`${app_name}:${path.basename(__filename).split(".")[0]}`
);

const app = express();

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(flash());

// Express View engine setup
app.use(
  require("node-sass-middleware")({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    sourceMap: true,
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

// express-session configuration --> use mongostore in the setup then sessions get stored
app.use(
  session({
    secret: process.env.SECRET,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 day
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      resave: true,
      saveUninitialized: false,
      ttl: 24 * 60 * 60, // 1 day
    }),
  })
);

// associate user with a session // store the user into the session
passport.serializeUser((user, callback) => {
  callback(null, user._id);
});

passport.deserializeUser((id, callback) => {
  User.findById(id)
    .then((user) => {
      callback(null, user);
    })
    .catch((error) => {
      callback(error);
    });
});

// local strategy ===> how to move the strategies to a different folder an require it here??? ask Hendrik / Mir

passport.use(
  new LocalStrategy((username, password, callback) => {
    User.findOne({ username })
      .then((user) => {
        if (!user) {
          return callback(null, false, { message: "No such user" });
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return callback(null, false, { message: "Wrong password" });
        }
        callback(null, user);
      })
      .catch((error) => {
        callback(error);
      });
  })
);

// google strategy
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // to see the structure of the data in received response:
      console.log("Google account details:", profile);

      User.findOne({ googleID: profile.id })
        .then((user) => {
          if (user) {
            done(null, user);
            return;
          }

          User.create({ googleID: profile.id })
            .then((newUser) => {
              done(null, newUser);
            })
            .catch((err) => done(err)); // closes User.create()
        })
        .catch((err) => done(err)); // closes User.findOne()
    }
  )
);

//Passport setup
app.use(passport.initialize());
app.use(passport.session());

// default value for title local
app.locals.title = "PlantApp - Plants Love It";

const index = require("./routes/index");
app.use("/", index);

const auth = require("./routes/auth");
app.use("/auth", auth);

// const plants = require('./routes/plants');
// app.use('/', plants);

const garden = require("./routes/garden");
app.use("/garden", garden);

module.exports = app;
