var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;


router.get("/test", async function (req, res) {
  try {

  }
  catch (err) {
    console.log(err);
    res.status(500)
  }
})