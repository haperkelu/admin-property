var express = require('express');
var user_login_submit = require("../../controllers/PublicSite/Customer-controller").user_login_submit;
var router = express.Router();

router.post('/', user_login_submit);

module.exports = router;

