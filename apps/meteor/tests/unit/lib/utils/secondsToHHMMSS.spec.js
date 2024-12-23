"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const secondsToHHMMSS_1 = require("../../../../lib/utils/secondsToHHMMSS");
describe('secondsToHHMMSS', () => {
    const testCases = [
        [0, '00:00:00'],
        [1, '00:00:01'],
        [60, '00:01:00'],
        [61, '00:01:01'],
        [3600, '01:00:00'],
        [3601, '01:00:01'],
        [3661, '01:01:01'],
        [3661.1, '01:01:01'],
        [3661.9, '01:01:02'], // rounding down?
        [3662, '01:01:02'],
        [86400, '24:00:00'],
        [172800, '48:00:00'],
        [360000, '100:00:00'], // should exceed 8 characters?
    ];
    testCases.forEach(([parameter, expectedResult]) => {
        it(`should return ${JSON.stringify(expectedResult)} for ${JSON.stringify(parameter)}`, () => {
            const result = (0, secondsToHHMMSS_1.secondsToHHMMSS)(parameter);
            (0, chai_1.expect)(result).to.be.equal(expectedResult);
        });
    });
});
