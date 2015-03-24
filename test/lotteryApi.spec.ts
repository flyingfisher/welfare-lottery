/**
 * Created by wanglei,fish on 2014/11/27.
 */
///<reference path='../typings/tsd.d.ts'/>

import assert=require("assert");

interface DataDrivenItem{
    codes:string;
    play?:number;
    cast?:number;
    expect:number;
}

describe('lotteryApi', () => {
    var entry = require("../index");
    var twoColorBall;
    var sevenBall;
    var pick5From15;
    var q3d;

    var times=1000;

    function pad(it){
        return _.str.lpad(it.toString(),2,"0");
    }

    function generateRangeCode(min,max){
        return _.range(min,max+1).map(pad).join(",");
    }

    beforeEach(()=>{
        twoColorBall=entry.findLotteryByCode("01");
        q3d=entry.findLotteryByCode("05");
        sevenBall=entry.findLotteryByCode("07");
        pick5From15=entry.findLotteryByCode("10");
    });

    describe('generate random cast codes', function() {
        it('TwoColorBall: return 6 red balls and 1 blue ball', function() {
            _.times(times,function(){
                var code=twoColorBall.generateRandomCastCodes()[0];
                var balls=code.split("|");
                var redBalls=balls[0].split(",");
                var blueBall=balls[1];
                assert.equal(_.uniq(redBalls).length,6);
                assert(_.min(redBalls) > "00");
                assert(_.max(redBalls) < "34");
                assert(blueBall > "00");
                assert(blueBall < "17");
                assert(/(\d\d,?){6}\|\d\d/.test(code));
            });

            var codes=twoColorBall.generateRandomCastCodes(2);
            assert.equal(codes.length, 2);
        });

        it('Q3d: return 3 numbers',function(){
            function multiTimesTest(times, generateFunc, checkFunc){
                var multiTestRst=false;
                _.times(times,function(){
                    var code= generateFunc();
                    if(checkFunc(code)){
                        multiTestRst = true;
                    }
                });
                return multiTestRst;
            }
            var rst = multiTimesTest(times,
                function(){ return q3d.generateRandomCastCodes()[0]},
                function(code){
                    assert(/(\d,){2}\d/.test(code));
                    return _.str.count(code,code[0]) === 3;
                });
            assert(rst);

            rst = multiTimesTest(times,
                function(){ return q3d.generateRandomCastCodes(1,2)[0]},
                function(code){
                    assert(/(\d,){1}\d/.test(code));
                    return _.str.count(code,code[0]) > 1;
                });
            assert(!rst);

            rst = multiTimesTest(times,
                function(){ return q3d.generateRandomCastCodes(1,3)[0]},
                function(code){
                    assert(/(\d,){2}\d/.test(code));
                    return _.str.count(code,code[0]) > 1;
                });
            assert(!rst);
        });

        it("SevenBall: return 7 numbers",function(){
            var code=sevenBall.generateRandomCastCodes()[0];
            var balls=code.split(",");
            assert.equal(_.uniq(balls).length, 7);
            assert(_.min(balls) > "00");
            assert(_.max(balls) < "31");
            assert(/(\d\d,){6}\d\d/.test(code));
        });

        it("Pick5From15: return 5 numbers",function(){
            var code=pick5From15.generateRandomCastCodes()[0];
            var balls=code.split(",");
            assert.equal(_.uniq(balls).length, 5);
            assert(_.min(balls) > "00");
            assert(_.max(balls) < "16");
            assert(/(\d\d,){4}\d\d/.test(code));
        });
    });

    describe('calculate lottery number', function() {
        it('TwoColorBall: countLotteryNum test', function() {
            var dataDriven:DataDrivenItem[]=[
                { codes:"01,02,03,04,05,06|01",play:1,cast:1,expect:1},
                { codes:"01,02,03,04,05|01",play:1,cast:1,expect:0},
                { codes:"01,02,03,04,05,06|",play:1,cast:1,expect:0},
                { codes:"01,02,03,04,05,06,07|01,02",play:1,cast:2,expect:14},
                {codes: generateRangeCode(1,20)+"|"+generateRangeCode(1,16),play:1,cast:2,expect:620160},
                { codes: generateRangeCode(1,33)+"|"+ generateRangeCode(1,16),play:1,cast:2,expect:0},
                //castMethod:5 胆拖
                {codes:"01$02,03,04,05,06,07|01",play:1,cast:5,expect:6},
                {codes:"01$02,03,04,05,06|01",play:1,cast:5,expect:0},
                {codes:"01,02,03$04,05,06,07|01",play:1,cast:5,expect:4},
                {codes:"01,02,03,04,05,06$07,08|01",play:1,cast:5,expect:0},
                {codes:"01,02,03,04,05$15|01",play:1,cast:5,expect:0},
                {codes:"01,02$01,04,05,06,07|01",play:1,cast:5,expect:0},
                {codes: "01$"+generateRangeCode(2,20)+"|01",play:1,cast:5,expect:11628},
                {codes: "01,02,03$"+ generateRangeCode(4,20)+"|01",play:1,cast:5,expect:680},
                {codes: "01$"+ generateRangeCode(2,22)+"|01",play:1,cast:5,expect:0}
            ];

            _.forEach(dataDriven,function(item){
                var number=twoColorBall.countLotteryNum(item.codes,item.play,item.cast);
                assert.equal(item.codes+"  "+number, item.codes+"  "+item.expect);
            });
        });

        it("Q3d:countLotteryNum test",function(){
            var dataDriven:DataDrivenItem[]=[
                { codes:"1,2,3",play:1,cast:1,expect:1}//直选单式
                ,{ codes:"12,3,4",play:1,cast:2,expect:2}//直选复式
                ,{ codes:"01,34,567",play:1,cast:2,expect:12}//直选复式
                ,{ codes: _.range(10).join("")+","+ _.range(10).join("")+","+_.range(10).join(""),play:1,cast:2,expect:1000}//直选复式
                ,{codes:"1,2,2",play:2,cast:1,expect:1}//组三单式
                ,{codes:"12,23",play:2,cast:2,expect:3}//组三复式
                ,{codes:"1245,23467",play:2,cast:2,expect:18}//组三复式
                ,{codes:"1,2,3",play:3,cast:1,expect:1}//组六单式
                ,{codes:"1234,1234,1234",play:3,cast:2,expect:4}//组六复式
                ,{codes:"23",play:1,cast:4,expect:1}//和值
                ,{codes:"0,0,2",play:2,cast:3,expect:1}//包选三
                ,{codes:"1,2,3",play:3,cast:3,expect:1}//包选六
                //error
                ,{codes:"32",play:1,cast:4,expect:0}//和值
                ,{codes:"1,0,2",play:2,cast:3,expect:0}//包选三
                ,{codes:"2,2,3",play:3,cast:3,expect:0}//包选六
            ];

            _.forEach(dataDriven,function(item){
                var number=q3d.countLotteryNum(item.codes,item.play,item.cast);
                assert.equal(item.codes+"  "+number, item.codes+"  "+item.expect);
            });
        });

        it('SevenBall: countLotteryNum test', function() {
            var dataDriven:DataDrivenItem[]=[
                { codes:"01,02,03,04,05,06,07",expect:1},
                { codes:"01,02,03,04,05,06",expect:0},
                { codes:"01,02,03,04,05,06,07,08,09",expect:36},
                { codes:generateRangeCode(1,16),expect:11440},
                { codes:generateRangeCode(1,30),expect:0},
                //castMethod:5 胆拖
                {codes:"01$02,03,04,05,06,07",play:1,cast:5,expect:1},
                {codes:"01$02,03,04,05,06,07,08",play:1,cast:5,expect:7},
                {codes:"01,02,03$01,05,06,07",play:1,cast:5,expect:0},
            ];

            _.forEach(dataDriven,function(item){
                var number=sevenBall.countLotteryNum(item.codes,item.play,item.cast);
                assert.equal(number, item.expect);
            });
        });

        it('Pick5From15: countLotteryNum test', function() {
            var dataDriven:DataDrivenItem[]=[
                { codes:"01,02,03,04,05",expect:1},
                { codes:"01,02,03,04",expect:0},
                { codes:"01,02,03,04,05,06,07",expect:21},
                { codes: generateRangeCode(1,15),expect:3003},
                //castMethod:5 胆拖
                {codes:"01$02,03,04,05",play:1,cast:5,expect:1},
                {codes:"01$02,03,04,05,06",play:1,cast:5,expect:5},
                {codes:"01,02,03$01,05,06,07",play:1,cast:5,expect:0},
            ];

            _.forEach(dataDriven,function(item){
                var number=pick5From15.countLotteryNum(item.codes,item.play,item.cast);
                assert.equal(number, item.expect);
            });
        });
    });

    describe('get Hit Balls', function() {
        it('twoColorBall',()=>{
            var hitBalls = twoColorBall.getHitCodes("01,02,03,04,05,06|07","03,04,22,23,24,25|08");
            assert.equal(hitBalls.filter(it=>it.color==="gray").length, 5);
            var hitBalls = twoColorBall.getHitCodes("01,02,03,04,05,06|07","");
            assert.equal(hitBalls.filter(it=>it.color==="gray").length, 7);
        });

        it('q3d',()=>{
            var hitBalls = q3d.getHitCodes("1,2,3","3,2,1");
            assert.equal(hitBalls.filter(it=>it.color==="gray").length, 2);
            var hitBalls = q3d.getHitCodes("23,59","2,4,9",2,1);
            assert.equal(hitBalls.filter(it=>it.color==="gray").length, 2);
            var hitBalls = q3d.getHitCodes("256,256,256","2,4,9",3,1);
            assert.equal(hitBalls.filter(it=>it.color==="gray").length, 2);
            var hitBalls = q3d.getHitCodes("15","2,4,9",1,4);
            assert.equal(hitBalls.filter(it=>it.color==="gray").length, 0);
        });

        it('SevenBall',()=>{
            var hitBalls = sevenBall.getHitCodes("01,02,03,04,05,06,07","03,04,22,23,24,25,08|07");
            assert.equal(hitBalls.filter(it=>it.color==="gray").length, 4);
        });

        it('Pick5From15',()=>{
            var hitBalls = pick5From15.getHitCodes("01,02,03,04,05","03,04,22,23,24");
            assert.equal(hitBalls.filter(it=>it.color==="gray").length, 3);
        });
    });
});