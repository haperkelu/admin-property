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

    console.log(req.files);

    var S3 = require("../utility/S3.js");
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
        if (err) console.log(err);

        var id = result.insertId;
        var bucketName = 'salesprofiles';
        var CertificatePath = '';
        var IDPath = '';

        if(req.files) {
            for(var key in req.files) {
                var keyName = id + '_' + key;
                if(key == 'certificatePath') {
                    CertificatePath = '/' + bucketName + '/' + keyName;
                }else {
                    IDPath = '/' + bucketName + '/' + keyName;
                }
                var params = {Bucket: bucketName, Key: keyName, Body:req.files[key].data};
                S3.putObject(params, function(err, data) {
                    if (err)
                        console.log(err);
                    else
                        console.log("Successfully uploaded data to salesprofiles" + "/" + keyName);
                });
            }
        }
        var postSales = {
            BasicUserId: id,
            Level: 3,
            ReferralCode: referralCode,
            CertificatePath: CertificatePath,
            IDPath: IDPath
        };
        var salesQuery = dbcon.query('INSERT INTO Sales.Sales SET ?', postSales, function (err, result){
            if (err) console.log(err);
            var salesId  = result.insertId;
            var postSalesBank = {
                SalesId: salesId,
                BankName: bankName,
                BSB: BSB,
                AccountName: bankAccountName,
                AccountNumber: bankAccountNumber,
                ABN: ABN
            };
            dbcon.query('INSERT INTO Sales.SalesBankDetail SET ?', postSalesBank, function (err, result){
                if (err) console.log(err);
                //var EmailUtility = require('../utility/mail.js');
                //EmailUtility.sendEmail('Mailgun Sandbox <postmaster@sandbox433aec60d9004a9cb18cfabce6b66f9e.mailgun.org>','haperkelu@gmail.com','heloo', '<b>ggg</b>', 'ggg');
                return res.redirect('/sales/detail/' + salesId);
            });
        });
        //console.log(salesQuery.sql);
    });

}