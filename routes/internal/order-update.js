var express = require('express');
var router = express.Router({mergeParams: true});

router.post('/', function(req, res, next){

    if(!req.session.user || (req.session.user.UserType != 2 && req.session.user.UserType != 0 && req.session.user.UserType != 4))
        return res.redirect('/login');

    var OrderStatus = req.sanitize('OrderStatus').escape().trim();
    var OrderOldStatus = req.sanitize('OrderStatus').escape().trim();

    if((parseInt(OrderOldStatus) >= 2) && req.session.user.UserType == 2) {
        return res.send('订单已出合同，不可修改');
    }


    var OrderId = decodeURIComponent(req.sanitize('OrderId').trim());

    var DB = require('../../utility/db.js');
    var S3 = require("../../utility/S3.js");
    var bucketName = 'propertyordr';
    var ContractHomePage = '';
    if(req.session.user.UserType == 2 && parseInt(OrderStatus) == 1) {
        if(req.files) {
            for(var key in req.files) {
                var keyName = new Date().getTime() + '_' + key;
                if(key == 'ContractHomePage'){
                    ContractHomePage = '/' + bucketName + '/' + keyName;
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
        if(ContractHomePage) {
            DB.query('UPDATE Sales.OrderSales SET ? where OrderId=' + OrderId, {ContractHomePage: ContractHomePage}, function (err, result){
                if (err) {console.log(err);return res.send('Server Error');}
                DB.query('Update Sales.Order SET ? where Id=' + OrderId, {OrderStatus: 2}, function (err, result) {
                    if (err) {console.log(err);return res.send('Server Error');}
                    return res.redirect('/internal/ordder/list');
                });
            });
        } else {
            return res.send('订单已出合同，不可修改');
        }
    } else {

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
                if(key == 'ContractHomePage'){
                    ContractHomePage = '/' + bucketName + '/' + keyName;
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
            PropertyId: PropertyId,
            OrderStatus: OrderStatus,
            UnitNumber: UnitNumber,
            BuildingPrice: BuildingPrice,
            LotNumber: LotNumber,
            LandPrice: LandPrice
        };
        if(ContractHomePage) post.OrderStatus = 2;

        DB.query('Update Sales.Order SET ? where Id=' + OrderId, post, function (err, result) {
            if (err) {console.log(err);return res.send('Server Error');}

            var post = {
                OrderId: OrderId,
                CustomerName: CustomerName,
                CustomerPhone: CustomerPhone,
                CustomerEmail: CustomerEmail,
                CustomerAddress: CustomerAddress,
                InvestmentOption: req.sanitize('InvestmentOption').escape().trim(),
                ClientSituation: req.sanitize('ClientSituation').escape().trim()
            };
            if(CustomerIDPath) post.CustomerIDPath = CustomerIDPath;

            DB.query('UPDATE Sales.OrderCustomer SET ? where OrderId=' + OrderId, post, function (err, result){
                if (err) {console.log(err);return res.send('Server Error');}
                var post = {
                    SolicitorCompany: req.sanitize('SolicitorCompany').escape().trim(),
                    SolicitorName: req.sanitize('SolicitorName').escape().trim(),
                    SolicitorPhone: req.sanitize('SolicitorPhone').escape().trim(),
                    SolicitorEmail: req.sanitize('SolicitorEmail').escape().trim(),
                    SolicitorAddress: req.sanitize('SolicitorAddress').escape().trim()
                };

                DB.query('UPDATE Sales.OrderSolicitor SET ? where OrderId =' + OrderId, post, function (err, result){
                    if (err) {console.log(err);return res.send('Server Error');}
                    var post = {
                        SalesName: req.sanitize('SalesName').escape().trim(),
                        SalesMobile: req.sanitize('SalesMobile').escape().trim(),
                        SalesEmail: req.sanitize('SalesEmail').escape().trim(),
                        SalesMemo: req.sanitize('SalesMemo')? req.sanitize('SalesMemo').escape(): ''
                    };
                    if(DepositPath) post.DepositPath = DepositPath;
                    if(ContractHomePage) post.ContractHomePage = ContractHomePage;
                    //console.log(DepositPath);
                    DB.query('UPDATE Sales.OrderSales SET ? where OrderId=' + OrderId, post, function (err, result){
                        if (err) {console.log(err);return res.send('Server Error');}
                        return res.redirect('/internal/ordder/list');
                    });

                });

            });
        });
    }

});

module.exports = router;
