var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {

    if(!req.session.user || (req.session.user.UserType != 3 && req.session.user.UserType != 0))
        return res.redirect('/login');

    var QueryService = require('../../Biz-Service/QueryService');
    QueryService.getInqueryList(function (err, result) {
        if (err) {console.log(err);return res.render('error/500');}

        res.render('InternalSite/query/list', { data: (result.length == 0) ? []: result,
            isOrderAccessible: req.session.user.UserType == 0,
            isEstablishAccessible: true,
            isPropertyAccessible: true,
            isRentAccessible: true,
            isSystemAdmin:req.session.user.UserType == 0,
            isQueryAccessible: true
        });
    });


});

module.exports = router;
