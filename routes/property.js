var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('OffPlanProperty/PropertyCreate', { title: '创建房源' });
});

module.exports = router;
