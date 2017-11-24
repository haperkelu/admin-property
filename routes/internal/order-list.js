var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    console.log(req.session.user);
    if(!req.session.user || (req.session.user.UserType != 2 && req.session.user.UserType != 0 && req.session.user.UserType != 4))
        return res.redirect('/login');

    if(req.session.user.UserType == 0 || req.session.user.UserType == 4) {
        var OrderService = require('../../Biz-Service/OrderService.js');
        OrderService.getAllOrders(function (err, result) {
            if (err) {console.log(err);return res.send('Server Error');}
            return res.render('InternalSite/Order/order_list', { data: result,
                isOrderAccessible: true,
                isEstablishAccessible: req.session.user.UserType == 0,
                isPropertyAccessible: req.session.user.UserType == 0,
                isRentAccessible: req.session.user.UserType == 0,
                isSystemAdmin:req.session.user.UserType == 0,
                isQueryAccessible: req.session.user.UserType == 0,
                Name: req.session.user.Name,
                Id: req.session.user.Id
            });
        });
    } else {
        var DB = require('../../utility/db.js');
        DB.query('select h.`SelfReferenceCode`, Group_Concat(l.SelfReferenceCode) as CombinedCode\n' +
            'from BasicUser as h\n' +
            'inner join `BasicUser`as l on l.`ReferralCode` = h.`SelfReferenceCode`\n' +
            'where l.`ReferralCode` != \'\'\n'  +
            'Group by h.`SelfReferenceCode`', null, function (err, result) {

            if (err) {console.log(err);return res.send('Server Error');}
            var currentSelfCode = req.session.user.SelfCode;
            var firstLevelSub;
            var secondLevelSub = [];
            var thirdLevelSub = [];
            var finalSub = [];
            if(result.length > 0 && currentSelfCode){

                for(var i in result){
                    if(result[i].SelfReferenceCode == currentSelfCode) {
                        firstLevelSub = convertToArray(result[i].CombinedCode);
                        break;
                    }
                }
                if(firstLevelSub && firstLevelSub.length > 0){
                    populateParentLevel(firstLevelSub, secondLevelSub, result);
                    populateParentLevel(secondLevelSub, thirdLevelSub, result);

                    generateFinalResult(firstLevelSub, finalSub);
                    generateFinalResult(secondLevelSub, finalSub);
                    generateFinalResult(thirdLevelSub, finalSub);
                }
            }
            console.log(finalSub);
            var filteredResult = [];
            var OrderService = require('../../Biz-Service/OrderService.js');
            OrderService.getAllOrders(function (err, result) {
                if (err) {console.log(err);return res.send('Server Error');}

                for(var i in result) {
                    var orderReferalCode = result[i].SalesSelfReferenceCode;
                    console.log(orderReferalCode);
                    console.log(result[i].SalesEmail);
                    if(result[i].SalesEmail == req.session.user.Email){
                        filteredResult.push(result[i]);
                        continue;
                    }
                    if(finalSub.length > 0 && finalSub.indexOf(orderReferalCode) != -1) {
                        filteredResult.push(result[i]);
                        continue;
                    }
                }
                return res.render('InternalSite/Order/order_list', { data: filteredResult,
                    isOrderAccessible: true,
                    isEstablishAccessible: req.session.user.UserType == 0,
                    isPropertyAccessible: req.session.user.UserType == 0,
                    isRentAccessible: req.session.user.UserType == 0,
                    isSystemAdmin:req.session.user.UserType == 0,
                    isQueryAccessible: req.session.user.UserType == 0,
                    Name: req.session.user.Name,
                    Id: req.session.user.Id
                });
            });

        });
    }

});

var convertToArray = function (str) {
    if(!str) return [];
    var result = [];
    var arr = str.split(',');
    for(var i in arr){
        result.push(arr[i]);
    }
    return result;
}

var appendArray = function (original, str) {
    if(!str) return original;
    var result = convertToArray(str);
    for(var i in result){
        original.push(result[i]);
    }
    return original;
}

var populateParentLevel = function (current, next, wholeResult) {
    if(current && current.length > 0){
        for(var i in current){
            var code = current[i];
            for(var i in wholeResult){
                if(wholeResult[i].SelfReferenceCode == code) {
                    next = appendArray(next, wholeResult[i].CombinedCode);
                    break;
                }
            }
        }
    }
}

var generateFinalResult = function (current, finalSub) {
    if(current && current.length > 0){
        for(var i in current){
            if(finalSub.indexOf(current[i]) == -1){
                finalSub.push(current[i]);
            }
        }
    }
    return finalSub;
}

module.exports = router;
