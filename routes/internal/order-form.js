var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    if(!req.session.user || (req.session.user.UserType != 2 && req.session.user.UserType != 0))
        return res.redirect('/login');

    var PropertyService = require('../../Biz-Service/PropertyService.js');
    var fs = require('fs');
    var companyLayers = JSON.parse(fs.readFileSync('./config/Company_Lawyer.json', 'utf8'));
    console.log(companyLayers);
    PropertyService.getOffplanListWithAllStatus(function (err, result) {
        if (err) {console.log(err); return res.render('error/500');}
        res.render('InternalSite/Order/order_add', { title: '创建楼盘', offplanList: result, companyLawyers: companyLayers,
            isOrderAccessible: true,
            isEstablishAccessible: req.session.user.UserType == 0,
            isPropertyAccessible: req.session.user.UserType == 0,
            isRentAccessible: req.session.user.UserType == 0,
            isSystemAdmin:req.session.user.UserType == 0,
                currentEmail: req.session.user.UserType == 2? req.session.user.Email:'',
                currentPhone: req.session.user.UserType == 2? req.session.user.Phone:'',
                currentName: req.session.user.UserType == 2? req.session.user.Name:''
        });
    });

});

module.exports = router;
