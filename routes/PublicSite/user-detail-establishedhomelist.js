var express = require('express');
var router = express.Router({mergeParams: true});

router.get('/', function(req, res, next) {
    if(req.session.user == undefined)
         return res.redirect('/login');
    var pageSize = 10;
    var currentPage = req.query.currentPage? req.query.currentPage:1;

    var UserService = require('../../Biz-Service/UserService');
    UserService.getEstablishedHomeList(req.session.user.Id, function (err, result) {
        console.log(result.length / pageSize);
        if (err) {console.log(err);return res.render('error/500');}
        return res.render('PublicSite/users/UserEstablishedHomeList',
            {Id:req.session.user.Id, Name: req.session.user.Name,
                pageCount: result.length / pageSize, pageSize: pageSize, currentPage: currentPage,
                currentURL: '/user/' + req.session.user.Id + '/userEstablishedHomeList',
                data:result});
    });
});

module.exports = router;
