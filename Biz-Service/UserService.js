/**
 * Created by LocalUser on 20/07/2017.
 */
var UserService = {

    getBasicInfo: function (userId, callback) {
        var DB = require('../utility/db.js');
        var sql = 'SELECT Email,FirstName, LastName,DateOfBirth,Gender,Phone,Nationality,Address,IdentityStatus,ReferralCode FROM Sales.BasicUser b left join Sales.Customer c on b.ID = c.BasicUserId where b.id = ' + userId;
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
module.exports = UserService;