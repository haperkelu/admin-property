var express = require('express');
var router = express.Router();
var util = require('util');

/* GET home page. */
router.get('/', function(req, res, next) {

  var PropertyService = require('../../Biz-Service/PropertyService.js');
    PropertyService.getOffplanListWithAllStatus(function (err, result) {
      if (err) {console.log(err);}
      res.render('InternalSite/newhome/propertylist', { data: result });
  });

});

module.exports = router;
