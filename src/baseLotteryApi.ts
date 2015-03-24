/**
 * Created by wanghui on 2014/11/27.
 */
///<reference path='../typings/tsd.d.ts'/>

import gameRuleModule = require("./gameRule");

export class BaseLotteryApi implements ILotteryApi {
    name = "BaseLottery";
    price = 2;
    code = "base";
    twoNumber=true;
    gameRules:any[]=[];

    addGameRule(gameRule:gameRuleModule.NormalGameRule){
        gameRule.lottery = this;
        this.gameRules.push(gameRule);
    }

    // public interface
    findGameRuleByPlayAndCast(playMethod,castMethod):gameRuleModule.NormalGameRule{
        return _.find(this.gameRules,(it)=>it.match(playMethod,castMethod));
    }

    findGameRuleByType(type){
        return _.find(this.gameRules,(it)=>{ return it.type === type});
    }

    generateRandomCastCodes(castCount = 1,playMethod=1,castMethod=1) {
        var rst = [];
        var gameRule = this.findGameRuleByPlayAndCast(playMethod,castMethod);
        if (gameRule) {
            _.times(castCount, ()=> {
                rst.push(gameRule.generateRandomCastCode());
            });
        }
        return rst;
    }

    countLotteryNum(castCode:string,playMethod=1,castMethod=1) {
        var gameRule = this.findGameRuleByPlayAndCast(playMethod,castMethod);
        if (!gameRule) return 0;
        return gameRule.countLotteryNum(castCode);
    }

    countLotteryCost(castCode:string, playMethod=1,castMethod=1, multiple=1):number {
        return this.countLotteryNum(castCode,playMethod,castMethod) * multiple * this.price;
    }

    getHitCodes(castCode:string,awardCode:string,playMethod=1,castMethod=1){
        var rule = this.findGameRuleByPlayAndCast(playMethod,castMethod);
        var castBalls = rule.convertToBalls(castCode);
        var normalRule = this.findGameRuleByPlayAndCast(1,1);
        var awardBalls = normalRule.convertToBalls(awardCode);
        return rule.getHitCodes(castBalls,awardBalls);
    }
    // public interface end
}

export var lotteryRegistry:{[lotteryCode:string]:BaseLotteryApi} = {};
export var registerLotteryApi = (lottery:BaseLotteryApi)=> {
    lotteryRegistry[lottery.code] = lottery;
};