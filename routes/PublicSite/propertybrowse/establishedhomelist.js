var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {

    var pageSize = 10;
    var currentPage = req.query.currentPage? req.query.currentPage:1;
    var suburbStr = req.query.suburbs? req.query.suburbs:'';

    var suburbCode = suburbStr? suburbStr.substr(suburbStr.indexOf('(') + 1, 4):'';
    var source = req.query.source? req.query.source:'';
    var type = req.query.propertytype? req.query.propertytype:'';

    var PropertyService = require('../../../Biz-Service/PropertyService');
    PropertyService.getEstablishedHomeList(function (err, result){
        if (err) {console.log(err);return res.render('error/500');}
        var filteredResult = filterResultByCondition(result, suburbCode, type, source);
        var paginationResult = [];

        for(var i = (currentPage - 1) * pageSize; i < currentPage * pageSize && filteredResult[i] != undefined; i++){
            paginationResult.push(filteredResult[i]);
        }
        var pageCount = filteredResult.length / pageSize;

        res.render('PublicSite/browse/resalehomelist', {
            title: '二手房',
            currentSuburb: suburbStr,
            currentType: type,
            currentSource: source,
            establishedhomelist: paginationResult,
            currentPage:currentPage,
            pageCount: pageCount,
            currentURL: '/public/established/list'
        });
    });

});

var filterResultByCondition = function (result, suburbCode, type, source) {
    var filteredResult = [];
    for(var i in result){
        var item = result[i];
        //console.log(item);
        if((!suburbCode || item.SuburbCode == suburbCode)) {
            if(!type || item.PropertyType == type){
                if(!source || item.Source == source){
                    filteredResult.push(item);
                }
            }
        }
    }
    return filteredResult;
}

module.exports = router;
