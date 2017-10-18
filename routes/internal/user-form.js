var express = require('express');
var router = express.Router();
var util = require('util');

/* GET home page. */
router.get('/', function(req, res, next) {

    if(req.session.user == undefined)
        return res.redirect('/login');

    res.render('InternalSite/user/user_add', { title: '创建用户'});

});

module.exports = router;
