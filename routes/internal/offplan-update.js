var express = require('express');
var router = express.Router({mergeParams: true});

router.post('/', function(req, res, next) {

    if(!req.session.user || (req.session.user.UserType != 3 && req.session.user.UserType != 0))
        return res.send('Server Error');

    var PropertyId = req.sanitize('propertyId').escape().trim();
    console.log(PropertyId);
    var Address = req.sanitize('Address').escape().trim();
    var District = req.sanitize('District').escape().trim();
    var name = req.sanitize('Name').escape().trim();
    var propertyType = decodeURIComponent(req.sanitize('PropertyType').trim());
    var isHot = req.sanitize('IsHot').escape().trim();
    var Description = req.sanitize('Description').escape().trim();
    var DeveloperAuthBeginDate = decodeURIComponent(req.sanitize('AuthBegindate').trim());
    var DeveloperAuthEndDate = decodeURIComponent(req.sanitize('AuthEnddate').trim());
    console.log(DeveloperAuthBeginDate);
    console.log(DeveloperAuthEndDate);
    var commissionRate = req.sanitize('CommissionRate').escape().trim();
    var memo = req.sanitize('Memo').escape().trim();
    //var Status = req.sanitize('Status').escape().trim();
    var DetailLink = req.sanitize('DetailLink').escape().trim();

    var S3 = require("../../utility/S3.js");
    var bucketName = 'propertypicsstore';
    var PicPath = '';
    var DeveloperAuthContractPath = '';
    if(req.files) {
        for(var key in req.files) {
            var keyName = new Date().getTime() + '_' + key;
            if(key == 'PicPath') {
                bucketName = 'propertypicsstore';
                PicPath = '/' + bucketName + '/' + keyName;
            } else {
                bucketName = 'propertycontract';
                DeveloperAuthContractPath = '/' + bucketName + '/' + keyName;
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
    var DB = require('../../utility/db.js');
    var post = {
        Name: name,
        Address: Address,
        District: District,
        PropertyType: propertyType,
        PicPath: PicPath,
        Description: Description
    };
    DB.query('UPDATE Sales.Property SET ? where ID = ' + PropertyId, post, function (err, result) {
        if (err) {console.log(err);return res.send('Server Error');}
        var propertyId  = result.insertId;
        var post = {
            IsHot:(isHot == '1' ? 1:0),
            DeveloperAuthBeginDate: DeveloperAuthBeginDate,
            DeveloperAuthEndDate: DeveloperAuthEndDate,
            DeveloperAuthContractPath:DeveloperAuthContractPath,
            CommissionRate:commissionRate, Memo:memo, DetailLink:DetailLink
        };
        console.log('before'  + PropertyId);
        DB.query('UPDATE Sales.PropertyOffplanExt SET ? where PropertyId = ' + PropertyId, post, function (err, result){
            if (err) {console.log(err);return res.send('Server Error');}
            return res.redirect('/internal/offplanProperty/list');
        });
    });

});

module.exports = router;
