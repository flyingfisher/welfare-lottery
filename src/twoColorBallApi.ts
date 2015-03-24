/**
 * Created by wanglei on 2015/1/4.
 */

///<reference path='../typings/tsd.d.ts'/>
import baseApiModule = require("./baseLotteryApi");
import gameRuleModule = require("./gameRule");

class TwoColorBallApi extends baseApiModule.BaseLotteryApi {
    name = "双色球";
    code = "01";
}

var api = new TwoColorBallApi();
var rule = new gameRuleModule.NormalGameRule({name:"普通玩法",type:"normal",playMethod:1,castMethod:1,sortId:1});
rule.addContent({max:33,attr:"red",minSelectCount:6,maxSelectCount:20,tailStr:"|",position:1
    ,description:"至少选择6个红球，1个蓝球"});
rule.addContent({color:"blue",max:16,attr:"blue",position:2});
api.addGameRule(rule);
rule = new gameRuleModule.NormalGameRule({name:"胆拖玩法",type:"banker",playMethod:1,castMethod:5,sortId:2});
rule.addContent({max:33,attr:"red",minSelectCount:7, maxSelectCount:20, bankerMinSelectCount:1
    ,bankerDescription:"胆码区：我认为必出的红球(1-5个)"
    ,description:"拖码区：我认为可能出的红球(2-19个)"
    ,bankerMaxSelectCount:5,bankerSeparator:"$", tailStr:"|",position:1});
rule.addContent({color:"blue",max:16,attr:"blue",position:2
    ,description:"蓝球区：至少1个"});
api.addGameRule(rule);

baseApiModule.registerLotteryApi(api);