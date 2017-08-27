exports.user_login_submit = function(req, res, next) {

    var username = req.sanitize('username').escape().trim();
    var password = req.sanitize('password').escape().trim();

    if(!username || !password) return res.render('error/500');

    var Encryption = require('../../utility/Encryption');
    var DB = require('../../utility/db.js');
    DB.query('Select ID, Email, Password from Sales.BasicUser where type = 1 and status = 1 and ?', {Email: username}, function (err, result) {

        if (err) {console.log(err);return res.render('error/500');}

        var usersSelected = JSON.parse(JSON.stringify(result));
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

exports.apply_coupon_submit = function (req, res, next) {
    if(req.session.user == undefined)
        return res.redirect('/login');
    var homeId = req.params.homeId;
    console.log(homeId);
    if(homeId == undefined) return res.send('Server Error');
    var CouponService = require('../../Biz-Service/CouponService');
    var couponSelected = req.sanitize('couponList').escape().trim();
    console.log(couponSelected);
    CouponService.applyCoupon(req.session.user.Id, homeId, couponSelected, function (err, result) {
        if (err) {console.log(err);return res.send('Server Error');}
        return res.redirect('/user/' + req.session.user.Id + '/userNewHomeDetail/' + homeId);
    });

}

exports.user_detail_establishhome_submit = function(req, res, next) {

    var Id = req.params.id;
    var PropertyType = req.sanitize('PropertyType').escape().trim();
    var NumOfRoom = req.sanitize('NumOfRoom').escape().trim();
    var NumOfBath = req.sanitize('NumOfBath').escape().trim();
    var NumOfPark = req.sanitize('NumOfPark').escape().trim();
    var PurchaseType = req.sanitize('PurchaseType').escape().trim();
    var Source = req.sanitize('Source').escape().trim();
    var Address = req.sanitize('Address').escape().trim();
    var Title = req.sanitize('Title').escape().trim();

    var Subtitle = req.sanitize('Subtitle')? req.sanitize('Subtitle').escape().trim():'';
    var Description = req.sanitize('Description')? req.sanitize('Subtitle').escape().trim():'';
    var Email = req.sanitize('Email').escape().trim();
    var Phone = req.sanitize('Phone').escape().trim();
    var OtherContact = req.sanitize('OtherContact').escape().trim();

    var DB = require('../../utility/db.js');
    var post = {
        Name: 'Customer upload established property',
        Status: 0,
        PropertyType: PropertyType,
        Address: Address,
        IsEstablished: 1,
        Source: Source
    };
    DB.query('INSERT INTO Sales.Property SET ?', post, function (err, result) {
        if (err) {console.log(err);return res.send('Server Error');}
        var propertyId  = result.insertId;
        var specPost = {
            PropertyId:propertyId,
            NumOfRoom:NumOfRoom,
            NumOfBath: NumOfBath,
            NumOfPark:NumOfPark
        };
        DB.query('INSERT INTO Sales.PropertySpec SET ?', specPost, function (err, result){
            if (err) {console.log(err);return res.send('Server Error');}

            var S3 = require("../../utility/S3.js");
            var bucketName = 'propertypicsstore';
            var PicPath = '';
            var count = 1;
            var MainPicPath = '';
            var PicPath2 = '';
            var PicPath3 = '';
            var PicPath4 = '';
            if(req.files) {
                for(var key in req.files) {
                    var keyName = new Date().getTime() + '_' + key;
                    PicPath = '/' + bucketName + '/' + keyName;
                    if(count++ == 1) MainPicPath = PicPath;
                    if(count++ == 2) PicPath2 = PicPath;
                    if(count++ == 3) PicPath3 = PicPath;
                    if(count++ == 4) PicPath4 = PicPath;
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
                PropertyId:propertyId,
                CustomerId: Id,
                PurchaseType: PurchaseType,
                MainPicPath:MainPicPath,
                PicPath2: PicPath2,
                PicPath3: PicPath3,
                PicPath4:PicPath4,
                Title: Title,
                Subtitle: Subtitle,
                Description: Description,
                Email: Email,
                Phone: Phone,
                OtherContact: OtherContact,
                PropertySalePostCreatedByDate: new Date(),
                PropertySalePostUpdatedByDate: new Date()
            };
            DB.query('INSERT INTO Sales.PropertySalePost SET ?', mainPost, function (err, result){
                if (err) {console.log(err);return res.send('Server Error');}
                var items = Address.split(',');
                if(items.length >= 3){
                    var SuburbService = require('../../Biz-Service/SuburbService');
                    SuburbService.getSuburbByName(items[1].trim(), items[2].trim(),function (err, result) {
                        if (err || result.length == 0) {
                            console.log(err);
                            return res.redirect('/user/' + Id + '/userEstablishedHomeList');
                        }
                        var suburbId = result[0].Id;
                        DB.query('Update Sales.Property SET ? where ID = ' + propertyId, {SuburbId:suburbId}, function (err, result){
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
}

exports.user_detail_rent_submit = function(req, res, next) {

    var Id = req.params.id;
    var PropertyType = req.sanitize('PropertyType').escape().trim();
    var RentType = req.sanitize('RentType').escape().trim();
    var NumOfRoom = req.sanitize('NumOfRoom').escape().trim();
    var NumOfBath = req.sanitize('NumOfBath').escape().trim();
    var NumOfPark = req.sanitize('NumOfPark').escape().trim();

    var Source = req.sanitize('Source').escape().trim();
    var Address = req.sanitize('Address').escape().trim();
    var Title = req.sanitize('Title').escape().trim();
    var SubTitle = req.sanitize('SubTitle')? req.sanitize('SubTitle').escape().trim():'';

    var Description = req.sanitize('Description')? req.sanitize('Description').escape().trim():'';
    var Email = req.sanitize('Email').escape().trim();
    var Phone = req.sanitize('Phone').escape().trim();
    var OtherContact = req.sanitize('OtherContact').escape().trim();
    console.log(Description);
    console.log(Email);
    console.log(Phone);
    var DB = require('../../utility/db.js');
    var post = {
        Name: 'Customer upload rent property',
        Status: 0,
        PropertyType: PropertyType,
        Address: Address,
        IsEstablished: 1,
        Source: Source
    };
    DB.query('INSERT INTO Sales.Property SET ?', post, function (err, result) {
        if (err) {console.log(err);return res.send('Server Error');}
        var propertyId  = result.insertId;
        var specPost = {
            PropertyId:propertyId,
            NumOfRoom:NumOfRoom,
            NumOfBath: NumOfBath,
            NumOfPark:NumOfPark
        };
        DB.query('INSERT INTO Sales.PropertySpec SET ?', specPost, function (err, result){
            if (err) {console.log(err);return res.send('Server Error');}
            var imagePath = saveAllImages(req);

            var mainPost = {
                PropertyId:propertyId,
                CustomerId: Id,
                RentType: RentType,
                MainPicPath: imagePath.MainPicPath,
                PicPath2: imagePath.PicPath2,
                PicPath3: imagePath.PicPath3,
                PicPath4: imagePath.PicPath4,
                Title: Title,
                SubTitle: SubTitle,
                Description: Description,
                Email: Email,
                Phone: Phone,
                OtherContact: OtherContact,
                PropertyRentPostCreatedByDate: new Date(),
                PropertyRentPostUpdatedByDate: new Date()
            };
            DB.query('INSERT INTO Sales.PropertyRentPost SET ?', mainPost, function (err, result){
                if (err) {console.log(err);return res.send('Server Error');}
                var items = Address.split(',');
                if(items.length >= 3){
                    var SuburbService = require('../../Biz-Service/SuburbService');
                    SuburbService.getSuburbByName(items[1].trim(), items[2].trim(),function (err, result) {
                        if (err || result.length == 0) {
                            console.log(err);
                            return res.redirect('/user/' + Id + '/rentlist');
                        }
                        var suburbId = result[0].Id;
                        DB.query('Update Sales.Property SET ? where ID = ' + propertyId, {SuburbId:suburbId}, function (err, result){
                            console.log(err);
                            return res.redirect('/user/' + Id + '/rentlist');
                        });
                    })
                } else {
                    return res.redirect('/user/' + Id + '/rentlist');
                }

            });
        });

    });
}

var saveAllImages = function (req) {
    var S3 = require("../../utility/S3.js");
    var bucketName = 'propertypicsstore';
    var PicPath = '';
    var count = 1;
    var MainPicPath = '';
    var PicPath2 = '';
    var PicPath3 = '';
    var PicPath4 = '';
    if(req.files) {
        for(var key in req.files) {
            var keyName = new Date().getTime() + '_' + key;
            PicPath = '/' + bucketName + '/' + keyName;
            if(key == 'img1') MainPicPath = PicPath;
            if(key == 'img2') PicPath2 = PicPath;
            if(key == 'img3') PicPath3 = PicPath;
            if(key == 'img4') PicPath4 = PicPath;
            var params = {Bucket: bucketName, Key: keyName, Body:req.files[key].data, ACL:'public-read'};
            S3.putObject(params, function(err, data) {
                if (err)
                    console.log(err);
                else
                    console.log("Successfully uploaded data to" + keyName);
            });
        }
    }
    return {
        MainPicPath:MainPicPath,
        PicPath2: PicPath2,
        PicPath3: PicPath3,
        PicPath4:PicPath4
    }
}