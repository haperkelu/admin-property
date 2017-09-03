/**
 * Created by LocalUser on 20/07/2017.
 */
var PropertyService = {

    getHotOffplanList: function(callback) {
        var DB = require('../utility/db.js');
        var sql = 'select * from Sales.Property as p\n' +
            'join Sales.PropertyOffplanExt poe on p.ID = poe.PropertyId\n' +
            'where poe.IsHot = 1 and p.Status = 1';
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
module.exports = PropertyService;