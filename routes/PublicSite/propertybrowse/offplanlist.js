var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    var PropertyService = require('../../../Biz-Service/PropertyService');
    PropertyService.getHotOffplanList(function (err, result){
        if (err) {console.log(err);return res.render('error/500');}

        res.render('PublicSite/browse/offplanlist', {title: '新房',
            hotPropertyList: result?result:[]});
    });

});

module.exports = router;
