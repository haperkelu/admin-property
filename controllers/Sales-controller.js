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
    var DB = require('../utility/db.js');
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
    DB.query('INSERT INTO Sales.BasicUser SET ?', post, function (err, result) {
        if (err) {console.log(err);return res.send('Server Error');}

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
        DB.query('INSERT INTO Sales.Sales SET ?', postSales, function (err, result){
            if (err) {console.log(err);return res.send('Server Error');}
            var salesId  = result.insertId;
            var postSalesBank = {
                SalesId: salesId,
                BankName: bankName,
                BSB: BSB,
                AccountName: bankAccountName,
                AccountNumber: bankAccountNumber,
                ABN: ABN
            };
            DB.query('INSERT INTO Sales.SalesBankDetail SET ?', postSalesBank, function (err, result){
                if (err) {console.log(err);return res.send('Server Error');}
                //var EmailUtility = require('../utility/mail.js');
                //EmailUtility.sendEmail('Mailgun Sandbox <postmaster@sandbox433aec60d9004a9cb18cfabce6b66f9e.mailgun.org>','haperkelu@gmail.com','heloo', '<b>ggg</b>', 'ggg');
                return res.redirect('/sales/detail/' + salesId);
            });
        });
        //console.log(salesQuery.sql);
    });

}

exports.sales_detail = function(req, res, next) {

    var DB = require('../utility/db.js');

    DB.query("SELECT FirstName,LastName,type,DateOfBirth,gender,email,phone,nationality,address FROM Sales.BasicUser where ?",{Id: req.params.id}, function (err, result, fields) {
        if (err) {console.log(err);return res.send('Server Error');}

        var model1 = JSON.parse(JSON.stringify(result));
        console.log(model1)

        DB.query("SELECT Level,ReferralCode,CertificatePath,IDPath FROM Sales.Sales where ?",{BasicUserID: req.params.id}, function (err, result, fields) {
            if (err) {console.log(err);return res.send('Server Error');}

            var model2 = JSON.parse(JSON.stringify(result));
            console.log(model2)

            if (model2.length == 0) {
                model2 = [{
                    Level:0,
                    ReferralCode:"",
                    CertificatePath:"",
                    IDPath:""
                }]
            }
            DB.query("SELECT BankName,BSB,AccountName,AccountNumber,ABN FROM Sales.SalesBankDetail where ?",{SalesId: req.params.id}, function (err, result, fields) {
                if (err) {console.log(err);return res.send('Server Error');}

                console.log("HH")
                var model3 = JSON.parse(JSON.stringify(result));
                console.log(model3)

                if (model3.length == 0) {
                    model3 = [{
                        BankName:"",
                        BSB:"",
                        AccountName:"",
                        AccountNumber:"",
                        ABN:""
                    }]
                }

                var model = Object.assign(model1[0], model2[0], model3[0])
                console.log(model)

                res.render('Sales/SalesDetail', model);

            })

        })

    });
}