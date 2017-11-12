var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    var pageSize = 10;
    var currentPage = req.query.currentPage? req.query.currentPage:1;
    var suburbStr = req.query.suburbs? req.query.suburbs:'';

    var suburbCode = suburbStr? suburbStr.substr(suburbStr.indexOf('(') + 1, 4):'';

    var source = req.query.source? req.query.source:'';
    var rentType = req.query.rentType? req.query.rentType:'';
    var type = req.query.propertytype? req.query.propertytype:'';

    var PropertyService = require('../../../Biz-Service/PropertyService');
    PropertyService.getRentList(function (err, result){
        if (err) {console.log(err);return res.render('error/500');}
        var filteredResult = filterResultByCondition(result, suburbCode ,rentType, type,source);
        var paginationResult = [];

        for(var i = (currentPage - 1) * pageSize; i < currentPage * pageSize && filteredResult[i] != undefined; i++){
            paginationResult.push(filteredResult[i]);
        }
        var pageCount = filteredResult.length / pageSize;
        var paras = {
            title: '租房',
            currentSuburb: suburbStr,
            currentType: type,
            currentRentType: rentType,
            currentSource: source,
            rentlist: paginationResult,
            currentPage:currentPage,
            pageCount: pageCount,
            currentURL: '/public/rent/list'
        };
        if(req.session.user){
            paras.Name = req.session.user.Name;
            paras.Id = req.session.user.Id;
        }
        res.render('PublicSite/browse/rentlist', paras);
    });

});

var filterResultByCondition = function (result, suburbCode, rentType, type, source) {
    var filteredResult = [];
    for(var i in result){
        var item = result[i];
        //console.log(item);
        if((!suburbCode || item.SuburbCode == suburbCode)) {
            if(!rentType || item.RentType == rentType) {
                if(!type || item.PropertyType == type){
                    if(!source || item.Source == source){
                        filteredResult.push(item);
                    }
                }
            }
        }
    }
    return filteredResult;
}

module.exports = router;
