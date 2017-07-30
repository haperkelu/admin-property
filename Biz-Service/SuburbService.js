/**
 * Created by LocalUser on 20/07/2017.
 */
var SuburbService = {

    getAllSuburbs: function(callback) {
        var DB = require('../utility/db.js');
        DB.query("SELECT Id,name,code,state FROM Sales.Suburbs", function (err, result) {
            if (err) {console.log(err); callback(err, result); return;}
            if(!result) {
                callback(err, []);
            } else {
                callback(err, JSON.parse(JSON.stringify(result)));
            }
        });
    },

    getAllState: function() {
        return [{Name:'NSW'},{Name: 'VIC'}, {Name: 'QLD'}];
    },

    getAllSuburbsByState: function(state) {
        var dbcon = require('../utility/db');
        dbcon.query("SELECT name,code FROM Sales.Suburbs where ?",{State: state}, function (err, result) {
            if (err) {
                console.log(err); dbcon.end();return;
            }
            return result;
        });
    }
}
module.exports = SuburbService;