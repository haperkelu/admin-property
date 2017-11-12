var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {

    var pageSize = 10;
    var currentPage = req.query.currentPage? req.query.currentPage:1;
    var suburbStr = req.query.suburbs? req.query.suburbs:'';

    var suburbCode = suburbStr? suburbStr.substr(suburbStr.indexOf('(') + 1, 4):'';
    var source = req.query.source? req.query.source:'';
    var type = req.query.propertytype? req.query.propertytype:'';
    console.log(type);
    var PropertyService = require('../../../Biz-Service/PropertyService');
    PropertyService.getEstablishedHomeList(function (err, result){
        if (err) {console.log(err);return res.render('error/500');}
        var filteredResult = filterResultByCondition(result, suburbCode, type, source);
        var paginationResult = [];

        for(var i = (currentPage - 1) * pageSize; i < currentPage * pageSize && filteredResult[i] != undefined; i++){
            paginationResult.push(filteredResult[i]);
        }
        var pageCount = filteredResult.length / pageSize;
        var paras = {
            title: '二手房',
            currentSuburb: suburbStr,
            currentType: type,
            currentSource: source,
            establishedhomelist: paginationResult,
            currentPage:currentPage,
            pageCount: pageCount,
            currentURL: '/public/established/list'
        };
        if(req.session.user){
            paras.Name = req.session.user.Name;
            paras.Id = req.session.user.Id;
        }
        res.render('PublicSite/browse/resalehomelist', paras);
    });

});

var filterResultByCondition = function (result, suburbCode, type, source) {
    var filteredResult = [];
    for(var i in result){
        var item = result[i];
        if((!suburbCode || ((item.SuburbCode) && item.SuburbCode.toUpperCase() == suburbCode.toUpperCase()))) {
            if(!type || item.PropertyType.toUpperCase() == type.toUpperCase()){
                if(!source.toUpperCase() || item.Source.toUpperCase() == source.toUpperCase()){
                    filteredResult.push(item);
                }
            }
        }
    }
    return filteredResult;
}

module.exports = router;
