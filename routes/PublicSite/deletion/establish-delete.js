var express = require('express');
var router = express.Router({mergeParams: true});

router.get('/', function(req, res, next) {

    var PropertyId = req.params.propertyId;
    if(PropertyId == undefined) return res.send('Server Error');
    if(!req.session.user) return res.send('Server Error');
    console.log('all good');
    var PropertyService = require('../../../Biz-Service/PropertyService');
    PropertyService.getSalesDetail(PropertyId, function (err, result){
        if (err || result.length == 0) {console.log(err);return res.render('error/500');}
        if(req.session.user.Id != result[0].CustomerId) return res.render('error/500');

        var DB = require('../../../utility/db.js');
        DB.query('delete from Sales.Property where Id=' + PropertyId, null, function (err, result) {
                if (err) {console.log(err);return res.send('Server Error');}
                return res.redirect('/user/' + req.session.user.Id);
        });
    });

});

module.exports = router;

