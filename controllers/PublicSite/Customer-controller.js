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
        if(usersSelected.length != 1)  return res.redirect(req.get('referer') + '?msg=userNotFound');
        if(!(Encryption.encrypt(password) === usersSelected[0].Password)) return res.redirect(req.get('referer') + '?msg=userNotFound');
        req.session.user = {Id: usersSelected[0].ID, Email: usersSelected[0].Email};
        return res.redirect('/user/' + req.session.user.Id);
    });

}

exports.user_create_submit = function(req, res, next) {

    var referralCode = req.sanitize('referralcode').escape().trim();
    var email = req.sanitize('email').escape().trim();
    var password = req.sanitize('password').escape().trim();
    var passwordConfirm = req.sanitize('passwordConfirm').escape().trim();

    if(!email || !password) return res.render('error/500');

    var DB = require('../../utility/db.js');
    var post = {
        type: 1,
        status:1,
        //firstname: firstName,
        //lastname: lastName,
        //DateOfBirth: DOB,
        //gender: gender,
        email: email,
        //phone: phone,
        password: password,
        //nationality: nationality,
        //address: address,
        //identityStatus: identityStatus,
        createdBy: 1
    };
    var query = DB.query('INSERT INTO Sales.BasicUser SET ?', post, function (err, result) {
        if (err) {console.log(err);return res.send('Server Error');}
        var id = result.insertId;
        DB.query('INSERT INTO Sales.Customer SET ?', {BasicUserId:id, ReferralCode: referralCode}, function (err, result){
            if (err) {console.log(err);return res.send('Server Error');}
            return res.redirect('/user/' + result.insertId);
        });
    });
    //console.log(query.sql);

}

exports.user_update_basic = function(req, res, next) {

    var Id = req.sanitize('Id').escape().trim();
    var email = req.sanitize('Email').escape().trim();
    var referralCode = req.sanitize('Referralcode').escape().trim();
    var firstName = req.sanitize('FirstName').escape().trim();
    var lastName = req.sanitize('LastName').escape().trim();
    var DOB = req.sanitize('DateOfBirth').escape().trim();
    var gender = req.sanitize('Gender').escape().trim();
    var nationality = req.sanitize('Nationality').escape().trim();
    var identityStatus = req.sanitize('IdentityStatus').escape().trim();
    var phone = req.sanitize('Phone').escape().trim();
    var address = req.sanitize('Address').escape().trim();
    var DB = require('../../utility/db.js');
    /**
    var post = [
        firstName,
        lastName,
        DOB,
        gender,
        email,
        phone,
        nationality,
        address,
        identityStatus,
        Id
    ]; **/
    var post = {
        Firstname: firstName,
        Lastname: lastName,
        DateOfBirth: DOB,
        Gender: gender,
        Email: email,
        Phone: phone,
        Nationality: nationality,
        Address: address,
        IdentityStatus: identityStatus
    };
    var query = DB.query('Update Sales.BasicUser SET ? where id = ' + Id, post, function (err, result) {
        if (err) {console.log(err);return res.send('Server Error');}
        DB.query('Update Sales.Customer SET ? where BasicUserId = ' + Id, {ReferralCode: referralCode}, function (err, result){
            if (err) {console.log(err);return res.send('Server Error');}
            return res.redirect('/user/' + Id);
        });
    });

}