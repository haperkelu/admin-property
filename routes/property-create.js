var express = require('express');
var property_submit = require("../controllers/property-controller.js").property_submit;
var router = express.Router();

/* GET home page. */
router.post('/', property_submit);

module.exports = router;
