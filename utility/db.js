/**
 * Created by LocalUser on 20/07/2017.
 */
var mysql = require('mysql');
var dbcon = mysql.createConnection({
    host: "intelligent-property.cxk9lteizpqj.ap-southeast-2.rds.amazonaws.com",
    user: "admin",
    password: "Haper2020"
});

dbcon.connect(function(err) {
    if (err) throw err;
});

module.exports = dbcon;
