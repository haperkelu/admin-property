/**
 * Created by LocalUser on 20/07/2017.
 */
var mysql = require('mysql');
var fs = require('fs');
var cfg = JSON.parse(fs.readFileSync('./config/DB-Mysql.json', 'utf8'));
var dbcon = mysql.createConnection(cfg);

dbcon.connect(function(err) {
    if (err) console.log(err);
});

module.exports = dbcon;
