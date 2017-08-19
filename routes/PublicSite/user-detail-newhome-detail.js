var express = require('express');
var router = express.Router({mergeParams: true});

router.get('/', function(req, res, next) {
    if(req.session.user == undefined)
         return res.redirect('/login');

    var UserService = require('../../Biz-Service/UserService');
    UserService.getNewHomeDetail(req.params.homeId, function (err, newHome) {
        if (err || newHome.length == 0) {console.log(err);return res.render('error/500');}

        UserService.getCouponList(req.session.user.Id, function (err, result) {
            if (err) {console.log(err);return res.render('error/500');}
            return res.render('PublicSite/users/UserNewHomeDetail',
                {Id:req.session.user.Id,
                    data: newHome[0], couponList: result});
        });
    });
});

module.exports = router;
