/**
 * Created by LocalUser on 20/07/2017.
 */
var mysql = require('mysql');
var fs = require('fs');
var cfg = JSON.parse(fs.readFileSync('./config/DB-Mysql.json', 'utf8'));
var pool = mysql.createPool(cfg);

var DB = (function () {

    function _query(query, params, callback) {
        pool.getConnection(function (err, connection) {
            if (err) {
                connection.release();
                callback(null, err);
                throw err;
            }

            connection.query(query, params, function (err, rows) {
                connection.release();
                if (!err) {
                    callback(err, rows);
                }
                else {
                    callback(null, err);
                }

            });

            connection.on('error', function (err) {
                connection.release();
                callback(null, err);
                throw err;
            });
        });
    };

    return {
        query: _query
    };
})();


module.exports = DB;
