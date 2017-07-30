exports.property_submit = function(req, res, next) {
    var Address = req.sanitize('Address').escape().trim();
    var Suburb = req.sanitize('Suburb').escape().trim();
    var district = req.sanitize('district').escape().trim();
    var name = req.sanitize('name').escape().trim();
    var type = req.sanitize('type').escape().trim();
    var isHot = req.sanitize('isHot').escape().trim();
    var Description = req.sanitize('Description').escape().trim();
    var DeveloperAuthDate = req.sanitize('DeveloperAuthDate').escape().trim();
    console.log(Suburb);
    console.log(isHot);
    var commissionRate = req.sanitize('comissionRate').escape().trim();
    var memo = req.sanitize('memo').escape().trim();
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
                    console.log("Successfully uploaded data to salesprofiles" + "/" + keyName);
            });
        }
    }
    var DB = require('../utility/db.js');
    var post = {
        name: name,
        status: 0,
        IsEstablished: 0,
        Address: Address,
        SuburbId: Suburb,
        district: district,
        type: type,
        PicPath: PicPath,
        Description: Description
    };
    DB.query('INSERT INTO Sales.Property SET ?', post, function (err, result) {
        if (err) {console.log(err);return res.send('Server Error');}
        var propertyId  = result.insertId;
        var post = {propertyId: propertyId,
        isHot:(isHot ='On'?1:0), DeveloperAuthDate: DeveloperAuthDate,DeveloperAuthContractPath:DeveloperAuthContractPath,commissionRate:commissionRate, memo:memo, DetailLink:DetailLink};

        DB.query('INSERT INTO Sales.PropertyOffplanExt SET ?', post, function (err, result){
            if (err) {console.log(err);return res.send('Server Error');}
            return res.redirect('/offplanproperty/detail/' + propertyId);
        });
    });

    res.send('name is:' + req.body.name);

}