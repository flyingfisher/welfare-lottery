/**
 * Created by fish on 2015/1/9.
 */

///<reference path='../typings/tsd.d.ts'/>

import ruleContentModule = require("./ruleContent");

export class NormalGameRule implements IGameRule {
    private contents:ruleContentModule.NormalRuleContent[] = [];
    playMethod:number;
    castMethod:number;
    type:string;
    name:string;
    sortId:number;
    lottery:ILotteryApi;

    addContent(obj) {
        var content = new ruleContentModule.NormalRuleContent(obj);
        content.gameRule = this;
        this.contents.push(content);
    }

    getContents():ruleContentModule.NormalRuleContent[] {
        return this.contents.sort((a, b)=>a.position - b.position);
    }

    constructor(param:{playMethod:number;castMethod:number;type:string;name:string;sortId:number;}) {
        this.playMethod = param.playMethod;
        this.castMethod = param.castMethod;
        this.type = param.type;
        this.name = param.name;
        this.sortId = param.sortId;
    }

    // 现在，只有1，2 两种是 同一个game rule，所以 没有做 额外的属性，而是当成特例处理
    match(playMethod, castMethod) {
        if (castMethod === 2)
            return playMethod === this.playMethod && this.castMethod === 1;
        else
            return playMethod === this.playMethod && this.castMethod === castMethod;
    }

    generateRandomCastCode():string {
        var strList = [];
        this.getContents().forEach((it)=> {
            strList.push(it.generateRandomCastCode());
        });
        return strList.join("");
    }

    parseCastCode(castCode:string){
        this.getContents().forEach((it)=> {
            it.setCastCode(castCode);
            castCode = it.getRemainCode();
        });
    }

    countLotteryNum(castCode:string):number {
        this.parseCastCode(castCode);
        var rst = 1;
        this.getContents().forEach((it)=> {
            rst *= it.getCount();
        });
        return rst;
    }

    convertToBallsCore(castCode):any[] {
        this.parseCastCode(castCode);
        var balls = [];
        this.getContents().forEach((it)=>{
            var theBalls = it.getBalls(this.type);
            balls = balls.concat(theBalls);
        });

        return balls;
    }

    convertToBalls(castCode) {
        return this.convertToBallsCore(castCode);
    }

    convertToCastCodeCore(balls:any[]):string {
        var castCode = "";
        if (!balls) return castCode;
        this.getContents().forEach((it)=> {
            castCode += it.getCastCode(balls);
        });
        return castCode;
    }

    convertToCastCode(balls) {
        return this.convertToCastCodeCore(balls);
    }

    convertToCastInfo(castCode) {
        var castMethod = this.castMethod;
        if (castMethod === 1 && this.countLotteryNum(castCode) > 1)
            castMethod = 2;

        return {
            castCode: castCode,
            playMethod: this.playMethod,
            castMethod: castMethod,
            multiple: 1 // default value, it is rewrite before submit, interface ICastInfo is inherit from mobile back
        };
    }

    convertToCastInfoList(castCode) {
        return [this.convertToCastInfo(castCode)];
    }

    addTailSeparatorForBalls(balls){
        var attrTemp = "";
        balls.forEach((it:IBall,idx)=> {
            var attr = it.ruleAttr.replace(/banker$/,"");
            if (!attrTemp) attrTemp = attr;
            if (attr !== attrTemp) {
                balls[idx - 1].tailSeparator = "|";
                attrTemp = attr;
            }
        });
        return balls;
    }

    getHitCodes(castBalls:IBall[], awardBalls:IBall[]) {
        castBalls.forEach((it)=> {
            var attr = it.ruleAttr.replace(/banker$/,"");
            if (!_.any(awardBalls,{ruleAttr:attr,value:it.value}))
                it.color="gray";
        });
        return this.addTailSeparatorForBalls(castBalls);
    }
}

export class SevenBallGameRule extends NormalGameRule{
    convertToBalls(castCode){
        if (!castCode) return [];
        var balls = castCode.split("|");
        var redNumbers = this.convertToBallsCore(balls[0]);
        if (balls[1]){
            return redNumbers.concat([{
                name:"sevenBlueBall",
                color:"blue",
                ruleType:this.type,
                ruleAttr:"sevenBlueBall",
                value:balls[1]
            }])
        }

        return redNumbers;
    }

    getHitCodes(castBalls:IBall[], awardBalls:IBall[]) {
        castBalls.forEach((it)=> {
            if (!_.any(awardBalls,{value:it.value}))
                it.color="gray";
        });
        return castBalls;
    }
}

export class Q3dGameRule extends NormalGameRule{
    convertToBalls(castCode){
        var balls = this.convertToBallsCore(castCode);
        return this.addTailSeparatorForBalls(balls);
    }
}

export class Q3dGroupGameRule extends NormalGameRule{
    generateRandomCastCode():string {
        if(this.playMethod === 2)
            return _.sample(_.range(0,10),2).join(",");
        if(this.playMethod === 3)
            return _.sample(_.range(0,10),3).join(",");
    }

