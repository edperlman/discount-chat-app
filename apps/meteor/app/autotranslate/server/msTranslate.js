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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_fetch_1 = require("@rocket.chat/server-fetch");
const underscore_1 = __importDefault(require("underscore"));
const autotranslate_1 = require("./autotranslate");
const logger_1 = require("./logger");
const i18n_1 = require("../../../server/lib/i18n");
const server_1 = require("../../settings/server");
/**
 * Microsoft translation service provider class representation.
 * Encapsulates the service provider settings and information.
 * Provides languages supported by the service provider.
 * Resolves API call to service provider to resolve the translation request.
 * @class
 * @augments AutoTranslate
 */
class MsAutoTranslate extends autotranslate_1.AutoTranslate {
    /**
     * setup api reference to Microsoft translate to be used as message translation provider.
     * @constructor
     */
    constructor() {
        super();
        this.name = 'microsoft-translate';
        this.apiEndPointUrl = 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0';
        this.apiDetectText = 'https://api.cognitive.microsofttranslator.com/detect?api-version=3.0';
        this.apiGetLanguages = 'https://api.cognitive.microsofttranslator.com/languages?api-version=3.0';
        this.breakSentence = 'https://api.cognitive.microsofttranslator.com/breaksentence?api-version=3.0';
        // Get the service provide API key.
        server_1.settings.watch('AutoTranslate_MicrosoftAPIKey', (value) => {
            this.apiKey = value;
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
            displayName: i18n_1.i18n.t('AutoTranslate_Microsoft'),
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
     * Microsoft does not provide an endpoint yet to retrieve the supported languages.
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
            const request = yield (0, server_fetch_1.serverFetch)(this.apiGetLanguages);
            if (!request.ok) {
                throw new Error(request.statusText);
            }
            const languages = yield request.json();
            this.supportedLanguages[target] = Object.keys(languages.translation).map((language) => ({
                language,
                name: languages.translation[language].name,
            }));
            return this.supportedLanguages[target || 'en'];
        });
    }
    /**
     * Re-use method for REST API consumption of MS translate.
     * @private
     * @param {object} message
     * @param {object} targetLanguages
     * @throws Communication Errors
     * @returns {object} translations: Translated messages for each language
     */
    _translate(data, targetLanguages) {
        return __awaiter(this, void 0, void 0, function* () {
            let translations = {};
            const supportedLanguages = yield this.getSupportedLanguages('en');
            targetLanguages = targetLanguages.map((language) => {
                if (language.indexOf('-') !== -1 && !underscore_1.default.findWhere(supportedLanguages, { language })) {
                    language = language.substr(0, 2);
                }
                return language;
            });
            const request = yield (0, server_fetch_1.serverFetch)(this.apiEndPointUrl, {
                method: 'POST',
                headers: {
                    'Ocp-Apim-Subscription-Key': this.apiKey,
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                body: data,
                params: {
                    to: targetLanguages,
                },
            });
            if (!request.ok) {
                throw new Error(request.statusText);
            }
            const result = yield request.json();
            if (request.status === 200 && result.length > 0) {
                // store translation only when the source and target language are different.
                translations = Object.assign({}, ...targetLanguages.map((language) => ({
                    [language]: result
                        .map((line) => { var _a; return (_a = line.translations.find((translation) => translation.to === language)) === null || _a === void 0 ? void 0 : _a.text; })
                        .join('\n'),
                })));
            }
            return translations;
        });
    }
    /**
     * Returns translated message for each target language.
     * @private
     * @param {object} message
     * @param {object} targetLanguages
     * @returns {object} translations: Translated messages for each language
     */
    _translateMessage(message, targetLanguages) {
        return __awaiter(this, void 0, void 0, function* () {
            // There are multi-sentence-messages where multiple sentences come from different languages
            // This is a problem for translation services since the language detection fails.
            // Thus, we'll split the message in sentences, get them translated, and join them again after translation
            const msgs = message.msg.split('\n').map((msg) => ({ Text: msg }));
            try {
                return this._translate(msgs, targetLanguages);
            }
            catch (e) {
                logger_1.msLogger.error({ err: e, msg: 'Error translating message' });
            }
            return {};
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
            try {
                return this._translate([
                    {
                        Text: attachment.description || attachment.text || '',
                    },
                ], targetLanguages);
            }
            catch (e) {
                logger_1.msLogger.error({ err: e, msg: 'Error translating message attachment' });
            }
            return {};
        });
    }
}
// Register Microsoft translation provider to the registry.
autotranslate_1.TranslationProviderRegistry.registerProvider(new MsAutoTranslate());
