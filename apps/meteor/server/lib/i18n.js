"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.i18n = void 0;
const i18n_1 = __importDefault(require("@rocket.chat/i18n"));
const i18n_2 = require("../../app/utils/lib/i18n");
Object.defineProperty(exports, "i18n", { enumerable: true, get: function () { return i18n_2.i18n; } });
void i18n_2.i18n.init({
    lng: 'en',
    fallbackLng: 'en',
    defaultNS: i18n_2.defaultTranslationNamespace,
    ns: i18n_2.availableTranslationNamespaces,
    nsSeparator: '.',
    resources: Object.fromEntries(Object.entries(i18n_1.default).map(([language, source]) => [
        language,
        (0, i18n_2.extractTranslationNamespaces)(source),
    ])),
    initImmediate: false,
});
