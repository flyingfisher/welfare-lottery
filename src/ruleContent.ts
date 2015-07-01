/**
 * Created by fish on 2015/1/29.
 */

///<reference path='../typings/tsd.d.ts'/>
import gameRuleModule = require("./gameRule")
export class NormalRuleContent implements IRuleContent {
    color:string="red";
    min:number=1;
    max:number;
    attr:string;
    description:string="";
    bankerDescription:string="";
    minSelectCount:number=1;
    maxSelectCount:number=-1;
    bankerMinSelectCount:number=-1;
    bankerMaxSelectCount:number=-1;
    bankerSeparator:string="$";
    joinSeparator:string=",";
    tailStr:string="";
    position:number;

    selectNumbers:number[] = [];
    bankerNumbers:number[] = [];
    gameRule:gameRuleModule.NormalGameRule;
    private remainCode:string;

    constructor(param={}){
        for(var prop in param){
            this[prop] = param[prop];
        }
    }

    generateRandomCastCode(){
        var numbers = _.sample(_.range(this.min, this.max + 1), this.minSelectCount).sort((a, b)=>a - b);
        var str = numbers.map((num)=> {
            if(this.gameRule.lottery.twoNumber)
                return _.str.lpad(num.toString(),2,"0");
            else
                return num.toString();
        }).join(this.joinSeparator) + this.tailStr;

        return str;
    }

    setCastCode(castCode){
        var self = this;
        parseNumbers(castCode);

        function parseNumbers(castCode){
            self.selectNumbers=[];
            self.bankerNumbers=[];
            var code = self.getContentCode(castCode);
            if (!code) return;

            if (self.hasBanker()) {
                var codes = code.split(self.bankerSeparator);
                var bankerCode = codes[0];
                self.bankerNumbers = bankerCode && bankerCode.split(self.joinSeparator) || [];
                var selectCode = codes[1];
                self.selectNumbers = selectCode && selectCode.split(self.joinSeparator) || [];
            }
            else {
                self.selectNumbers = code.split(self.joinSeparator) || [];
            }

            self.selectNumbers = self.selectNumbers.map((it:any)=>_.parseInt(it)).filter((it)=>!isNaN(it));
            self.bankerNumbers = self.bankerNumbers.map((it:any)=>_.parseInt(it)).filter((it)=>!isNaN(it));
        }
    }

    private getContentCode(castCode) {
        this.remainCode = "";
        if (!castCode) return;
        var code;
        if (this.tailStr)
            code = castCode.substring(0, castCode.indexOf(this.tailStr));
        else
            code = castCode;

        this.remainCode = castCode.replace(code+this.tailStr,"");
        return code;
    }

    private getNumbers(){
        return this.bankerNumbers.concat(this.selectNumbers);
    }

    getBalls(type):IBall[] {
        var bankerBalls = this.bankerNumbers.map((it)=>{
            var num = it.toString();
            return this.getBall(type,num,true);
        });
        if(_.first(bankerBalls))
            _.first(bankerBalls).headSeparator="(";
        if (_.last(bankerBalls))
            _.last(bankerBalls).tailSeparator=")";

        var selectBalls = this.selectNumbers.map((it)=>{
            var num = it.toString();
            return this.getBall(type,num,false);
        });
        return bankerBalls.concat(selectBalls);
    }

    getBall(type,num,isBanker):IBall{
        var attr = this.attr;
        if(isBanker)
            attr = this.getBankerAttr();
        if(this.gameRule.lottery.twoNumber)
            num = _.str.lpad(num,2,"0");

        return {
            name: attr,
            color: this.color,
            ruleType: type,
            ruleAttr: attr,
            value: num
        }
    }

    getRemainCode() {
        return this.remainCode;
    }

    getCastCode(balls){
        var self = this;
        if (this.hasBanker()) {
            var bankerCode = getCode(this.getBankerAttr()) + this.bankerSeparator;
            var selectCode = getCode(this.attr) + this.tailStr;
            return bankerCode + selectCode;
        }
        else
            return getCode(this.attr)+this.tailStr;

        function getCode(attr){
            return balls.filter((ball)=>ball.ruleAttr === attr).map((num)=>num.value)
                .sort((a, b)=>a - b)
                .join(self.joinSeparator);
        }
    }

    hasBanker() {
        return this.bankerMaxSelectCount !== -1 && this.bankerMinSelectCount !== -1;
    }

    getBankerAttr(){
        return this.attr + "banker";
    }

    private check(){
        var self = this;
        return checkRange() && checkDuplicate() && checkLimit();

        function checkRange(){
            return _.min(self.getNumbers()) >= self.min && _.max(self.getNumbers()) <= self.max;
        }

        function checkDuplicate(){
            return _.uniq(self.getNumbers()).length === self.getNumbers().length;
        }

        function checkLimit() {
            var count = self.getNumbers().length;
            if (self.minSelectCount !== -1 && count < self.minSelectCount)
                return false;
            if (self.maxSelectCount !== -1 && count > self.maxSelectCount)
                return false;

            if (self.hasBanker()){
                if (self.bankerMinSelectCount !== -1 && self.bankerNumbers.length < self.bankerMinSelectCount)
                    return false;
                if (self.bankerMaxSelectCount !== -1 && self.bankerNumbers.length > self.bankerMaxSelectCount)
                    return false;
            }

            return true;
        }
    }

    getCount(){
        if(!this.check()) return 0;
        if (this.selectNumbers.length === 0) return 0;
        if (this.hasBanker()) {
            return math.combinations(this.selectNumbers.length, (this.bankerMaxSelectCount + 1) - this.bankerNumbers.length);
        }
        else {
            return math.combinations(this.selectNumbers.length, this.minSelectCount);
        }
    }
}