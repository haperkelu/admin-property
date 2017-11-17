var express = require('express');
var router = express.Router({mergeParams: true});

router.get('/', function(req, res, next) {
    if(req.session.user == undefined)
         return res.redirect('/login');
    var UserService = require('../../Biz-Service/UserService');
    UserService.getNewHomeList(req.session.user.Email, function (err, result) {
        console.log(result);
        if (err) {console.log(err);return res.render('error/500');}
        return res.render('PublicSite/users/UserNewHomeList', {Id:req.session.user.Id, Name: req.session.user.Name,data:result});
    });
});

module.exports = router;
