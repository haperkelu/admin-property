var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
    var propertyId = parseInt(req.sanitize('propertyId').escape().trim());
    var name = req.sanitize('name').escape().trim();
    var phone = req.sanitize('phone').escape().trim();
    var email = req.sanitize('email').escape().trim();
    var detail = req.sanitize('detail').escape().trim();
    var QueryService = require('../../../Biz-Service/QueryService');
    QueryService.addQuery(propertyId, name, phone, email, detail, function (err, result){
        if (err) {console.log(err);return res.render('error/500');}
        return res.redirect('/public/offplan/list');
    });

});

module.exports = router;
