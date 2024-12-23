"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const isURL_1 = require("../../../../lib/utils/isURL");
describe('isURL', () => {
    const testCases = [
        ['/', false],
        ['test', false],
        ['test/test', false],
        ['.', false],
        ['./test', false],
        ['https://rocket.chat', true],
        ['data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==', true],
    ];
    testCases.forEach(([parameter, expectedResult]) => {
        it(`should return ${JSON.stringify(expectedResult)} for ${JSON.stringify(parameter)}`, () => {
            const result = (0, isURL_1.isURL)(parameter);
            (0, chai_1.expect)(result).to.be.equal(expectedResult);
        });
    });
});
