var express = require('express');
var user_create_submit = require("../../controllers/PublicSite/Customer-controller").user_create_submit;
var router = express.Router();

router.post('/', user_create_submit);

module.exports = router;

