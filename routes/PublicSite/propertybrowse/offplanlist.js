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

        var paras = {
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
        };
        if(req.session.user){
            paras.Name = req.session.user.Name;
            paras.Id = req.session.user.Id;
        }
        res.render('PublicSite/browse/offplanlist', paras);
    });

});

var filterResultByCondition = function (result, cityId, suburbCode, district, type) {
    var filteredResult = [];

    for(var i in result){
        var item = result[i];
        if(item.CityId == cityId && (!suburbCode || item.SuburbCode == suburbCode)) {
            if(!district || item.District == district) {
                if(!type || item.PropertyType == type){
                    console.log(item.PropertyId);
                    console.log(item.DeveloperAuthBeginDate);
                    console.log(convertStringToDate(item.DeveloperAuthBeginDate));
                    console.log(item.DeveloperAuthEndDate);
                    console.log(convertStringToDate(item.DeveloperAuthEndDate));
                    if(item.DeveloperAuthBeginDate && convertStringToDate(item.DeveloperAuthBeginDate) > Date.now()){
                        continue;
                    }

                    if(item.DeveloperAuthEndDate && convertStringToDate(item.DeveloperAuthEndDate) < Date.now()){
                        continue;
                    }

                    //if(!item.DeveloperAuthContractPath) continue;
                    filteredResult.push(item);
                }
            }
        }
    }
    return filteredResult;
}

var convertStringToDate = function (dateStr) {
    var parts = dateStr.split('/');
    return new Date(dateStr);
    //10/19/2017
    //return new Date(parts[1], parts[0] - 1, parts[2]);
}

module.exports = router;
