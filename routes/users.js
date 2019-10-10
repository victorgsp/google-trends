var express = require('express');
var router = express.Router();
var itemController = require('./modules/controllers/item.js')

/* GET users listing. */
router.get('/', async function (req, res, next) {
  await itemController.loadRss();
  res.send('respond with a resource');
});

module.exports = router;
