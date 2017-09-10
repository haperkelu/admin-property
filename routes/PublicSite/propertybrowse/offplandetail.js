var express = require('express');
var router = express.Router({mergeParams: true});

/* GET users listing. */
router.get('/', function(req, res, next) {

    var propertyId = req.params.propertyId;
    if(!propertyId) return res.render('error/500');

    var PropertyService = require('../../../Biz-Service/PropertyService');
    PropertyService.getOffplanDetail(propertyId, function (err, result){
        if (err) {console.log(err);return res.render('error/500');}
        res.render('PublicSite/browse/offplandetail', {data: result[0]});
    });

});

module.exports = router;
