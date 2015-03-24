# welfare-lottery
This is an implementation for welfare lottery rule on nodejs.

This project is write in Typescript 1.4.

Api:
```
var lotteryRegister = require("welfare-lottery");

lotteryRegister.getAllLottery():api[];
lotteryRegister.findLotteryByCode(code):api;

var api = lotteryRegister.findLotteryByCode("01");

api.name // chinese name of current api
api.price // 2 by now
api.code // lottery code
api.generateRandomCastCodes(count,playMethod,castMethod):string[];
api.countLotteryNum(castCode,playMethod,castMethod):number;
api.countLotteryCost(castCode,playMethod,castMethod,multiple):number;
api.getHitCodes(castCode,awardCode,playMethod,castMethod):{value}[];


```

I will be pleasure if this helps.
