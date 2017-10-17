var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {

    var PropertyService = require('../../Biz-Service/PropertyService.js');
    var fs = require('fs');
    var companyLayers = JSON.parse(fs.readFileSync('./config/Company_Lawyer.json', 'utf8'));
    console.log(companyLayers);
    PropertyService.getOffplanListWithAllStatus(function (err, result) {
        if (err) {console.log(err); return res.render('error/500');}
        res.render('InternalSite/Order/order_add', { title: '创建楼盘', offplanList: result, companyLawyers: companyLayers});
    });

});

module.exports = router;
