var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  var SuburbService = require('../Biz-Service/SuburbService.js');
  var allSuburbs = function () {

  }
      SuburbService.getAllSuburbs();
  console.log(allSuburbs);
  res.render('OffPlanProperty/PropertyCreate', { title: '创建楼盘', allSuburbs: allSuburbs });
});

module.exports = router;
