var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    var pageSize = 10;
    var currentPage = req.query.currentPage? req.query.currentPage:1;

    var cityId = req.query.city? req.query.city:1;
    var district = req.query.district? req.query.district:'';
    console.log(district);
    var suburbStr = req.query.suburb? req.query.suburb:'';
    var suburbCode = suburbStr? suburbStr.substr(suburbStr.indexOf('(') + 1, 4):'';
    var type = req.query.type? req.query.type:'';

    var PropertyService = require('../../../Biz-Service/PropertyService');
    PropertyService.getOffplanList(function (err, result){
        if (err) {console.log(err);return res.render('error/500');}
        var filteredResult = filterResultByCondition(result,cityId,suburbCode,district,type);
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
            currentDistrict: district,
            currentSuburb: suburbStr,
            currentType: type,
            hotPropertyList: hotList,
            offplanList: paginationResult,
            currentPage:currentPage,
            pageCount: pageCount,
            currentURL: '/public/offplan/list',
            cityId: cityId
        });
    });

});

var filterResultByCondition = function (result, cityId, suburbCode, district, type) {
    var filteredResult = [];

    for(var i in result){
        var item = result[i];
        //console.log(item.CityId == cityId && (!suburbCode || item.SuburbCode == suburbCode));
        console.log(item.district);
        console.log(district);
        //console.log(!type || item.PropertyType == type);
        if(item.CityId == cityId && (!suburbCode || item.SuburbCode == suburbCode)) {
            if(!district || item.District == district) {
                if(!type || item.PropertyType == type){
                    filteredResult.push(item);
                }
            }
        }
    }
    return filteredResult;
}

module.exports = router;
