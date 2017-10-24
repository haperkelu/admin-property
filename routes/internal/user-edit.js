var express = require('express');
var router = express.Router({mergeParams: true});

router.get('/', function(req, res, next){

    var userId = req.params.userId;
    if(!userId) return res.render('error/500');
    if(!req.session.user || req.session.user.UserType != 0)  return res.redirect('/login');

    var InternalUserService = require('../../Biz-Service/InternalUserService.js');
    InternalUserService.getSingleUser(userId, function (err, result) {
        if (err || result.length == 0) {console.log(err); return res.render('error/500');}
        if(result[0].Type == 2) {
            InternalUserService.getSingleSalesUser(userId, function (err, result){
                if (err || result.length == 0) {console.log(err); return res.render('error/500');}
                res.render('InternalSite/user/user_edit', {data: result[0], isSystemAdmin :true});
            });
        }
    });

});

module.exports = router;
