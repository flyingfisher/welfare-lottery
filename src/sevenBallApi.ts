/**
 * Created by wanglei on 2015/1/4.
 */

///<reference path='../typings/tsd.d.ts'/>
import baseApiModule = require("./baseLotteryApi");
import gameRuleModule = require("./gameRule");

class SevenBallApi extends baseApiModule.BaseLotteryApi {
    name = "七乐彩";
    code = "07";
}

var api = new SevenBallApi();
var rule = new gameRuleModule.SevenBallGameRule({name:"普通玩法",type:"normal",playMethod:1,castMethod:1,sortId:1});
rule.addContent({max:30,attr:"normal",minSelectCount:7,maxSelectCount:16,position:1
    ,description:"至少选择7个红球"});
api.addGameRule(rule);
rule = new gameRuleModule.SevenBallGameRule({name:"胆拖玩法",type:"banker",playMethod:1,castMethod:5,sortId:2});
rule.addContent({max:30,attr:"banker",minSelectCount:7, bankerMinSelectCount:1,bankerMaxSelectCount:6
    ,bankerSeparator:"$",position:1
    ,bankerDescription:"胆码区：我认为必出的红球(1-6个)"
    ,description:"拖码区：我认为可能出的红球(至少1个)"});
api.addGameRule(rule);

baseApiModule.registerLotteryApi(api);