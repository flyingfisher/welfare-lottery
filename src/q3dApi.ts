/**
 * Created by wanglei on 2015/1/4.
 */

///<reference path='../typings/tsd.d.ts'/>
import baseApiModule = require("./baseLotteryApi");
import gameRuleModule = require("./gameRule");

class Q3dApi extends baseApiModule.BaseLotteryApi  {
    name = "福彩3D";
    code = "05";
    twoNumber=false;
}

var digitPlace="digitPlace";
var tenPlace="tenPlace";
var hundredPlace="hundredPlace";

var api = new Q3dApi();
var rule = new gameRuleModule.Q3dGameRule({name:"直选",type:"normal",playMethod:1,castMethod:1,sortId:1});
rule.addContent({min:0,max:9,attr:digitPlace,joinSeparator:"",tailStr:",",position:1
    ,description:"每项至少选择1个球，奖金1040元"});
rule.addContent({min:0,max:9,attr:tenPlace,joinSeparator:"",tailStr:",",position:2});
rule.addContent({min:0,max:9,attr:hundredPlace,joinSeparator:"",position:3});
api.addGameRule(rule);

rule = new gameRuleModule.Q3dGroupGameRule({name:"组三",type:"group3",playMethod:2,castMethod:1,sortId:2});
rule.addContent({min:0,max:9,attr:"single",joinSeparator:"",tailStr:",",position:1
    ,description:"每项至少选择1个球，不能重复，奖金346元"});
rule.addContent({min:0,max:9,attr:"double",joinSeparator:"",position:2});
api.addGameRule(rule);

rule = new gameRuleModule.Q3dGroupGameRule({name:"组六",type:"group6",playMethod:3,castMethod:1,sortId:3});
rule.addContent({min:0,max:9,attr:"group6", minSelectCount:3, joinSeparator:",",tailStr:"",position:1
    ,description:"至少选择3个球，奖金173元"});
api.addGameRule(rule);

rule = new gameRuleModule.Q3dPackageGameRule({name:"包选三",type:"packagePick3",playMethod:2,castMethod:3,sortId:4});
rule.addContent({min:0,max:9,attr:digitPlace,joinSeparator:"",tailStr:",",position:1
    ,description:"每项至少选择1个球"});
rule.addContent({min:0,max:9,attr:tenPlace,joinSeparator:"",tailStr:",",position:2});
rule.addContent({min:0,max:9,attr:hundredPlace,joinSeparator:"",position:3});
api.addGameRule(rule);

rule = new gameRuleModule.Q3dPackageGameRule({name:"包选六",type:"packagePick6",playMethod:3,castMethod:3,sortId:5});
rule.addContent({min:0,max:9,attr:digitPlace,joinSeparator:"",tailStr:",",position:1
    ,description:"每项至少选择1个球"});
rule.addContent({min:0,max:9,attr:tenPlace,joinSeparator:"",tailStr:",",position:2});
rule.addContent({min:0,max:9,attr:hundredPlace,joinSeparator:"",position:3});
api.addGameRule(rule);

rule = new gameRuleModule.Q3dTotalGameRule({name:"和值",type:"total",playMethod:1,castMethod:4,sortId:6});
rule.addContent({min:0,max:27,attr:"total",joinSeparator:",",position:1
    ,description:"至少选择1个球，猜中开奖3球之和即中奖"});
api.addGameRule(rule);

baseApiModule.registerLotteryApi(api);