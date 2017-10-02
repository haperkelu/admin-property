var express = require('express');
var router = express.Router();
var util = require('util');

/* GET home page. */
router.get('/', function(req, res, next) {

  var SuburbService = require('../../Biz-Service/SuburbService.js');
  SuburbService.getAllSuburbs(function (err, result) {
      if (err) {console.log(err);}
      res.render('InternalSite/newhome/PropertyCreate', { title: '创建楼盘', allSuburbs: result });
  });

});

module.exports = router;
