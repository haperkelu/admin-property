var express = require('express');
var user_update_basic = require("../../controllers/PublicSite/Customer-controller").user_update_basic;
var router = express.Router();

router.post('/', user_update_basic);

module.exports = router;

