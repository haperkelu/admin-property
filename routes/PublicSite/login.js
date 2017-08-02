var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('PublicSite/users/login', { title: '用户登陆'});
});

module.exports = router;
