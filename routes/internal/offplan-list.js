var express = require('express');
var router = express.Router();
var util = require('util');

/* GET home page. */
router.get('/', function(req, res, next) {

    if(!req.session.user || (req.session.user.UserType != 3 && req.session.user.UserType != 0))
        return res.redirect('/login');

  var PropertyService = require('../../Biz-Service/PropertyService.js');
    PropertyService.getOffplanListWithAllStatus(function (err, result) {
      if (err) {console.log(err);}
      res.render('InternalSite/newhome/propertylist', { data: result,
          isEstablishAccessible: true,
          isPropertyAccessible: true,
          isRentAccessible: true,
          isOrderAccessible: req.session.user.UserType == 0,
          isSystemAdmin: req.session.user.UserType == 0,
          isQueryAccessible: true
      });
  });

});

module.exports = router;
