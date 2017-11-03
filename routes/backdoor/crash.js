var express = require('express');
var router = express.Router({mergeParams: true});

router.get('/', function(req, res, next) {

    if(!req.session.user || (req.session.user.UserType != 0))
        return res.redirect('/login');
    var i = cccc / 100;
    res.render('error/500', {});
});

module.exports = router;
