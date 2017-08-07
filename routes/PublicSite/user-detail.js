var express = require('express');
var router = express.Router({mergeParams: true});

router.get('/', function(req, res, next) {
    console.log(req.session.user);
    var UserService = require('../../Biz-Service/UserService');
    UserService.getBasicInfo(req.session.user.Id, function (err, result) {
        if (err || result.length == 0) {console.log(err);return res.render('error/500');}
        console.log(result);
        return res.render('PublicSite/users/UserProfile', result[0]);
    });

});

module.exports = router;
