var express = require('express');
var router = express.Router({mergeParams: true});

router.post('/', function(req, res, next) {

    if(!req.session.user)
        return res.redirect('/login');
    var Id = req.params.id;
    var PropertyId = req.sanitize('PropertyId').escape().trim();
    if(!PropertyId) return res.render('error/500');

    var PropertyType = req.sanitize('PropertyType').escape().trim();
    var NumOfRoom = req.sanitize('NumOfRoom').escape().trim();
    var NumOfBath = req.sanitize('NumOfBath').escape().trim();
    var NumOfPark = req.sanitize('NumOfPark').escape().trim();
    var PurchaseType = req.sanitize('PurchaseType').escape().trim();
    var LowPrice = req.sanitize('LowPrice').escape()? req.sanitize('LowPrice').escape().trim(): '';
    var HighPrice = req.sanitize('HighPrice').escape()? req.sanitize('HighPrice').escape().trim(): '';
    var Source = req.sanitize('Source').escape().trim();
    var Address = req.sanitize('Address').escape().trim();

    var Description = req.sanitize('Description')? req.sanitize('Description').escape().trim():'';
    var Email = req.sanitize('Email').escape().trim();
    var Phone = req.sanitize('Phone').escape().trim();
    var OtherContact = req.sanitize('OtherContact').escape().trim();

    var DB = require('../../../utility/db.js');
    var post = {
        Status: 0,
        PropertyType: PropertyType,
        Address: Address,
        IsEstablished: 1,
        Source: Source,
        Description: Description
    };
    DB.query('Update Sales.Property SET ? where Id =' + PropertyId, post, function (err, result) {
        if (err) {console.log(err);return res.send('Server Error');}
        var specPost = {
            PropertyId:PropertyId,
            NumOfRoom:NumOfRoom,
            NumOfBath: NumOfBath,
            NumOfPark:NumOfPark
        };
        DB.query('Update Sales.PropertySpec SET ? where PropertyId=' + PropertyId, specPost, function (err, result){
            if (err) {console.log(err);return res.send('Server Error');}

            var S3 = require("../../../utility/S3.js");
            var bucketName = 'propertypicsstore';
            var PicPath = '';
            var MainPicPath = '';
            var PicPath2 = '';
            var PicPath3 = '';
            var PicPath4 = '';
            var PicPath5 = '';
            if(req.files) {
                for(var key in req.files) {
                    console.log('pic added:' + key);
                    var keyName = new Date().getTime() + '_' + key;
                    PicPath = '/' + bucketName + '/' + keyName;
                    if(key == 'MainPicPath') MainPicPath = PicPath;
                    if(key == 'PicPath2') PicPath2 = PicPath;
                    if(key == 'PicPath3') PicPath3 = PicPath;
                    if(key == 'PicPath4') PicPath4 = PicPath;
                    if(key == 'PicPath5') PicPath5 = PicPath;

                    var params = {Bucket: bucketName, Key: keyName, Body:req.files[key].data, ACL:'public-read'};
                    S3.putObject(params, function(err, data) {
                        if (err)
                            console.log(err);
                        else
                            console.log("Successfully uploaded data to" + keyName);
                    });
                }
            }

            var mainPost = {
                PropertyId:PropertyId,
                PurchaseType: PurchaseType,
                LowPrice: LowPrice,
                HighPrice: HighPrice,
                Email: Email,
                Phone: Phone,
                OtherContact: OtherContact
            };
            if(MainPicPath) mainPost.MainPicPath = MainPicPath;
            if(PicPath2) mainPost.PicPath2 = PicPath2;
            if(PicPath3) mainPost.PicPath3 = PicPath3;
            if(PicPath4) mainPost.PicPath4 = PicPath4;
            if(PicPath5) mainPost.PicPath5 = PicPath5;

            DB.query('Update Sales.PropertySalePost SET ? where PropertyId = ' + PropertyId, mainPost, function (err, result){
                if (err) {console.log(err);return res.send('Server Error');}
                var items = Address.split(',');
                if(items.length >= 3){
                    var SuburbService = require('../../../Biz-Service/SuburbService');
                    SuburbService.getSuburbByName(items[1].trim(), items[2].trim(),function (err, result) {
                        if (err || result.length == 0) {
                            console.log(err);
                            return res.redirect('/user/' + Id + '/userEstablishedHomeList');
                        }
                        var suburbId = result[0].Id;
                        DB.query('Update Sales.Property SET ? where ID = ' + PropertyId, {SuburbId:suburbId}, function (err, result){
                            console.log(err);
                            return res.redirect('/user/' + Id + '/userEstablishedHomeList');
                        });
                    })
                } else {
                    return res.redirect('/user/' + Id + '/userEstablishedHomeList');
                }

            });
        });


    });

});

module.exports = router;
