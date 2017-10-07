exports.property_submit = function(req, res, next) {
    var Address = req.sanitize('Address').escape().trim();
    //console.log(req.sanitize('SuburbCode'));
    var State = req.sanitize('State').escape().trim();
    var SuburbCode = req.sanitize('SuburbCode').escape().trim();
    var cityId = 0;
    if(State == 'NSW') {cityId = 1;}
    if(State == 'VIC') {cityId = 2;}
    if(State == 'QLD') {cityId = 3;}
    var District = req.sanitize('District').escape().trim();
    var name = req.sanitize('Name').escape().trim();
    var propertyType = decodeURIComponent(req.sanitize('PropertyType').trim());
    var isHot = req.sanitize('IsHot').escape().trim();
    var Description = req.sanitize('Description').escape().trim();
    var DeveloperAuthDate = decodeURIComponent(req.sanitize('AuthBegindate').trim() + ' ' + req.sanitize('AuthEnddate').trim());
    console.log(DeveloperAuthDate);
    var commissionRate = req.sanitize('CommissionRate').escape().trim();
    var memo = req.sanitize('Memo').escape().trim();
    var DetailLink = req.sanitize('DetailLink').escape().trim();

    var S3 = require("../utility/S3.js");
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
    var DB = require('../utility/db.js');
    var post = {
        Name: name,
        Status: 0,
        IsEstablished: 0,
        Address: Address,
        District: District,
        SuburbCode:SuburbCode,
        CityId:cityId,
        PropertyType: propertyType,
        PicPath: PicPath,
        Description: Description
    };
    DB.query('INSERT INTO Sales.Property SET ?', post, function (err, result) {
        if (err) {console.log(err);return res.send('Server Error');}
        var propertyId  = result.insertId;
        var post = {propertyId: propertyId,
        isHot:(isHot == '1' ? 1:0), DeveloperAuthDate: DeveloperAuthDate,DeveloperAuthContractPath:DeveloperAuthContractPath,commissionRate:commissionRate, memo:memo, DetailLink:DetailLink};

        DB.query('INSERT INTO Sales.PropertyOffplanExt SET ?', post, function (err, result){
            if (err) {console.log(err);return res.send('Server Error');}
            return res.redirect('/internal/offplanProperty/list');
        });
    });

}