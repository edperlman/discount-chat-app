"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const autoTranslate_1 = require("./autoTranslate");
describe('hasTranslationLanguageInMessage', () => {
    const testCases = [
        [{}, '', false],
        [{ translations: { en: 'bah' } }, '', false],
        [{ translations: { en: 'bah' } }, 'pt', false],
        [{ translations: { en: 'bah' } }, 'en', true],
    ];
    testCases.forEach(([message, language, expectedResult]) => {
        it(`should return ${JSON.stringify(expectedResult)} for ${JSON.stringify(message)} with ${JSON.stringify(language)}`, () => {
            const result = (0, autoTranslate_1.hasTranslationLanguageInMessage)(message, language);
            expect(result).toBe(expectedResult);
        });
    });
});
describe('hasTranslationLanguageInAttachments', () => {
    const testCases = [
        [[{}], '', false],
        [undefined, '', false],
        [[{ translations: { en: 'bah' } }], '', false],
        [[{ translations: { en: 'bah' } }], 'pt', false],
        [[{ translations: { en: 'bah' } }], 'pt', false],
        [[{ translations: { en: 'bah' } }], 'en', true],
    ];
    testCases.forEach(([attachment, language, expectedResult]) => {
        it(`should return ${JSON.stringify(expectedResult)} for ${JSON.stringify(attachment)} with ${JSON.stringify(language)}`, () => {
            const result = (0, autoTranslate_1.hasTranslationLanguageInAttachments)(attachment, language);
            expect(result).toBe(expectedResult);
        });
    });
});
