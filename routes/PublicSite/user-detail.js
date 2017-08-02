var express = require('express');
var router = express.Router({mergeParams: true});

router.get('/', function(req, res, next) {
    console.log(req.session.user);
    res.render('PublicSite/users/portal', {  title: '个人中心' });
});

module.exports = router;
