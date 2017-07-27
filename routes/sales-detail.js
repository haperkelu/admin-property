var express = require('express');
var sales_detail = require("../controllers/Sales-controller.js").sales_detail;
var router = express.Router({mergeParams: true});

router.get('/', sales_detail);

module.exports = router;
