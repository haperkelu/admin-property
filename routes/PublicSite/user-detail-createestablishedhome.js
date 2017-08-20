var express = require('express');
var router = express.Router({mergeParams: true});

router.get('/', function(req, res, next) {
    if(req.session.user == undefined)
         return res.redirect('/login');

    return res.render('PublicSite/users/UserCreateEstablishedHome',
        {Id:req.session.user.Id,
            currentURL: '/user/' + req.session.user.Id + '/userEstablishedHome/create'});

});

module.exports = router;
