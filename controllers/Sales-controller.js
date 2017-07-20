exports.sales_create_submit = function(req, res, next) {
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

    var bankName = req.sanitize('bankName').escape().trim();
    var bankAccountName = req.sanitize('bankAccountName').escape().trim();
    var bankAccountNumber = req.sanitize('bankAccountNumber').escape().trim();
    var BSB = req.sanitize('BSB').escape().trim();
    var ABN = req.sanitize('ABN').escape().trim();

    var dbcon = require('../utility/db');
    var post = {
        type: 2,
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
    var query = dbcon.query('INSERT INTO Sales.BasicUser SET ?', post, function (err, result) {
        if (err) throw err;

        var id = result.insertId;
        var post = {
            BasicUserId: id,
            Level: 3,
            ReferralCode: referralCode,
            CertificatePath: 'xxx',
            IDPath: 'xxxx'
        };
        dbcon.query('INSERT INTO Sales.Sales SET ?', post, function (err, result){
            if (err) throw err;
        });
    });
    console.log(query.sql);
}