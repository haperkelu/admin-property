var express = require('express');
var router = express.Router();
var util = require('util');

/* GET home page. */
router.get('/', function(req, res, next) {

  var OrderService = require('../../Biz-Service/OrderService.js');
    OrderService.getAllOrders(function (err, result) {
      if (err) {console.log(err);}
      res.render('InternalSite/Order/order_list', { data: result?result: [] });
  });

});

module.exports = router;
