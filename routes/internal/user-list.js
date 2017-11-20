var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    if(!req.session.user || req.session.user.UserType != 0)
        return res.redirect('/login');

    var InternalUserService = require('../../Biz-Service/InternalUserService.js');
    InternalUserService.getAllUsers(function (err, result) {
        if (err) {console.log(err);}
        res.render('InternalSite/user/user_list', { data: result?result: [],
            isEstablishAccessible: true,
            isPropertyAccessible: true,
            isRentAccessible: true,
            isOrderAccessible: true,
            isSystemAdmin:true,
            isQueryAccessible: true
        });
    });

});

module.exports = router;
