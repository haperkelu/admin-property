/**
 * Created by LocalUser on 20/07/2017.
 */
var UserService = {

    getBasicInfo: function (userId, callback) {
        var DB = require('../utility/db.js');
        var sql = 'SELECT ID, Email,FirstName, LastName,DateOfBirth,Gender,Phone,Nationality,Address,IdentityStatus,ReferralCode,SelfReferenceCode FROM Sales.BasicUser where Id = ' + userId;
        DB.query(sql,null, function (err, result) {
            if (err) {console.log(err); callback(err, result); return;}
            if(!result) {
                callback(err, []);
            } else {
                callback(err, JSON.parse(JSON.stringify(result)));
            }
        });
    },
    getCouponList:function (userId, callback) {
        var DB = require('../utility/db.js');
        var sql = 'SELECT co.ID, co.CustomerId, co.DateOfAcquisition, co.DateOfExpiration, co.Name, co.`Status`, co.Description\n' +
            'FROM Sales.BasicUser b \n' +
            'join Sales.CustomerRedemptionCode co on b.ID = co.CustomerId\n' +
            'where b.id = ' + userId;
        DB.query(sql,null, function (err, result) {
            if (err) {console.log(err); callback(err, result); return;}
            if(!result) {
                callback(err, []);
            } else {
                callback(err, JSON.parse(JSON.stringify(result)));
            }
        });
    },
    getNewHomeList: function (email, callback) {
        var DB = require('../utility/db.js');
        var sql = 'select o.Id, p.Name, p.Id as pId, o.OrderDate, o.Price,o.CouponId, os.SalesName, osl.SolicitorCompany from Sales.`Order` as o\n' +
            'join Sales.Property as p on o.PropertyId = p.ID \n' +
            'join Sales.OrderSales as os on o.ID = os.OrderId\n' +
            'join Sales.OrderCustomer as oc on o.ID = oc.OrderId\n' +
            'join Sales.OrderSolicitor as osl on o.ID = osl.OrderID where p.IsEstablished = 0 and p.Status = 1 and oc.CustomerEmail = "' + email + '"';
        DB.query(sql, null,function (err, result) {
            if (err) {console.log(err); callback(err, result); return;}
            if(!result) {
                callback(err, []);
            } else {
                callback(err, JSON.parse(JSON.stringify(result)));
            }
        });
    },
    getNewHomeDetail: function (Id, callback) {
        var DB = require('../utility/db.js');
        var sql = 'select o.Id, p.Name, p.Id as pId,o.PropertyType, o.OrderDate,o.UnitNumber,o.LotNumber,o.Price,o.CouponId, os.SalesName,os.SalesEmail, os.SalesMobile, ' +
            'osl.SolicitorCompany, osl.SolicitorName, osl.SolicitorPhone, osl.SolicitorEmail, osl.SolicitorAddress,' +
            'oc.CustomerName, oc.CustomerPhone, oc.CustomerEmail,CustomerAddress from Sales.`Order` as o\n' +
            'join Sales.Property as p on o.PropertyId = p.ID \n' +
            'join Sales.OrderSales as os on o.ID = os.OrderId\n' +
            'join Sales.OrderCustomer as oc on o.ID = oc.OrderId\n' +
            'join Sales.OrderSolicitor as osl on o.ID = osl.OrderID where o.Id = ' + Id;
        DB.query(sql, null,function (err, result) {
            if (err) {console.log(err); callback(err, result); return;}
            if(!result) {
                callback(err, []);
            } else {
                callback(err, JSON.parse(JSON.stringify(result)));
            }
        });
    },
    getEstablishedHomeList: function (userId, callback) {
        var DB = require('../utility/db.js');
        var sql = 'select * from Sales.Property as p\n' +
            'inner join Sales.PropertySalePost as sp on p.ID = sp.PropertyId\n' +
            'inner join Sales.PropertySpec as ps on p.ID = ps.PropertyId ' +
        'where sp.CustomerId = ' + userId;
        DB.query(sql, null,function (err, result) {
            if (err) {console.log(err); callback(err, result); return;}
            if(!result) {
                callback(err, []);
            } else {
                callback(err, JSON.parse(JSON.stringify(result)));
            }
        });
    },
    getRentList: function (userId, callback) {
        var DB = require('../utility/db.js');
        var sql = 'select * from Sales.Property as p\n' +
            'inner join Sales.PropertyRentPost as sp on p.ID = sp.PropertyId\n' +
            'inner join Sales.PropertySpec as ps on p.ID = ps.PropertyId ' +
            'where sp.CustomerId = ' + userId;
        DB.query(sql, null,function (err, result) {
            if (err) {console.log(err); callback(err, result); return;}
            if(!result) {
                callback(err, []);
            } else {
                callback(err, JSON.parse(JSON.stringify(result)));
            }
        });
    }
}
module.exports = UserService;