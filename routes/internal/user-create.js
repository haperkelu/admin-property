var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next){
    var Type = decodeURIComponent(req.sanitize('Type').trim());
    var Email = req.sanitize('Email').escape().trim();
    var Level = req.sanitize('Level').escape().trim();
    var LastName = req.sanitize('LastName').escape().trim();
    var FirstName = req.sanitize('FirstName').escape().trim();
    var UserPassword = req.sanitize('password').escape().trim();
    //console.log('pwd:' + UserPassword);
    var DateOfBirth = decodeURIComponent(req.sanitize('DateOfBirth').trim())
    var Gender = req.sanitize('Gender').escape().trim();
    var Nationality = req.sanitize('Nationality').escape().trim();
    var IdentityStatus = req.sanitize('IdentityStatus').escape().trim();
    var Phone = req.sanitize('Phone').escape().trim();
    var Address = req.sanitize('Address').escape().trim();
    var CertificateStatus = req.sanitize('CertificateStatus').escape().trim();

    var DB = require('../../utility/db.js');
    var Encryption = require('../../utility/Encryption');
    var post = {
        Type: parseInt(Type),
        Status: CertificateStatus,
        FirstName: FirstName,
        LastName: LastName,
        Password: Encryption.encrypt(UserPassword),
        DateOfBirth: DateOfBirth,
        Gender: Gender,
        Nationality: Nationality,
        IdentityStatus: IdentityStatus,
        Phone: Phone,
        Email: Email,
        CreatedDate: new Date(),
        createdBy: req.session.user.Id
    };
    DB.query('INSERT INTO Sales.BasicUser SET ?', post, function (err, result) {
        if (err) {console.log(err);return res.send('Server Error');}
        var userId  = result.insertId;
        var AccountName = req.sanitize('AccountName').escape().trim();
        var BankName = req.sanitize('BankName').escape().trim();
        var BSB = req.sanitize('BSB').escape().trim();
        var AccountNumber = req.sanitize('AccountNumber').escape().trim();
        var ABN = req.sanitize('ABN').escape().trim();


        var post = {
            SalesId: userId,
            AccountName: AccountName,
            BankName: BankName,
            BSB: BSB,
            AccountNumber: AccountNumber,
            ABN: ABN
        };

        DB.query('INSERT INTO Sales.SalesBankDetail SET ?', post, function (err, result) {
            if (err) {console.log(err);return res.send('Server Error');}
            var S3 = require("../../utility/S3.js");
            var bucketName = 'salesprofiles';
            var CertificatePath = '';
            if(req.files) {
                for(var key in req.files) {
                    var keyName = new Date().getTime() + '_' + key;
                    if(key == 'CertificatePath') {
                        CertificatePath = '/' + bucketName + '/' + keyName;
                    }
                    var params = {Bucket: bucketName, Key: keyName, Body:req.files[key].data};
                    S3.putObject(params, function(err, data) {
                        if (err)
                            console.log(err);
                        else
                            console.log("Successfully uploaded data to" + keyName);
                    });
                }
            }
            var fs = require('fs');
            var SalesCommissionRate = '';
            if(parseInt(Type) == 2) {
                var SalesLevelArr = JSON.parse(fs.readFileSync('./config/commission_level.json', 'utf8'));
                if(Level == SalesLevelArr.data[0].Level) SalesCommissionRate = SalesLevelArr.data[0].Value;
                if(Level == SalesLevelArr.data[1].Level) SalesCommissionRate = SalesLevelArr.data[1].Value;
                if(Level == SalesLevelArr.data[2].Level) SalesCommissionRate = SalesLevelArr.data[2].Value;
            }
            var shortid = require('shortid');
            var post = {
                BasicUserId: userId,
                Level: Level,
                GeneratedToken: shortid.generate(),
                CertificatePath: CertificatePath,
                CertificateStatus: CertificateStatus,
                SalesCommissionRate:SalesCommissionRate
            };


            DB.query('INSERT INTO Sales.Sales SET ?', post, function (err, result) {
                if (err) {console.log(err);return res.send('Server Error');}

                return res.redirect('/internal/user/list');
            });

        });

    });


});

module.exports = router;
