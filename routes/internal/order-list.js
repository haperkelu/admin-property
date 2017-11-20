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
          var filteredResult = [];
          for(var i in result){
              if((req.session.user.UserType == 2 && result[i].SalesEmail == req.session.user.Email)
              || req.session.user.UserType == 0 || req.session.user.UserType == 4){
                  filteredResult.push(result[i]);
              }
          }

          res.render('InternalSite/Order/order_list', { data: filteredResult?filteredResult: [],
              isOrderAccessible: true,
              isEstablishAccessible: req.session.user.UserType == 0,
              isPropertyAccessible: req.session.user.UserType == 0,
              isRentAccessible: req.session.user.UserType == 0,
              isSystemAdmin:req.session.user.UserType == 0,
              isQueryAccessible: req.session.user.UserType == 0
          });
      });

});

module.exports = router;
