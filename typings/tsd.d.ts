/// <reference path="node/node.d.ts" />
/// <reference path="lodash/lodash.d.ts" />
/// <reference path="underscore.string/underscore.string.d.ts" />
/// <reference path='mocha/mocha.d.ts'/>

interface ICode{
    color:string;
    value:string;
}

interface IBall extends ICode{
    name?:string;
    selected?:boolean;
    cssClass?:string;
    ruleType:string;
    ruleAttr:string;
    headSeparator?:string;
    tailSeparator?:string;
}

interface IRuleContent{
    color:string;
    min:number;
    max:number;
    attr:string;
    description?:string;
    bankerDescription?:string;
    minSelectCount:number;
    maxSelectCount:number;
    bankerMinSelectCount:number;
    bankerMaxSelectCount:number;
    bankerSeparator:string;
    joinSeparator:string;
    tailStr:string;
    position:number;

    hasBanker():boolean;
    getBall(ruleType,num,isBanker):IBall;
}

interface IGameRule{
    playMethod:number;
    castMethod:number;
    type:string;
    name:string;
    sortId:number;
    getContents():IRuleContent[];
    match(playMethod:number,castMethod:number):boolean;
    generateRandomCastCode():string;
    countLotteryNum(castCode:string):number;
    convertToBalls(castCode):IBall[];
    convertToCastCode(balls:any[]):string;
    convertToCastInfoList(castCode):any[];
}

interface ILotteryApi {
    name:string;
    price:number;
    code:string;
    gameRules:IGameRule[];
    twoNumber:boolean;
    generateRandomCastCodes(castCount?:number,playMethod?:number,castMethod?:number):string[];
    countLotteryNum(castCode:string,playMethod?:number,castMethod?:number):number;
    countLotteryCost(castCode:string,playMethod?:number,castMethod?:number,multiple?:number):number;
    findGameRuleByType(type:string):IGameRule;
    findGameRuleByPlayAndCast(playMethod,castMethod):IGameRule;
    getHitCodes(castCode,awardCode,playMethod,castMethod):IBall[];
}

declare module _ {
    interface LoDashStatic {
        str:UnderscoreStringStatic;
    }
}

declare module math{
    export function combinations(n:number, k:number);
}
