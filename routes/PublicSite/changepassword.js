var express = require('express');
var router = express.Router({mergeParams: true});

/* GET users listing. */
router.post('/', function(req, res, next) {

    if(!req.session.user || !req.session.user.Id) return res.redirect('/login');

    var oldpassword = req.sanitize('oldpassword')? req.sanitize('oldpassword').escape().trim(): '';
    var newpassword = req.sanitize('newpassword')? req.sanitize('newpassword').escape().trim(): '';
    var rpassword = req.sanitize('rpassword')? req.sanitize('rpassword').escape().trim(): '';

    if(!oldpassword || !newpassword || !rpassword || newpassword != newpassword){
        return res.redirect('/user/' + req.session.user.Id);
    }
    var Encryption = require('../../utility/Encryption');
    var DB = require('../../utility/db.js');
    DB.query('Select ID, Email,Password,Type,LastName,FirstName,Phone,Password from Sales.BasicUser where status = 1 and ?', {ID: req.session.user.Id}, function (err, result) {
        if (err) {console.log(err);return res.render('error/500');}
        var usersSelected = JSON.parse(JSON.stringify(result));
        if(usersSelected.length != 1) return res.render('error/500');
        if(usersSelected[0].Password != oldpassword) return res.redirect('/user/' + req.session.user.Id + '?msg=pwdwrong');
        var userId = usersSelected[0].ID;
        var newPwdEncrypted = Encryption.encrypt(newpassword);
        DB.query('Update Sales.BasicUser SET ? where ID = ' + userId, {Password: newPwdEncrypted}, function (err, result) {
            if (err) {console.log(err);return res.render('error/500');}
            return res.redirect('/user/' + req.session.user.Id);
        });
    });

});

module.exports = router;
