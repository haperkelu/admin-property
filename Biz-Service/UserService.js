/**
 * Created by LocalUser on 20/07/2017.
 */
var UserService = {

    getBasicInfo: function (userId, callback) {
        var DB = require('../utility/db.js');
        var sql = 'SELECT b.Id,Email,FirstName, LastName,DateOfBirth,Gender,Phone,Nationality,Address,IdentityStatus,ReferralCode FROM Sales.BasicUser b left join Sales.Customer c on b.ID = c.BasicUserId where b.id = ' + userId;
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
            'left join Sales.Customer c on b.ID = c.BasicUserId\n' +
            'left join Sales.CustomerRedemptionCode co on c.ID = co.CustomerId\n' +
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
        var sql = 'select o.Id, p.Name, p.Id as pId, o.OrderDate, o.Price, os.SalesName, osl.SolicitorCompany from Sales.`Order` as o\n' +
            'join Sales.Property as p on o.PropertyId = p.ID \n' +
            'join Sales.OrderSales as os on o.ID = os.OrderId\n' +
            'join Sales.OrderCustomer as oc on o.ID = oc.OrderId\n' +
            'join Sales.OrderSolicitor as osl on o.ID = osl.OrderID where oc.CustomerEmail = "' + email + '"';
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