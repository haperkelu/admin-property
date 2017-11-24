var express = require('express');
var router = express.Router({mergeParams: true});

router.get('/', function(req, res, next) {

  var propertyId = req.params.propertyId;
  if(!propertyId) return res.render('error/500');
    if(!req.session.user || (req.session.user.UserType != 3 && req.session.user.UserType != 0))
        return res.redirect('/login');

  var PropertyService = require('../../Biz-Service/PropertyService.js');
    PropertyService.getOffplanDetail(propertyId, function (err, result) {
      if (err || result.length == 0) {console.log(err); return res.render('error/500')}
      res.render('InternalSite/newhome/propertydetail', { data: result[0],
          isOrderAccessible: req.session.user.UserType == 0,
          isEstablishAccessible: true,
          isPropertyAccessible: true,
          isRentAccessible: true,
          isSystemAdmin: req.session.user.UserType == 0,
          isQueryAccessible: true,
          Name: req.session.user.Name,
          Id: req.session.user.Id
      });
  });

});

module.exports = router;
