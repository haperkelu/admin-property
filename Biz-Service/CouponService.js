/**
 * Created by LocalUser on 20/07/2017.
 */
var CouponService = {

    applyCoupon: function (userId, orderId, couponId, callback) {
        var DB = require('../utility/db.js');
        var sql = 'update Sales.Order set ? where Id = ' + orderId;
        DB.query(sql,{CouponId: couponId}, function (err, result) {
            if (err) {console.log(err); callback(err, result); return;}
            if(!result) {
                callback(err, []);
            } else {
                callback(err, JSON.parse(JSON.stringify(result)));
            }
        });
    }
}
module.exports = CouponService;