var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {

    if(!req.session.user || (req.session.user.UserType != 3 && req.session.user.UserType != 0))
        return res.redirect('/login');
console.log(req.session.user);
  var SuburbService = require('../../Biz-Service/SuburbService.js');
  SuburbService.getAllSuburbs(function (err, result) {
      if (err) {console.log(err);}
      res.render('InternalSite/newhome/propertycreate', { title: '创建楼盘', allSuburbs: result,
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
