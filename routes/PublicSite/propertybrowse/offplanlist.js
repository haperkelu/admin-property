var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    var pageSize = 10;
    var currentPage = req.query.currentPage? req.query.currentPage:1;

    var cityId = req.query.city? req.query.city:1;
    var district = req.query.district? req.query.district:'';
    var suburb = req.query.suburb? req.query.surburb:'';
    var type = req.query.type? req.query.type:'';

    var PropertyService = require('../../../Biz-Service/PropertyService');
    PropertyService.getOffplanList(function (err, result){
        if (err) {console.log(err);return res.render('error/500');}
        var filteredResult = filterResultByCondition(result,cityId,suburb,district,type);
        var hotList = [];
        for(var i in filteredResult){
            if(filteredResult[i].IsHot && filteredResult[i].IsHot == 1){
                hotList.push(filteredResult[i]);
            }
        }
        var paginationResult = [];
        for(var i = (currentPage - 1) * pageSize; i < currentPage * pageSize && filteredResult[i] != undefined; i++){
            paginationResult.push(filteredResult[i]);
        }
        var pageCount = filteredResult.length / pageSize;
        res.render('PublicSite/browse/offplanlist', {
            title: '新房',
            currentCity: cityId,
            hotPropertyList: hotList,
            offplanList: paginationResult,
            currentPage:currentPage,
            pageCount: pageCount,
            currentURL: '',
            cityId: cityId
        });
    });

});

var filterResultByCondition = function (result, cityId, suburb, district, type) {
    var filteredResult = [];
    for(var i in result){
        var item = result[i];
        if(item.CityId == cityId && (!suburb || item.suburbId == suburb)) {
            if(!district || item.district == district) {
                if(!type || item.PropertyType == type){
                    filteredResult.push(item);
                }
            }
        }
    }
    return filteredResult;
}

module.exports = router;
