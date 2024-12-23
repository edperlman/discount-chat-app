"use strict";
/**
 * This file contains the exported members of the package shall be re-used.
 * @module AutoTranslate, TranslationProviderRegistry
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslationProviderRegistry = void 0;
const autotranslate_1 = require("./autotranslate");
Object.defineProperty(exports, "TranslationProviderRegistry", { enumerable: true, get: function () { return autotranslate_1.TranslationProviderRegistry; } });
require("./permissions");
require("./methods/getSupportedLanguages");
require("./methods/saveSettings");
require("./methods/translateMessage");
require("./googleTranslate");
require("./deeplTranslate");
require("./msTranslate");
require("./methods/getProviderUiMetadata");
