"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isRTLScriptLanguage_1 = require("./isRTLScriptLanguage");
const testCases = [
    ['en', false],
    ['ar', true],
    ['dv', true],
    ['fa', true],
    ['he', true],
    ['ku', true],
    ['ps', true],
    ['sd', true],
    ['ug', true],
    ['ur', true],
    ['yi', true],
    ['ar', true],
    ['ar-LY', true],
    ['dv-MV', true],
    ['', false],
];
testCases.forEach(([parameter, expectedResult]) => {
    it(`should return ${JSON.stringify(expectedResult)} for ${JSON.stringify(parameter)}`, () => {
        const result = (0, isRTLScriptLanguage_1.isRTLScriptLanguage)(parameter);
        expect(result).toBe(expectedResult);
    });
});
