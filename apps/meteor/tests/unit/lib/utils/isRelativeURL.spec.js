"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const isRelativeURL_1 = require("../../../../lib/utils/isRelativeURL");
describe('isRelativeURL', () => {
    const testCases = [
        ['/', false],
        ['test', false], // TODO: should be true?
        ['test/test', true],
        ['.', false], // TODO: should be true?
        ['./test', true],
        ['https://rocket.chat', false],
        ['data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==', true], // TODO: should be false?
    ];
    testCases.forEach(([parameter, expectedResult]) => {
        it(`should return ${JSON.stringify(expectedResult)} for ${JSON.stringify(parameter)}`, () => {
            const result = (0, isRelativeURL_1.isRelativeURL)(parameter);
            (0, chai_1.expect)(result).to.be.equal(expectedResult);
        });
    });
});
