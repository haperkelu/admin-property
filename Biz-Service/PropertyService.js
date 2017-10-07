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
    },
    getOffplanList: function(callback) {
        var DB = require('../utility/db.js');
        var sql = 'select * from Sales.Property as p\n' +
            'join Sales.PropertyOffplanExt poe on p.ID = poe.PropertyId\n' +
            'where p.Status = 1';
        DB.query(sql, function (err, result) {
            if (err) {console.log(err); callback(err, result); return;}
            if(!result) {
                callback(err, []);
            } else {
                callback(err, JSON.parse(JSON.stringify(result)));
            }
        });
    },
    getOffplanDetail: function (Id, callback) {
        var DB = require('../utility/db.js');
        var sql = 'select * from Sales.Property as p\n' +
            'join Sales.PropertyOffplanExt poe on p.ID = poe.PropertyId\n' +
            'where p.Id = ' + Id;
        DB.query(sql, function (err, result) {
            if (err) {console.log(err); callback(err, result); return;}
            if(!result) {
                callback(err, []);
            } else {
                callback(err, JSON.parse(JSON.stringify(result)));
            }
        });
    },
    getRentList: function(callback) {
        var DB = require('../utility/db.js');
        var sql = 'select * from Sales.Property as p\n' +
            'join Sales.PropertyRentPost as sp on p.ID = sp.PropertyId\n' +
            'join Sales.PropertySpec as ps on p.ID = ps.PropertyId where p.Status = 1'
        DB.query(sql, function (err, result) {
            if (err) {console.log(err); callback(err, result); return;}
            if(!result) {
                callback(err, []);
            } else {
                callback(err, JSON.parse(JSON.stringify(result)));
            }
        });
    },
    getRentDetail: function (Id, callback) {
        var DB = require('../utility/db.js');
        var sql = 'select * from Sales.Property as p\n' +
            'join Sales.PropertyRentPost as sp on p.ID = sp.PropertyId\n' +
            'join Sales.PropertySpec as ps on p.ID = ps.PropertyId ' +
            'where p.Id = ' + Id;
        DB.query(sql, function (err, result) {
            if (err) {console.log(err); callback(err, result); return;}
            if(!result) {
                callback(err, []);
            } else {
                callback(err, JSON.parse(JSON.stringify(result)));
            }
        });
    },
    getSalesDetail: function (Id, callback) {
        var DB = require('../utility/db.js');
        var sql = 'select * from Sales.Property as p\n' +
            'join Sales.PropertySalePost as sp on p.ID = sp.PropertyId\n' +
            'join Sales.PropertySpec as ps on p.ID = ps.PropertyId ' +
            'where p.Id = ' + Id;
        DB.query(sql, function (err, result) {
            if (err) {console.log(err); callback(err, result); return;}
            if(!result) {
                callback(err, []);
            } else {
                callback(err, JSON.parse(JSON.stringify(result)));
            }
        });
    },
    getEstablishedHomeList: function (callback) {
        var DB = require('../utility/db.js');
        var sql = 'select * from Sales.Property as p\n' +
            'join Sales.PropertySalePost as sp on p.ID = sp.PropertyId\n' +
            'join Sales.PropertySpec as ps on p.ID = ps.PropertyId ' +
            'where p.Status = 1';
        DB.query(sql, function (err, result) {
            if (err) {console.log(err); callback(err, result); return;}
            if(!result) {
                callback(err, []);
            } else {
                callback(err, JSON.parse(JSON.stringify(result)));
            }
        });
    },
    getOffplanListWithAllStatus: function(callback) {
        var DB = require('../utility/db.js');
        var sql = 'select * from Sales.Property as p\n' +
            'join Sales.PropertyOffplanExt poe on p.ID = poe.PropertyId';
            //'left join Sales.Suburbs as s on p.SuburbCode = s.PropertyId ';
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