/**
 * Created by fish on 2014/11/27.
 */

_ = require("./node_modules/lodash/index.js");
_.str = require("./node_modules/underscore.string/index.js");
require("./src/pick5From15Api");
require("./src/q3dApi");
require("./src/sevenBallApi");
require("./src/twoColorBallApi");

math = {};
math.combinations = function combinations (n, k) {
    var max, result, i,ii;
    
    var arity = arguments.length;
    if (arity != 2) {
      throw new Error('combinations', arguments.length, 2);
    }
    
    if (_.isNumber(n)) {
      if (n < 0) {
        throw new TypeError('Positive integer value enpected in function combinations');
      }
      if (k > n) {
        throw new TypeError('k must be less than or equal to n');
      }
    
      max = Math.max(k, n - k);
      result = 1;
      for (i = 1; i <= n - max; i++) {
        result = result * (max + i) / i;
      }
      return result;
    }
    
    throw new Error('combinations', typeof n);
};    

exports.findLotteryByCode = function(code){
    var api = require("./src/baseLotteryApi").lotteryRegistry[code];
    if(!api)
        throw new Error("code:"+code+" is not supported!");
    return api;
};

exports.getAllLottery = function(){
    return _.values(require("./src/baseLotteryApi").lotteryRegistry);
};