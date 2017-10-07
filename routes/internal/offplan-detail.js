var express = require('express');
var router = express.Router({mergeParams: true});
var util = require('util');

/* GET home page. */
router.get('/', function(req, res, next) {

  var propertyId = req.params.propertyId;
  if(!propertyId) return res.render('error/500');
  if(req.session.user == undefined)
        return res.redirect('/login');

  var PropertyService = require('../../Biz-Service/PropertyService.js');
    PropertyService.getOffplanDetail(propertyId, function (err, result) {
      if (err || result.length == 0) {console.log(err); return res.render('error/500')}
      res.render('InternalSite/newhome/propertydetail', { data: result[0] });
  });

});

module.exports = router;
