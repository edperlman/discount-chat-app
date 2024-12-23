"use strict";
/**
 * @author Vigneshwaran Odayappan <vickyokrm@gmail.com>
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_fetch_1 = require("@rocket.chat/server-fetch");
const underscore_1 = __importDefault(require("underscore"));
const autotranslate_1 = require("./autotranslate");
const i18n_1 = require("../../../server/lib/i18n");
const system_1 = require("../../../server/lib/logger/system");
const server_1 = require("../../settings/server");
/**
 * Represents google translate class
 * @class
 * @augments AutoTranslate
 */
class GoogleAutoTranslate extends autotranslate_1.AutoTranslate {
    /**
     * setup api reference to Google translate to be used as message translation provider.
     * @constructor
     */
    constructor() {
        super();
        this.name = 'google-translate';
        this.apiEndPointUrl = 'https://translation.googleapis.com/language/translate/v2';
        // Get the service provide API key.
        server_1.settings.watch('AutoTranslate_GoogleAPIKey', (value) => {
            this.apiKey = value;
        });
    }
    /**
     * Returns metadata information about the service provider
     * @private implements super abstract method.
     * @returns {object}
     */
    _getProviderMetadata() {
        return {
            name: this.name,
            displayName: i18n_1.i18n.t('AutoTranslate_Google'),
            settings: this._getSettings(),
        };
    }
    /**
     * Returns necessary settings information about the translation service provider.
     * @private implements super abstract method.
     * @returns {object}
     */
    _getSettings() {
        return {
            apiKey: this.apiKey,
            apiEndPointUrl: this.apiEndPointUrl,
        };
    }
    /**
     * Returns supported languages for translation by the active service provider.
     * Google Translate api provides the list of supported languages.
     * @private implements super abstract method.
     * @param {string} target : user language setting or 'en'
     * @returns {object} code : value pair
     */
    getSupportedLanguages(target) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!this.apiKey) {
                return [];
            }
            if (this.supportedLanguages[target]) {
                return this.supportedLanguages[target];
            }
            let result = {};
            const params = Object.assign({ key: this.apiKey }, (target && { target }));
            try {
                const request = yield (0, server_fetch_1.serverFetch)(`https://translation.googleapis.com/language/translate/v2/languages`, { params });
                if (!request.ok && request.status === 400 && request.statusText === 'INVALID_ARGUMENT') {
                    throw new Error('Failed to fetch supported languages');
                }
                result = (yield request.json());
            }
            catch (e) {
                // Fallback: Get the English names of the target languages
                if (e.message === 'Failed to fetch supported languages') {
                    params.target = 'en';
                    target = 'en';
                    if (!this.supportedLanguages[target]) {
                        const request = yield (0, server_fetch_1.serverFetch)(`https://translation.googleapis.com/language/translate/v2/languages`, { params });
                        result = (yield request.json());
                    }
                }
            }
            if (this.supportedLanguages[target]) {
                return this.supportedLanguages[target];
            }
            this.supportedLanguages[target || 'en'] = ((_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.languages) || [];
            return this.supportedLanguages[target || 'en'];
        });
    }
    /**
     * Send Request REST API call to the service provider.
     * Returns translated message for each target language in target languages.
     * @private
     * @param {object} message
     * @param {object} targetLanguages
     * @returns {object} translations: Translated messages for each language
     */
    _translateMessage(message, targetLanguages) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, targetLanguages_1, targetLanguages_1_1;
            var _b, e_1, _c, _d;
            const translations = {};
            const supportedLanguages = yield this.getSupportedLanguages('en');
            try {
                for (_a = true, targetLanguages_1 = __asyncValues(targetLanguages); targetLanguages_1_1 = yield targetLanguages_1.next(), _b = targetLanguages_1_1.done, !_b; _a = true) {
                    _d = targetLanguages_1_1.value;
                    _a = false;
                    let language = _d;
                    if (language.indexOf('-') !== -1 && !underscore_1.default.findWhere(supportedLanguages, { language })) {
                        language = language.substr(0, 2);
                    }
                    try {
                        const result = yield (0, server_fetch_1.serverFetch)(this.apiEndPointUrl, {
                            params: {
                                key: this.apiKey,
                                target: language,
                                format: 'text',
                                q: message.msg.split('\n'),
                            },
                        });
                        if (!result.ok) {
                            throw new Error(result.statusText);
                        }
                        const body = yield result.json();
                        if (result.status === 200 &&
                            body.data &&
                            body.data.translations &&
                            Array.isArray(body.data.translations) &&
                            body.data.translations.length > 0) {
                            const txt = body.data.translations.map((translation) => translation.translatedText).join('\n');
                            translations[language] = this.deTokenize(Object.assign({}, message, { msg: txt }));
                        }
                    }
                    catch (err) {
                        system_1.SystemLogger.error({ msg: 'Error translating message', err });
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_a && !_b && (_c = targetLanguages_1.return)) yield _c.call(targetLanguages_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return translations;
        });
    }
    /**
     * Returns translated message attachment description in target languages.
     * @private
     * @param {object} attachment
     * @param {object} targetLanguages
     * @returns {object} translated attachment descriptions for each target language
     */
    _translateAttachmentDescriptions(attachment, targetLanguages) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, targetLanguages_2, targetLanguages_2_1;
            var _b, e_2, _c, _d;
            const translations = {};
            const supportedLanguages = yield this.getSupportedLanguages('en');
            try {
                for (_a = true, targetLanguages_2 = __asyncValues(targetLanguages); targetLanguages_2_1 = yield targetLanguages_2.next(), _b = targetLanguages_2_1.done, !_b; _a = true) {
                    _d = targetLanguages_2_1.value;
                    _a = false;
                    let language = _d;
                    if (language.indexOf('-') !== -1 && !underscore_1.default.findWhere(supportedLanguages, { language })) {
                        language = language.substr(0, 2);
                    }
                    try {
                        const result = yield (0, server_fetch_1.serverFetch)(this.apiEndPointUrl, {
                            params: {
                                key: this.apiKey,
                                target: language,
                                format: 'text',
                                q: attachment.description || attachment.text || '',
                            },
                        });
                        if (!result.ok) {
                            throw new Error(result.statusText);
                        }
                        const body = yield result.json();
                        if (result.status === 200 &&
                            body.data &&
                            body.data.translations &&
                            Array.isArray(body.data.translations) &&
                            body.data.translations.length > 0) {
                            translations[language] = body.data.translations.map((translation) => translation.translatedText).join('\n');
                        }
                    }
                    catch (err) {
                        system_1.SystemLogger.error({ msg: 'Error translating message', err });
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (!_a && !_b && (_c = targetLanguages_2.return)) yield _c.call(targetLanguages_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return translations;
        });
    }
}
// Register Google translation provider.
autotranslate_1.TranslationProviderRegistry.registerProvider(new GoogleAutoTranslate());
