var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(req.session.user);
    if(!req.session.user || (req.session.user.UserType != 2 && req.session.user.UserType != 0 && req.session.user.UserType != 4))
        return res.redirect('/login');

      var OrderService = require('../../Biz-Service/OrderService.js');
        OrderService.getAllOrders(function (err, result) {
          if (err) {console.log(err);}
          res.render('InternalSite/Order/order_list', { data: result?result: [],
              isOrderAccessible: true,
              isEstablishAccessible: req.session.user.UserType == 0,
              isPropertyAccessible: req.session.user.UserType == 0,
              isRentAccessible: req.session.user.UserType == 0,
              isSystemAdmin:req.session.user.UserType == 0});
      });

});

module.exports = router;
