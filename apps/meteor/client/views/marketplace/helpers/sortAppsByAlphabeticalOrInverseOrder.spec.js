"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sortAppsByAlphabeticalOrInverseOrder_1 = require("./sortAppsByAlphabeticalOrInverseOrder");
describe('sortAppsByAlphabeticalOrder', () => {
    it.skip('should return a positive number if first word is, alphabetically, after second word', () => {
        const firstWord = 'Alfa';
        const secondWord = 'Bravo';
        const result = (0, sortAppsByAlphabeticalOrInverseOrder_1.sortAppsByAlphabeticalOrInverseOrder)(firstWord, secondWord);
        expect(result).toBeGreaterThan(0);
    });
    it.skip('should return a negative number if first word is, alphabetically, before second word', () => {
        const firstWord = 'Bravo';
        const secondWord = 'Alfa';
        const result = (0, sortAppsByAlphabeticalOrInverseOrder_1.sortAppsByAlphabeticalOrInverseOrder)(firstWord, secondWord);
        expect(result).toBeLessThan(0);
    });
    it('should return 0 if the words are the equivalent', () => {
        const firstWord = 'Alfa';
        const secondWord = 'Alfa';
        const result = (0, sortAppsByAlphabeticalOrInverseOrder_1.sortAppsByAlphabeticalOrInverseOrder)(firstWord, secondWord);
        expect(result).toBe(0);
    });
});
