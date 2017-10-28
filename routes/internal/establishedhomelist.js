var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {

    if(!req.session.user || (req.session.user.UserType != 3 && req.session.user.UserType != 0))
        return res.redirect('/login');

    var PropertyService = require('../../Biz-Service/PropertyService');
    PropertyService.getEstablishedHomeListWithAllStatus(function (err, result){
        if (err || result.length == 0) {console.log(err);return res.render('error/500');}

        res.render('InternalSite/resalehome/resalehome_list', {
            data: result,
            isEstablishAccessible: true,
            isPropertyAccessible: true,
            isRentAccessible: true,
            isSystemAdmin: req.session.user.UserType == 0
        });
    });

});



module.exports = router;
