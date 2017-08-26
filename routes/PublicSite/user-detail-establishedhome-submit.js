var express = require('express');
var user_detail_establishhome_submit = require('../../controllers/PublicSite/Customer-controller').user_detail_establishhome_submit;
var router = express.Router({mergeParams: true});

router.post('/', user_detail_establishhome_submit);

module.exports = router;
