var express = require('express');
var router = express.Router({mergeParams: true});

router.get('/', function(req, res, next) {

  var orderId = req.params.orderId;
  if(!orderId) return res.render('error/500');
  if(req.session.user == undefined)
        return res.redirect('/login');

  var OrderService = require('../../Biz-Service/OrderService.js');
    OrderService.getOrderDetail(orderId, function (err, result) {
      if (err || result.length == 0) {console.log(err); return res.render('error/500')}
      res.render('InternalSite/Order/order_detail', { data: result[0] });
  });

});

module.exports = router;
