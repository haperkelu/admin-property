var express = require('express');
var router = express.Router({mergeParams: true});

/* GET users listing. */
router.get('/', function(req, res, next) {

    var propertyId = req.params.propertyId;
    if(!propertyId) return res.render('error/500');

    var PropertyService = require('../../../Biz-Service/PropertyService');
    PropertyService.getRentDetail(propertyId, function (err, result){
        if (err) {console.log(err);return res.render('error/500');}
        res.render('PublicSite/browse/rentdetail', {data: result[0]});
    });

});

module.exports = router;
