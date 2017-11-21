var express = require('express');
var router = express.Router({mergeParams: true});

/* GET users listing. */
router.get('/', function(req, res, next) {
    var email = req.query.email;
    var code = req.query.code;
    var Encryption = require('../../utility/Encryption');
    console.log(Encryption.encrypt(email));
    console.log(Encryption.decrypt(code));
    console.log(email);

    if(Encryption.decrypt(code) != email) return res.render('error/500');

    var DB = require('../../utility/db.js');
    var query = DB.query('Update Sales.BasicUser SET Status = 1 where ?', {Email:email}, function (err, result) {
        if (err) {console.log(err);return res.send('Server Error');}
        return res.redirect('/login');
    });


});

module.exports = router;
