var express = require('express');
var router = express.Router({mergeParams: true});

/* GET users listing. */
router.get('/', function(req, res, next) {

    var propertyId = req.params.propertyId;
    if(!propertyId) return res.render('error/500');
    if(propertyId == 'favicon.ico') return res.status(204);

    var PropertyService = require('../../../Biz-Service/PropertyService');
    PropertyService.getRentDetail(propertyId, function (err, result){
        if (err) {console.log(err);return res.render('error/500');}
        var paras = {data: result[0]};
        if(req.session.user){
            paras.Name = req.session.user.Name;
            paras.Id = req.session.user.Id;
            paras.Email = req.session.user.Email;
            paras.isCurrentUser = req.session.user.Id == result[0].CustomerId;
        }
        res.render('PublicSite/browse/rentdetail', paras);
    });

});

module.exports = router;
