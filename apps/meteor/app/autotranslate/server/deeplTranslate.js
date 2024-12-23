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
const proApiEndpoint = 'https://api.deepl.com/v2/translate';
const freeApiEndpoint = 'https://api-free.deepl.com/v2/translate';
/**
 * DeepL translation service provider class representation.
 * Encapsulates the service provider settings and information.
 * Provides languages supported by the service provider.
 * Resolves API call to service provider to resolve the translation request.
 * @class
 * @augments AutoTranslate
 */
class DeeplAutoTranslate extends autotranslate_1.AutoTranslate {
    /**
     * setup api reference to deepl translate to be used as message translation provider.
     * @constructor
     */
    constructor() {
        super();
        this.name = 'deepl-translate';
        this.apiEndPointUrl = proApiEndpoint;
        // Get the service provide API key.
        server_1.settings.watch('AutoTranslate_DeepLAPIKey', (value) => {
            this.apiKey = value;
            // if the api key ends with `:fx` it is a free api key
            if (/:fx$/.test(value)) {
                this.apiEndPointUrl = freeApiEndpoint;
                return;
            }
            this.apiEndPointUrl = proApiEndpoint;
        });
    }
    /**
     * Returns metadata information about the service provide
     * @private implements super abstract method.
     * @return {object}
     */
    _getProviderMetadata() {
        return {
            name: this.name,
            displayName: i18n_1.i18n.t('AutoTranslate_DeepL'),
            settings: this._getSettings(),
        };
    }
    /**
     * Returns necessary settings information about the translation service provider.
     * @private implements super abstract method.
     * @return {object}
     */
    _getSettings() {
        return {
            apiKey: this.apiKey,
            apiEndPointUrl: this.apiEndPointUrl,
        };
    }
    /**
     * Returns supported languages for translation by the active service provider.
     * Deepl does not provide an endpoint yet to retrieve the supported languages.
     * So each supported languages are explicitly maintained.
     * @private implements super abstract method.
     * @param {string} target
     * @returns {object} code : value pair
     */
    getSupportedLanguages(target) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.apiKey) {
                return [];
            }
            if (this.supportedLanguages[target]) {
                return this.supportedLanguages[target];
            }
            this.supportedLanguages[target] = [
                {
                    language: 'bg',
                    name: i18n_1.i18n.t('Language_Bulgarian', { lng: target }),
                },
                {
                    language: 'cs',
                    name: i18n_1.i18n.t('Language_Czech', { lng: target }),
                },
                {
                    language: 'da',
                    name: i18n_1.i18n.t('Language_Danish', { lng: target }),
                },
                {
                    language: 'de',
                    name: i18n_1.i18n.t('Language_German', { lng: target }),
                },
                {
                    language: 'el',
                    name: i18n_1.i18n.t('Language_Greek', { lng: target }),
                },
                {
                    language: 'en',
                    name: i18n_1.i18n.t('Language_English', { lng: target }),
                },
                {
                    language: 'es',
                    name: i18n_1.i18n.t('Language_Spanish', { lng: target }),
                },
                {
                    language: 'et',
                    name: i18n_1.i18n.t('Language_Estonian', { lng: target }),
                },
                {
                    language: 'fi',
                    name: i18n_1.i18n.t('Language_Finnish', { lng: target }),
                },
                {
                    language: 'fr',
                    name: i18n_1.i18n.t('Language_French', { lng: target }),
                },
                {
                    language: 'hu',
                    name: i18n_1.i18n.t('Language_Hungarian', { lng: target }),
                },
                {
                    language: 'it',
                    name: i18n_1.i18n.t('Language_Italian', { lng: target }),
                },
                {
                    language: 'ja',
                    name: i18n_1.i18n.t('Language_Japanese', { lng: target }),
                },
                {
                    language: 'lt',
                    name: i18n_1.i18n.t('Language_Lithuanian', { lng: target }),
                },
                {
                    language: 'lv',
                    name: i18n_1.i18n.t('Language_Latvian', { lng: target }),
                },
                {
                    language: 'nl',
                    name: i18n_1.i18n.t('Language_Dutch', { lng: target }),
                },
                {
                    language: 'pl',
                    name: i18n_1.i18n.t('Language_Polish', { lng: target }),
                },
                {
                    language: 'pt',
                    name: i18n_1.i18n.t('Language_Portuguese', { lng: target }),
                },
                {
                    language: 'ro',
                    name: i18n_1.i18n.t('Language_Romanian', { lng: target }),
                },
                {
                    language: 'ru',
                    name: i18n_1.i18n.t('Language_Russian', { lng: target }),
                },
                {
                    language: 'sk',
                    name: i18n_1.i18n.t('Language_Slovak', { lng: target }),
                },
                {
                    language: 'sl',
                    name: i18n_1.i18n.t('Language_Slovenian', { lng: target }),
                },
                {
                    language: 'sv',
                    name: i18n_1.i18n.t('Language_Swedish', { lng: target }),
                },
                {
                    language: 'zh',
                    name: i18n_1.i18n.t('Language_Chinese', { lng: target }),
                },
            ];
            return this.supportedLanguages[target];
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
            const msgs = message.msg.split('\n');
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
                            params: { target_lang: language, text: msgs },
                            headers: {
                                Authorization: `DeepL-Auth-Key ${this.apiKey}`,
                            },
                            method: 'POST',
                        });
                        if (!result.ok) {
                            throw new Error(result.statusText);
                        }
                        const body = yield result.json();
                        if (result.status === 200 && body.translations && Array.isArray(body.translations) && body.translations.length > 0) {
                            // store translation only when the source and target language are different.
                            // multiple lines might contain different languages => Mix the text between source and detected target if neccessary
                            const translatedText = body.translations
                                .map((translation, index) => translation.detected_source_language !== language ? translation.text : msgs[index])
                                .join('\n');
                            translations[language] = this.deTokenize(Object.assign({}, message, { msg: translatedText }));
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
     * @returns {object} translated messages for each target language
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
                                auth_key: this.apiKey,
                                target_lang: language,
                                text: attachment.description || attachment.text || '',
                            },
                        });
                        if (!result.ok) {
                            throw new Error(result.statusText);
                        }
                        const body = yield result.json();
                        if (result.status === 200 && body.translations && Array.isArray(body.translations) && body.translations.length > 0) {
                            if (body.translations.map((translation) => translation.detected_source_language).join() !== language) {
                                translations[language] = body.translations.map((translation) => translation.text);
                            }
                        }
                    }
                    catch (err) {
                        system_1.SystemLogger.error({ msg: 'Error translating message attachment', err });
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
// Register DeepL translation provider to the registry.
autotranslate_1.TranslationProviderRegistry.registerProvider(new DeeplAutoTranslate());
