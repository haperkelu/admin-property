var express = require('express');
var router = express.Router({mergeParams: true});

router.get('/', function(req, res, next){

    var orderId = req.params.orderId;
    if(!orderId) return res.render('error/500');
    if(!req.session.user)
        return res.redirect('/login');
    console.log(req.session.user);

    var OrderService = require('../../Biz-Service/OrderService.js');
    OrderService.getOrderDetail(orderId, function (err, result) {
        if (err || result.length == 0) {console.log(err); return res.render('error/500');}

        var currentProperty = result[0];
        var PropertyService = require('../../Biz-Service/PropertyService.js');
        var fs = require('fs');
        var companyLayers = JSON.parse(fs.readFileSync('./config/Company_Lawyer.json', 'utf8'));
        PropertyService.getOffplanListWithAllStatus(function (err, result) {
            if (err) {console.log(err); return res.render('error/500');}
            res.render('InternalSite/Order/order_edit', {
                offplanList: result, companyLawyers: companyLayers, data: currentProperty,
                isOrderAccessible: true,
                isEstablishAccessible: req.session.user.UserType == 0,
                isPropertyAccessible: req.session.user.UserType == 0,
                isRentAccessible: req.session.user.UserType == 0,
                isSystemAdmin:req.session.user.UserType == 0,
                isSales:req.session.user.UserType == 2,
                Name: req.session.user.Name,
                Id: req.session.user.Id
            });
        });
    });

});

module.exports = router;
