/**
 * Created by LocalUser on 20/07/2017.
 */
var OrderService = {
    getAllOrders: function (callback) {
        var sql = 'select * from `Order` as o\n' +
            'inner join OrderCustomer as oc on o.ID = oc.OrderId \n' +
            'inner join OrderSales as os on o.ID = os.OrderId\n' +
            'inner join OrderSolicitor as ost on o.ID = ost.OrderID\n' +
            'inner join Property as p on o.PropertyId = p.Id\n' +
            'inner join PropertyOffplanExt as po on o.PropertyId = po.PropertyId'
        var DB = require('../utility/db.js');
        DB.query(sql, function (err, result) {
            if (err) {console.log(err); callback(err, result); return;}
            if(!result) {
                callback(err, []);
            } else {
                callback(err, JSON.parse(JSON.stringify(result)));
            }
        });
    },

    getOrderDetail: function (Id, callback) {
        var sql = 'select * from `Order` as o\n' +
            'inner join OrderCustomer as oc on o.ID = oc.OrderId \n' +
            'inner join OrderSales as os on o.ID = os.OrderId\n' +
            'inner join OrderSolicitor as ost on o.ID = ost.OrderID\n' +
            'inner join Property as p on o.PropertyId = p.Id\n' +
            'inner join PropertyOffplanExt as po on o.PropertyId = po.PropertyId\n' +
            'where o.Id = ' + Id;
        var DB = require('../utility/db.js');
        DB.query(sql, function (err, result) {
            if (err) {console.log(err); callback(err, result); return;}
            if(!result) {
                callback(err, []);
            } else {
                callback(err, JSON.parse(JSON.stringify(result)));
            }
        });
    }
}
module.exports = OrderService;