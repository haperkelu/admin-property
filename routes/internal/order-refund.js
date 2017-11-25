var express = require('express');
var router = express.Router({mergeParams: true});

router.get('/', function(req, res, next){

    if(!req.session.user || (req.session.user.UserType != 2 && req.session.user.UserType != 0 && req.session.user.UserType != 4))
        return res.send('无权限退款');

    var orderId = req.params.orderId;
    if(!orderId) return res.render('error/500');

    var OrderService = require('../../Biz-Service/OrderService.js');
    OrderService.getOrderDetail(orderId, function (err, result) {
        if (err || !result[0]) {console.log(err); return res.render('error/500');}
        if(result[0].OrderStatus != 0 && result[0].OrderStatus != 1) {
            return res.send('该订单不能退款');
        }
        if(req.session.user.UserType == 2 && result[0].SalesEmail != req.session.user.Email) {
            return res.render('error/500');
        }
        var DB = require('../../utility/db.js');
        var post = {
            isRefund:1,
            OrderStatus: 4
        };
        DB.query('Update Sales.Order SET ? where Id=' + orderId, post, function (err, result) {
            if (err) {console.log(err);return res.send('Server Error');}
            return res.redirect('/internal/ordder/list');
        });


    });

});

module.exports = router;
