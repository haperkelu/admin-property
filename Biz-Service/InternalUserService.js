/**
 * Created by LocalUser on 20/07/2017.
 */
var InternalUserService = {

    getAllUsers: function (callback) {
        var DB = require('../utility/db.js');
        var sql = 'select * from BasicUser';
        DB.query(sql, null, function (err, result) {
            if (err) {console.log(err); callback(err, result); return;}
            if(!result) {
                callback(err, []);
            } else {
                callback(err, JSON.parse(JSON.stringify(result)));
            }
        });
    },
    getSingleUser: function (Id, callback) {
        var DB = require('../utility/db.js');
        var sql = 'select * from BasicUser where ID=' + Id;
        DB.query(sql, null, function (err, result) {
            if (err) {console.log(err); callback(err, result); return;}
            if(!result) {
                callback(err, []);
            } else {
                callback(err, JSON.parse(JSON.stringify(result)));
            }
        });
    },
    getSingleSalesUser: function (Id, callback) {
        var DB = require('../utility/db.js');
        var sql = 'select * from BasicUser as b\n' +
            'join SalesBankDetail as sbd on b.ID = sbd.SalesId\n' +
            'join Sales as s on b.ID = s.BasicUserId where b.ID=' + Id;
        DB.query(sql, null, function (err, result) {
            if (err) {console.log(err); callback(err, result); return;}
            if(!result) {
                callback(err, []);
            } else {
                callback(err, JSON.parse(JSON.stringify(result)));
            }
        });
    }


}
module.exports = InternalUserService;