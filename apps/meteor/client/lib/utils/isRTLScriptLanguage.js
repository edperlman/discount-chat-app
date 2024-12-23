"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRTLScriptLanguage = void 0;
const isRTLScriptLanguage = (lang) => {
    const language = lang || 'en';
    const [languageCode] = language.split('-');
    if (!languageCode) {
        return false;
    }
    return ['ar', 'dv', 'fa', 'he', 'ku', 'ps', 'sd', 'ug', 'ur', 'yi'].includes(languageCode);
};
exports.isRTLScriptLanguage = isRTLScriptLanguage;
