var express = require('express');
var apply_coupon_submit = require("../../controllers/PublicSite/Customer-controller").apply_coupon_submit;
var router = express.Router({mergeParams: true});

router.post('/', apply_coupon_submit);

module.exports = router;

