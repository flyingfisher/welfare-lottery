/**
 * Created by fish on 2014/11/27.
 */

_ = require("lodash");
_.str = require("underscore.string");
math=require("mathjs");
require("./src/pick5From15Api");
require("./src/q3dApi");
require("./src/sevenBallApi");
require("./src/twoColorBallApi");

exports.findLotteryByCode = function(code){
    var api = require("./src/baseLotteryApi").lotteryRegistry[code];
    if(!api)
        throw new Error("code:"+code+" is not supported!");
    return api;
};
