/**
 * Created by LocalUser on 20/07/2017.
 */
var QueryService = {

    addQuery: function (propertyId, name, phone, email, detail, callback) {
        var DB = require('../utility/db.js');
        var post = {PropertyId: propertyId, CustomerName:name, Email:email, Phone: phone, Content:detail};
        console.log(post);
        DB.query('Insert Sales.PropertyInqury Set ?',post, function (err, result) {
            if (err) {console.log(err); callback(err, result); return;}
            if(!result) {
                callback(err, []);
            } else {
                callback(err, JSON.parse(JSON.stringify(result)));
            }
        });
    },
    getInqueryList: function (callback) {
        var DB = require('../utility/db.js');
        DB.query('select * from Sales.PropertyInqury as pi ' +
            'join Sales.Property as p on pi.PropertyId = p.ID',null, function (err, result) {
            if (err) {console.log(err); callback(err, result); return;}
            if(!result) {
                callback(err, []);
            } else {
                callback(err, JSON.parse(JSON.stringify(result)));
            }
        });
    }
}
module.exports = QueryService;