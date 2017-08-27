var express = require('express');
var router = express.Router({mergeParams: true});

router.get('/', function(req, res, next) {
    if(req.session.user == undefined)
         return res.redirect('/login');

    return res.render('PublicSite/users/UserCreateRent',
        {Id:req.session.user.Id,
            currentURL: '/user/' + req.session.user.Id + '/userRent/create'});

});

module.exports = router;
