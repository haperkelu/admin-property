var express = require('express');
var router = express.Router({mergeParams: true});

router.get('/', function(req, res, next) {
    if(req.session.user == undefined)
         return res.redirect('/login');
    var UserService = require('../../Biz-Service/UserService');
    UserService.getCouponList(req.session.user.Id, function (err, result) {
        if (err) {console.log(err);return res.render('error/500');}
        return res.render('PublicSite/users/user_groupon', {Id:req.session.user.Id, data:result});
    });

});

module.exports = router;
