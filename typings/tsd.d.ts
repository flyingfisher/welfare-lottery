/// <reference path="node/node.d.ts" />
/// <reference path="lodash/lodash.d.ts" />
/// <reference path="underscore.string/underscore.string.d.ts" />
/// <reference path='mocha/mocha.d.ts'/>


declare module _ {
    interface LoDashStatic {
        str:UnderscoreStringStatic;
    }
}

