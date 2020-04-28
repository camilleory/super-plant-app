const express = require('express');
const router  = express.Router();
const axios = require('axios')

/* GET home page */
router.get('/', (req, res, next) => {
  axios.get('https://trefle.io/api/kingdoms?token=ckZrTGRTdWdKKzVUenNvOVVqOFRGdz09').then(function (response) {
     console.log(response.data)
    });
  res.render('index');
  
});

module.exports = router;


//https://trefle.io/api/plants?q=rosemary&token=ckZrTGRTdWdKKzVUenNvOVVqOFRGdz09