exports.user_login_submit = function(req, res, next) {

    var username = req.sanitize('username').escape().trim();
    var password = req.sanitize('password').escape().trim();

    if(!username || !password) return res.render('error/500');

    var Encryption = require('../../utility/Encryption');
    var DB = require('../../utility/db.js');
    DB.query('Select ID, Email, Password from Sales.BasicUser where type = 1 and status = 1 and ?', {Email: username}, function (err, result) {

        if (err) {console.log(err);return res.render('error/500');}

        var usersSelected = JSON.parse(JSON.stringify(result));
        console.log(usersSelected);
        if(usersSelected.length != 1)  return res.redirect(req.get('referer'));
        if(!(Encryption.encrypt(password) === usersSelected[0].Password)) return res.redirect(req.get('referer'));
        req.session.user = {Id: usersSelected[0].ID};
        return res.redirect('/user/' + req.session.user.Id);
    });

}

exports.user_create_submit = function(req, res, next) {
    var referralCode = req.sanitize('referralCode').escape().trim();
    var email = req.sanitize('email').escape().trim();
    var firstName = req.sanitize('firstName').escape().trim();
    var lastName = req.sanitize('lastName').escape().trim();
    var password = req.sanitize('password').escape().trim();
    var passwordConfirm = req.sanitize('passwordConfirm').escape().trim();
    var DOB = req.sanitize('DOB').escape().trim();
    var gender = req.sanitize('gender').escape().trim();
    var nationality = req.sanitize('nationality').escape().trim();
    var identityStatus = req.sanitize('identityStatus').escape().trim();
    var phone = req.sanitize('phone').escape().trim();
    var address = req.sanitize('address').escape().trim();

    var DB = require('../../utility/db.js');
    var post = {
        type: 1,
        status:1,
        firstname: firstName,
        lastname: lastName,
        DateOfBirth: DOB,
        gender: gender,
        email: email,
        phone: phone,
        password: password,
        nationality: nationality,
        address: address,
        identityStatus: identityStatus,
        createdBy: 1
    };
    var query = DB.query('INSERT INTO Sales.BasicUser SET ?', post, function (err, result) {
        if (err) {console.log(err);return res.send('Server Error');}
        var id = result.insertId;
        DB.query('INSERT INTO Sales.Customer SET ?', {BasicUserId:id,ReferralCode: ReferralCode}, function (err, result){
            if (err) {console.log(err);return res.send('Server Error');}
            return res.redirect('/user/' + result.insertId);
        });
    });
    //console.log(query.sql);

}