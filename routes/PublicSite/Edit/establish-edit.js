var express = require('express');
var router = express.Router({mergeParams: true});
var util = require('util');

router.get('/', function(req, res, next) {

  var propertyId = req.params.propertyId;
  if(!propertyId) return res.render('error/500');
  if(!req.session.user)
        return res.redirect('/login');

  var PropertyService = require('../../../Biz-Service/PropertyService.js');
    PropertyService.getSalesDetail(propertyId, function (err, result) {
      if (err || result.length == 0) {console.log(err); return res.render('error/500')}
        if(req.session.user.Id != result[0].CustomerId) return res.render('error/500');

        res.render('PublicSite/browse/resaleedit', { data: result[0],
          Name: req.session.user.Name,
          Id: req.session.user.Id});
  });

});

module.exports = router;
