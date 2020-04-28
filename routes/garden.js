const express       = require("express");
const router        = express.Router();

router.get("/", ensureAuthenticated, (req, res) => {
  res.render("garden/gardenMain", {user: req.user}) 
})


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login')
  }
}

module.exports = router;
