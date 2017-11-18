var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    var email = req.query.email;
    if(email) {
        var Encryption = require('../../utility/Encryption');
        var EmailUtil = require('../../utility/mail');
        var DB = require('../../utility/db.js');
        DB.query('Select ID, Email,Password,Type,LastName,FirstName,Phone from Sales.BasicUser where status = 1 and ?', {Email: email}, function (err, result) {
            if (err) {console.log(err);return res.render('error/500');}
            var usersSelected = JSON.parse(JSON.stringify(result));
            if(usersSelected.length != 1) return res.render('error/500');
            var userId = usersSelected[0].ID;
            var newPwd = new Date().getTime();
            var newPwdEncrypted = Encryption.encrypt(newPwd + '');
            console.log(newPwd);
            var content = '您的新密码是:' + newPwd;
            EmailUtil.sendEmail('admin@Ausun.com.au', email, 'Password Reset',content, content);
            DB.query('Update Sales.BasicUser SET ? where ID = ' + userId, {Password: newPwdEncrypted}, function (err, result) {
                if (err) {console.log(err);return res.render('error/500');}
                res.render('PublicSite/users/login', { title: '用户登陆'});
            });
        });
    }
});

module.exports = router;
