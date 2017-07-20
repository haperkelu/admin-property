var express = require('express');
var sales_create_submit = require("../controllers/Sales-controller.js").sales_create_submit;
var router = express.Router();

/* GET home page. */
router.post('/', sales_create_submit);

module.exports = router;
