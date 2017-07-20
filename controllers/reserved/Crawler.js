/**
 * Created by LocalUser on 19/07/2017.
 */
//https://postcodez.com.au/postcodes/nsw/sydney
var mysql = require('mysql');
var http = require('http');

//The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
var options = {
    host: 'gomashup.com',
    path: '/json.php?fds=geo/australia/postcode/state/QLD&jsoncallback=?'
};

var dbcon = mysql.createConnection({
    host: "intelligent-property.cxk9lteizpqj.ap-southeast-2.rds.amazonaws.com",
    user: "admin",
    password: "Haper2020"
});

callback = function(response) {
    var str = '';

    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
        str += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    response.on('end', function () {
        var subStr = str.substring(2, str.length - 1);

        var result = JSON.parse(subStr);

        dbcon.connect(function(err) {
            if (err) throw err;

            for(var k in result.result) {
                if (result.result[k].Category == 'Delivery Area') {
                    var name = result.result[k].Locality;
                    var code = parseInt(result.result[k].Pcode);
                    var state = 'QLD';
                    var city = 3;
                    if ((code >= 4000 && code <= 4207)
                     ||  (code >= 4300 && code <= 4305)
                    || (code >= 4500 && code <= 4519)) {
                        var sql = 'INSERT INTO Sales.Suburbs(name, code, state, city) VALUES'
                            + '("' + name + '",'
                            + '"' + code + '",'
                            + '"' + state + '",'
                            + city + ')';
                        dbcon.query(sql, function (err, result) {
                            if (err) throw err;
                            console.log("1 record inserted");
                        });
                    }
                }
            }
        });


    });
}

http.request(options, callback).end();

