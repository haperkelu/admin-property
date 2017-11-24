var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next){

    if(!req.session.user || (req.session.user.UserType != 2 && req.session.user.UserType != 0))
        return res.redirect('/login');

    //var OrderDate = decodeURIComponent(req.sanitize('OrderDate').trim());
    //console.log(OrderDate);
    var PropertyId = req.sanitize('PropertyName').escape().trim();
    //var PropertyType = req.sanitize('PropertyType').escape().trim();s
    var UnitNumber = req.sanitize('UnitNumber').escape().trim();
    var BuildingPrice =  req.sanitize('BuildingPrice').escape().trim();
    var LandPrice = req.sanitize('LandPrice')? req.sanitize('LandPrice').escape().trim():'';
    var LotNumber = req.sanitize('LotNumber')? req.sanitize('LotNumber').escape().trim():'';;

    var CustomerName = req.sanitize('CustomerName').escape().trim();
    var CustomerPhone = req.sanitize('CustomerPhone').escape().trim();
    var CustomerEmail = req.sanitize('CustomerEmail').escape().trim();
    var CustomerAddress = req.sanitize('CustomerAddress').escape().trim();
    var CommissionRateTxt = req.sanitize('CommissionRateTxt').escape().trim();

    var DB = require('../../utility/db.js');
    var post = {
        PropertyId: PropertyId,
        OrderDate: new Date().toLocaleDateString('en-US') + ' ' + new Date().toLocaleTimeString('en-US', {hour12: false}),
        UnitNumber: UnitNumber,
        BuildingPrice: BuildingPrice,
        LotNumber: LotNumber,
        LandPrice: LandPrice,
        CommissionRate: CommissionRateTxt
    };
    DB.query('INSERT INTO Sales.Order SET ?', post, function (err, result) {
        if (err) {console.log(err);return res.send('Server Error');}
        var orderId  = result.insertId;

        var S3 = require("../../utility/S3.js");
        var bucketName = 'propertyordr';
        var CustomerIDPath = '';
        var DepositPath = '';
        if(req.files) {
            for(var key in req.files) {
                var keyName = new Date().getTime() + '_' + key;
                if(key == 'DepositPath') {
                    DepositPath = '/' + bucketName + '/' + keyName;
                }
                if(key == 'CustomerIDPath') {
                    CustomerIDPath = '/' + bucketName + '/' + keyName;
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
        var post = {
            OrderId: orderId,
            CustomerName: CustomerName,
            CustomerPhone: CustomerPhone,
            CustomerEmail: CustomerEmail,
            CustomerAddress: CustomerAddress,
            CustomerIDPath: CustomerIDPath,
            InvestmentOption: req.sanitize('InvestmentOption').escape().trim(),
            ClientSituation: req.sanitize('ClientSituation').escape().trim()
        };

        DB.query('INSERT INTO Sales.OrderCustomer SET ?', post, function (err, result){
            if (err) {console.log(err);return res.send('Server Error');}
            var post;
            if(req.sanitize('SolicitorCompany').escape()) {
                post = {
                    OrderId: orderId,
                    SolicitorCompany: req.sanitize('SolicitorCompany').escape().trim(),
                    SolicitorName: req.sanitize('SolicitorName').escape().trim(),
                    SolicitorPhone: req.sanitize('SolicitorPhone').escape().trim(),
                    SolicitorEmail: req.sanitize('SolicitorEmail').escape().trim(),
                    SolicitorAddress: req.sanitize('SolicitorAddress').escape().trim()
                };
            } else {
                var CompanyLaywers = req.sanitize('CompanyLaywers').escape().trim();
                console.log(CompanyLaywers);
                var fs = require('fs');
                var companyLayersArr = JSON.parse(fs.readFileSync('./config/Company_Lawyer.json', 'utf8'));
                var itemSelected = companyLayersArr.data[parseInt(CompanyLaywers.split(',')[0])];
                post = {
                    OrderId: orderId,
                    SolicitorCompany: itemSelected.companyName,
                    SolicitorName: itemSelected.lawyerName,
                    SolicitorPhone: itemSelected.phone,
                    SolicitorEmail: itemSelected.email,
                    SolicitorAddress: itemSelected.address,
                };
            }
            DB.query('INSERT INTO Sales.OrderSolicitor SET ?', post, function (err, result){
                if (err) {console.log(err);return res.send('Server Error');}
                var post = {
                    OrderId: orderId,
                    DepositPath: DepositPath,
                    SalesName: req.sanitize('SalesName').escape().trim(),
                    SalesMobile: req.sanitize('SalesMobile').escape().trim(),
                    SalesEmail: req.sanitize('SalesEmail').escape().trim(),
                    SalesMemo: req.sanitize('Memo')? req.sanitize('Memo').escape().trim(): ''
                };
                DB.query('Select * from Sales.Sales as s\n' +
                    'join Sales.BasicUser as bu on s.BasicUserId = bu.ID where ?', {Email: req.sanitize('SalesEmail').escape().trim()}, function (err, result){
                    if (err) {console.log(err);return res.send('Server Error');}
                    if(result[0]) {
                        post.SalesCommissionRate = result[0].SalesCommissionRate;
                        post.SalesSelfReferenceCode = result[0].SelfReferenceCode;
                    }
                    DB.query('INSERT INTO Sales.OrderSales SET ?', post, function (err, result){
                        if (err) {console.log(err);return res.send('Server Error');}
                        return res.redirect('/internal/ordder/list');
                    });
                });

            });

        });
    });

});

module.exports = router;
