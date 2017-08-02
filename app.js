var express = require('express');
var mysql = require('mysql');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var fileUpload = require('express-fileupload');

var index = require('./routes/index');
var userLogin = require('./routes/PublicSite/login');
var userLoginSubmit = require('./routes/PublicSite/login-submit');
var userDetail = require('./routes/PublicSite/user-detail');
var propertyForm = require('./routes/property-form');
var propertySubmit = require('./routes/property-create');

var salesCreateForm = require('./routes/sales-form');
var salesCreateSubmit = require('./routes/Sales-create');
var salesDetail = require('./routes/Sales-detail');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use("/public", express.static(__dirname + '/public'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(cookieParser());
app.use(session({resave: true, saveUninitialized: true, secret: '!@#$%67890'}));
app.use(fileUpload());

app.use('/', index);
app.use('/offplanProperty/create', propertyForm);
app.use('/login', userLogin);
app.use('/loginSubmit', userLoginSubmit);
app.use('/user/:id', userDetail);
app.use('/offplanProperty/submit', propertySubmit);
app.use('/sales/create', salesCreateForm);
app.use('/sales/submit', salesCreateSubmit);
app.use('/sales/detail/:id', salesDetail);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
if(process.env.NODE_ENV = 'development') {
  console.log('running in dev mode');
}else {
    process.on('uncaughtException', function (err) {
        console.error(err);
        console.log("Node NOT Exiting...");
    });
}
module.exports = app;
