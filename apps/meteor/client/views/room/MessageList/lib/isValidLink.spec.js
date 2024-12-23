"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isValidLink_1 = require("./isValidLink");
describe('isValidLink', () => {
    const testCases = [
        ['/', false],
        ['test', false],
        ['test/test', false],
        ['.', false],
        ['./test', false],
        ['https://rocket.chat', true],
        ['rocket.chat', false],
        ['data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAAsBAAEAAAICTAEAOw==', true],
    ];
    testCases.forEach(([parameter, expectedResult]) => {
        it(`should return ${JSON.stringify(expectedResult)} for ${JSON.stringify(parameter)}`, () => {
            const result = (0, isValidLink_1.isValidLink)(parameter);
            expect(result).toBe(expectedResult);
        });
    });
});
