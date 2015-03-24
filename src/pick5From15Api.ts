/**
 * Created by wanglei on 2015/1/4.
 */

///<reference path='../typings/tsd.d.ts'/>
import baseApiModule = require("./baseLotteryApi");
import gameRuleModule = require("./gameRule");

class Pick5From15Api extends baseApiModule.BaseLotteryApi {
    name = "15选5";
    code = "10";
}

var api = new Pick5From15Api();
var rule = new gameRuleModule.NormalGameRule({name:"普通玩法",type:"normal",playMethod:1,castMethod:1,sortId:1});
rule.addContent({max:15,attr:"normal",minSelectCount:5,position:1
    ,description:"至少选择5个红球"});
api.addGameRule(rule);
rule = new gameRuleModule.NormalGameRule({name:"胆拖玩法",type:"banker",playMethod:1,castMethod:5,sortId:2});
rule.addContent({max:15,attr:"banker",minSelectCount:5, bankerMinSelectCount:1,bankerMaxSelectCount:4,bankerSeparator:"$",position:1
    ,bankerDescription:"胆码区：我认为必出的红球(1-4个)"
    ,description:"拖码区：我认为可能出的红球(至少1个)"});
api.addGameRule(rule);

baseApiModule.registerLotteryApi(api);
