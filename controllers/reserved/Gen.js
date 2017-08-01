/**
 * Created by LocalUser on 19/07/2017.
 */
//https://postcodez.com.au/postcodes/nsw/sydney
var mysql = require('mysql');
var util = require('util');
var fs = require("fs");

var dbcon = mysql.createConnection({
    host: "intelligent-property.cxk9lteizpqj.ap-southeast-2.rds.amazonaws.com",
    user: "admin",
    password: "Haper2020"
});
var post = {

};
var queryStr = 'SELECT * FROM information_schema.columns ' +
    "WHERE Table_SCHEMA = 'Sales' and Table_Name in('Order','OrderCustomer')";
//'SHOW COLUMNS FROM Sales.Order'
dbcon.query(queryStr, function (err, result, fields) {

    console.log(result);
    var model = JSON.parse(JSON.stringify(result));
    var finalContent = '';
    for(var i in model){
        finalContent += controllerTemplateGen(model[i].COLUMN_NAME);
        finalContent += '\n';
    }
    console.log(finalContent);
    controllerOutPrinter(finalContent);
    dbcon.end();
});

var controllerTemplateGen = function (value) {
    var template = "var %s = req.sanitize('%s').escape().trim();"
    return util.format(template, value, value);
}

var controllerOutPrinter = function (content) {

    var filepath = new Date().getTime() + ".controller.txt";
    fs.writeFileSync(filepath, content);

}
