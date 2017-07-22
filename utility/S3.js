/**
 * Created by LocalUser on 22/07/2017.
 */
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config/aws/credentials.json');

var S3 = new AWS.S3();
module.exports = S3;

/**
s3.createBucket({Bucket: bucketName}, function() {
    var params = {Bucket: bucketName, Key: keyName, Body: 'Hello World!'};
    s3.putObject(params, function(err, data) {
        if (err)
            console.log(err)
        else
            console.log("Successfully uploaded data to " + bucketName + "/" + keyName);
    });
});
 **/