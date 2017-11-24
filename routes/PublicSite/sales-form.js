var express = require('express');
var router = express.Router();
var util = require('util');

/* GET home page. */
router.get('/', function(req, res, next) {

    res.render('PublicSite/sales/user_add', { title: '创建用户'});

});

module.exports = router;
