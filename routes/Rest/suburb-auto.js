var express = require('express');
var router = express.Router({mergeParams: true});

/* GET users listing. */
router.get('/', function(req, res, next) {
    var SuburbService = require('../../Biz-Service/SuburbService');
    var cityName = req.query.city? req.query.city:'Sydney';
    console.log(req.params.city);
    SuburbService.getAllSuburbsByCity(cityName, function (err, result) {
        if (err) {res.json({ code: '500', message: 'server erro' });};
        res.json(result);
    });
});

module.exports = router;
