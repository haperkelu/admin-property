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
    },

    getAllSuburbsByCity: function(city, callback) {
        var dbcon = require('../utility/db');
        city = city.toLowerCase();
        var cityNum = '';
        if(city == 'sydney') cityNum = 1;
        if(city == 'melbourne') cityNum = 2;
        if(city == 'brisbane') cityNum = 3;
        dbcon.query("SELECT Id,name,code FROM Sales.Suburbs where ?",{City: cityNum}, function (err, result) {
            if (err) {console.log(err); callback(err, result); return;}
            if(!result) {
                callback(err, []);
            } else {
                callback(err, JSON.parse(JSON.stringify(result)));
            }
        });
    },
    getSuburbByName: function (name, state, callback) {
        var DB = require('../utility/db');
        var abbreviation = '';
        if(state.indexOf('New South Wales') != -1) abbreviation = 'NSW';
        if(state.indexOf('Victoria') != -1) abbreviation = 'VIC';
        if(state.indexOf('Queensland') != -1) abbreviation = 'QLD';
        var sqlStr = "SELECT Id,name,code FROM Sales.Suburbs where Name = " + "'" + name + "' and State = '" + abbreviation + "'";
        DB.query(sqlStr, null, function (err, result) {
            if (err) {console.log(err); callback(err, result); return;}
            if(!result) {
                callback(err, []);
            } else {
                callback(err, JSON.parse(JSON.stringify(result)));
            }
        });
    }
}
module.exports = SuburbService;