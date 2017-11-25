var express = require('express');
var router = express.Router({mergeParams: true});

router.get('/', function(req, res, next){

    if(!req.session.user || (req.session.user.UserType != 3 && req.session.user.UserType != 0))
        return res.redirect('/login');

    var propertyId = req.params.propertyId;
    var reason = decodeURIComponent(req.query.reason);
    console.log(reason);
    if(!propertyId) return res.render('error/500');
    var DB = require('../../utility/db.js');

    DB.query('Update Sales.Property SET ? where Id=' + propertyId,
        {Status: 2, RejectReason: reason}, function (err, result) {
        if (err) {console.log(err);return res.send('Server Error');}
        return res.redirect('/internal/established/list');
    });

});

module.exports = router;
