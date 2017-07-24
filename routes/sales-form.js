var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('Sales/SalesCreate', { title: '销售注册' });
});

module.exports = router;
