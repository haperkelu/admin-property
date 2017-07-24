var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {

  res.render('Sales/SalesDetail', { title: '销售详情' });
});

module.exports = router;
