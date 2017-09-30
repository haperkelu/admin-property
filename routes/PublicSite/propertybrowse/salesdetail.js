var express = require('express');
var router = express.Router({mergeParams: true});

/* GET users listing. */
router.get('/', function(req, res, next) {

    var propertyId = req.params.propertyId;
    if(!propertyId) return res.render('error/500');
    if(propertyId == 'favicon.ico') return res.status(204);

    var PropertyService = require('../../../Biz-Service/PropertyService');
    PropertyService.getSalesDetail(propertyId, function (err, result){
        if (err) {console.log(err);return res.render('error/500');}
        res.render('PublicSite/browse/salesdetail', {data: result[0]});
    });

});

module.exports = router;
