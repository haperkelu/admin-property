/**
 * Created by LocalUser on 20/07/2017. ddd
 */
var mysql = require('mysql');
var fs = require('fs');
var cfg = JSON.parse(fs.readFileSync('./config/DB-Mysql.json', 'utf8'));
var pool = mysql.createPool(cfg);

var DB = (function () {

    function _query(query, params, callback) {
        pool.getConnection(function (err, connection) {
            if (err || connection.state === 'disconnected') {
                connection.release();
                callback(err, null);
                throw err;
            }
            //console.log(query);
            var currentQuery = connection.query(query, params, function (err, rows) {
                connection.release();
                callback(err, rows);
            });
            //console.log(currentQuery.sql);

            connection.on('error', function (err) {
                connection.release();
                callback(err, null);
                throw err;
            });
        });
    };

    return {
        query: _query
    };
})();


module.exports = DB;
