var express = require('express');
var property_submit = require("../controllers/property-controller.js").property_submit;
var router = express.Router();

router.post('/', property_submit);

module.exports = router;
