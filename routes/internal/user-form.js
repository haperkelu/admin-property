var express = require('express');
var router = express.Router();
var util = require('util');

/* GET home page. */
router.get('/', function(req, res, next) {

    if(req.session.user == undefined)
        return res.redirect('/login');

    res.render('InternalSite/user/user_add', { title: '创建用户',
        isEstablishAccessible: true,
        isPropertyAccessible: true,
        isRentAccessible: true,
        isOrderAccessible: true,
        isSystemAdmin:true,
        isQueryAccessible:true,
        Name: req.session.user.Name,
        Id: req.session.user.Id});

});

module.exports = router;