    countLotteryNum(castCode:string):number {
        var numbers = this.convertToBalls(castCode);
        if (this.playMethod === 2) {
            var single = this.getContents()[0];
            var double = this.getContents()[1];
            var singleNumbers = numbers.filter((it)=>it.ruleAttr===single.attr).map((it)=>it.value);
            var doubleNumbers = _.uniq(numbers.filter((it)=>it.ruleAttr===double.attr).map((it)=>it.value));
            return singleNumbers.length * doubleNumbers.length
                - _.intersection(singleNumbers,doubleNumbers).length;
        }
        else if (this.playMethod === 3){
            if (numbers.length < 3) return 0;

            return math.combinations(numbers.length,3);
        }

        return 0;
    }

    convertToBalls(castCode):any[] {
        if (this.playMethod !== 3) {
            var balls = this.convertToBallsCore(castCode);
            return this.addTailSeparatorForBalls(balls);
        }

        var numbers = castCode.match(/\d/g);
        var content = this.getContents()[0];
        return _.uniq(numbers).map((it)=>{
            return content.getBall(this.type,it,false);
        });
    }

    convertToCastInfoList(castCode) {
        if (this.playMethod === 2) {
            var castInfo = this.convertToCastInfo(castCode);
            if (castInfo.castMethod === 1) {
                var code = castInfo.castCode;
                var tail = code.substr(-2);
                castInfo.castCode = code + tail; //double tail, 1,2 -> 1,2,2
            }
            return [castInfo];
        }
        else if (this.playMethod === 3) {
            var castInfo = this.convertToCastInfo(castCode);
            if (castInfo.castMethod === 1) {
                var code = castInfo.castCode.split(',')[0]; //356,356,356 -> 356
                castInfo.castCode = code.split('').join(','); //356 -> 3,5,6
            }
            return [castInfo];
        }
    }

    convertToCastCode(numbers:any[]):string {
        if (this.playMethod === 2) {
            return this.convertToCastCodeCore(numbers);
        }
        else if (this.playMethod === 3) {
            var code = numbers.map((it)=>it.value).join("");
            return [code, code, code].join(",");
        }

        return "";
    }

    getHitCodes(castBalls:IBall[], awardBalls:IBall[]) {
        castBalls.forEach((it)=> {
            if (!_.any(awardBalls,{value:it.value}))
                it.color="gray";
        });
        return castBalls;
    }
}

export class Q3dPackageGameRule extends NormalGameRule{
    generateRandomCastCode():string {
        if(this.playMethod === 2) {
            var numbers:number[] = _.sample(_.range(0, 10), 2);
            // double last number, 1,2 => 1,2,2
            var lastNumber = _.last(numbers);
            numbers.push(lastNumber);
            return numbers.join(",");
        }
        if(this.playMethod === 3)
            return _.sample(_.range(0,10),3).join(",");
    }

    countLotteryNum(castCode:string):number {
        return this.convertToCastInfoList(castCode).length;
    }

    convertToCastInfoList(castCode){
        if (!castCode) return [];
        var codes = castCode.split(',');
        if (codes.length !== 3) return [];
        var digitNumbers = codes[0].match(/\d/g);
        var tenNumbers = codes[1].match(/\d/g);
        var hundredNumbers = codes[2].match(/\d/g);

        var rst = [];
        digitNumbers.forEach((digit)=>{
            tenNumbers.forEach((ten)=>{
                hundredNumbers.forEach((hundred)=>{
                    if(this.playMethod === 2) {
                        if (_.uniq([digit,ten,hundred]).length === 2)
                            rst.push([digit,ten,hundred].join(','));
                    }
                    else if (this.playMethod === 3) {
                        if (_.uniq([digit,ten,hundred]).length === 3)
                            rst.push([digit,ten,hundred].join(','));
                    }
                });
            });
        });

        return rst.map((code) =>{
            return this.convertToCastInfo(code);
        });
    }

    getHitCodes(castBalls:IBall[], awardBalls:IBall[]) {
        castBalls.forEach((it)=> {
            if (!_.any(awardBalls,{value:it.value}))
                it.color="gray";
        });
        return castBalls;
    }
}

export class Q3dTotalGameRule extends NormalGameRule{
    convertToCastInfoList(castCode){
        if(!castCode) return [];
        var codes = castCode.split(',');
        return codes.map((code)=>{
            return this.convertToCastInfo(code);
        })
    }

    getHitCodes(castBalls:IBall[], awardBalls:IBall[]) {
        var total = awardBalls.reduce((memo,it)=>{
            var num = parseInt(it.value);
            if (!_.isNaN(num))
                memo += num;
            return memo;
        },0).toString();
        castBalls.forEach((it)=> {
            if (it.value !== total)
                it.color="gray";
        });
        return castBalls;
    }
}