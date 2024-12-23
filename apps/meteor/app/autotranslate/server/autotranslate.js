"use strict";
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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutoTranslate = exports.TranslationProviderRegistry = void 0;
const logger_1 = require("@rocket.chat/logger");
const models_1 = require("@rocket.chat/models");
const string_helpers_1 = require("@rocket.chat/string-helpers");
const meteor_1 = require("meteor/meteor");
const underscore_1 = __importDefault(require("underscore"));
const callbacks_1 = require("../../../lib/callbacks");
const isTruthy_1 = require("../../../lib/isTruthy");
const notifyListener_1 = require("../../lib/server/lib/notifyListener");
const server_1 = require("../../markdown/server");
const server_2 = require("../../settings/server");
const translationLogger = new logger_1.Logger('AutoTranslate');
const Providers = Symbol('Providers');
const Provider = Symbol('Provider');
/**
 * This class allows translation providers to
 * register,load and also returns the active provider.
 */
class TranslationProviderRegistry {
    /**
     * Registers the translation provider into the registry.
     * @param {*} provider
     */
    static registerProvider(provider) {
        // get provider information
        const metadata = provider._getProviderMetadata();
        if (!metadata) {
            translationLogger.error('Provider metadata is not defined');
            return;
        }
        TranslationProviderRegistry[Providers][metadata.name] = provider;
    }
    /**
     * Return the active Translation provider
     */
    static getActiveProvider() {
        if (!TranslationProviderRegistry.enabled) {
            return null;
        }
        const provider = TranslationProviderRegistry[Provider];
        if (!provider) {
            return null;
        }
        return TranslationProviderRegistry[Providers][provider];
    }
    static getSupportedLanguages(target) {
        return __awaiter(this, void 0, void 0, function* () {
            var _c;
            return TranslationProviderRegistry.enabled ? (_c = TranslationProviderRegistry.getActiveProvider()) === null || _c === void 0 ? void 0 : _c.getSupportedLanguages(target) : undefined;
        });
    }
    static translateMessage(message, room, targetLanguage) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!TranslationProviderRegistry.enabled) {
                return null;
            }
            const provider = TranslationProviderRegistry.getActiveProvider();
            if (!provider) {
                return null;
            }
            return provider.translateMessage(message, { room, targetLanguage });
        });
    }
    static getProviders() {
        return Object.values(TranslationProviderRegistry[Providers]);
    }
    static setCurrentProvider(provider) {
        if (provider === TranslationProviderRegistry[Provider]) {
            return;
        }
        TranslationProviderRegistry[Provider] = provider;
        TranslationProviderRegistry.registerCallbacks();
    }
    static setEnable(enabled) {
        TranslationProviderRegistry.enabled = enabled;
        TranslationProviderRegistry.registerCallbacks();
    }
    static registerCallbacks() {
        if (!TranslationProviderRegistry.enabled) {
            callbacks_1.callbacks.remove('afterSaveMessage', 'autotranslate');
            return;
        }
        const provider = TranslationProviderRegistry.getActiveProvider();
        if (!provider) {
            return;
        }
        callbacks_1.callbacks.add('afterSaveMessage', (message, { room }) => provider.translateMessage(message, { room }), callbacks_1.callbacks.priority.MEDIUM, 'autotranslate');
    }
}
exports.TranslationProviderRegistry = TranslationProviderRegistry;
_a = Providers, _b = Provider;
TranslationProviderRegistry[_a] = {};
TranslationProviderRegistry.enabled = false;
TranslationProviderRegistry[_b] = null;
/**
 * Generic auto translate base implementation.
 * This class provides generic parts of implementation for
 * tokenization, detokenization, call back register and unregister.
 * @abstract
 * @class
 */
class AutoTranslate {
    /**
     * Encapsulate the api key and provider settings.
     * @constructor
     */
    constructor() {
        this.name = '';
        this.languages = [];
        this.supportedLanguages = {};
    }
    /**
     * Extracts non-translatable parts of a message
     * @param {object} message
     * @return {object} message
     */
    tokenize(message) {
        if (!message.tokens || !Array.isArray(message.tokens)) {
            message.tokens = [];
        }
        message = this.tokenizeEmojis(message);
        message = this.tokenizeCode(message);
        message = this.tokenizeURLs(message);
        message = this.tokenizeMentions(message);
        return message;
    }
    tokenizeEmojis(message) {
        var _c;
        let count = ((_c = message.tokens) === null || _c === void 0 ? void 0 : _c.length) || 0;
        message.msg = message.msg.replace(/:[+\w\d]+:/g, (match) => {
            var _c;
            const token = `<i class=notranslate>{${count++}}</i>`;
            (_c = message.tokens) === null || _c === void 0 ? void 0 : _c.push({
                token,
                text: match,
            });
            return token;
        });
        return message;
    }
    tokenizeURLs(message) {
        var _c;
        let count = ((_c = message.tokens) === null || _c === void 0 ? void 0 : _c.length) || 0;
        const schemes = 'http,https';
        // Support ![alt text](http://image url) and [text](http://link)
        message.msg = message.msg.replace(new RegExp(`(!?\\[)([^\\]]+)(\\]\\((?:${schemes}):\\/\\/[^\\)]+\\))`, 'gm'), (_match, pre, text, post) => {
            var _c, _d;
            const pretoken = `<i class=notranslate>{${count++}}</i>`;
            (_c = message.tokens) === null || _c === void 0 ? void 0 : _c.push({
                token: pretoken,
                text: pre,
            });
            const posttoken = `<i class=notranslate>{${count++}}</i>`;
            (_d = message.tokens) === null || _d === void 0 ? void 0 : _d.push({
                token: posttoken,
                text: post,
            });
            return pretoken + text + posttoken;
        });
        // Support <http://link|Text>
        message.msg = message.msg.replace(new RegExp(`((?:<|&lt;)(?:${schemes}):\\/\\/[^\\|]+\\|)(.+?)(?=>|&gt;)((?:>|&gt;))`, 'gm'), (_match, pre, text, post) => {
            var _c, _d;
            const pretoken = `<i class=notranslate>{${count++}}</i>`;
            (_c = message.tokens) === null || _c === void 0 ? void 0 : _c.push({
                token: pretoken,
                text: pre,
            });
            const posttoken = `<i class=notranslate>{${count++}}</i>`;
            (_d = message.tokens) === null || _d === void 0 ? void 0 : _d.push({
                token: posttoken,
                text: post,
            });
            return pretoken + text + posttoken;
        });
        return message;
    }
    tokenizeCode(message) {
        var _c, _d, _e;
        let count = ((_c = message.tokens) === null || _c === void 0 ? void 0 : _c.length) || 0;
        message.html = message.msg;
        message = server_1.Markdown.parseMessageNotEscaped(message);
        // Some parsers (e. g. Marked) wrap the complete message in a <p> - this is unnecessary and should be ignored with respect to translations
        const regexWrappedParagraph = new RegExp('^\\s*<p>|</p>\\s*$', 'gm');
        message.msg = message.msg.replace(regexWrappedParagraph, '');
        for (const [tokenIndex, value] of (_e = (_d = message.tokens) === null || _d === void 0 ? void 0 : _d.entries()) !== null && _e !== void 0 ? _e : []) {
            const { token } = value;
            if (token.indexOf('notranslate') === -1) {
                const newToken = `<i class=notranslate>{${count++}}</i>`;
                message.msg = message.msg.replace(token, newToken);
                message.tokens ? (message.tokens[tokenIndex].token = newToken) : undefined;
            }
        }
        return message;
    }
    tokenizeMentions(message) {
        var _c;
        let count = ((_c = message.tokens) === null || _c === void 0 ? void 0 : _c.length) || 0;
        if (message.mentions && message.mentions.length > 0) {
            message.mentions.forEach((mention) => {
                message.msg = message.msg.replace(new RegExp(`(@${mention.username})`, 'gm'), (match) => {
                    var _c;
                    const token = `<i class=notranslate>{${count++}}</i>`;
                    (_c = message.tokens) === null || _c === void 0 ? void 0 : _c.push({
                        token,
                        text: match,
                    });
                    return token;
                });
            });
        }
        if (message.channels && message.channels.length > 0) {
            message.channels.forEach((channel) => {
                message.msg = message.msg.replace(new RegExp(`(#${channel.name})`, 'gm'), (match) => {
                    var _c;
                    const token = `<i class=notranslate>{${count++}}</i>`;
                    (_c = message.tokens) === null || _c === void 0 ? void 0 : _c.push({
                        token,
                        text: match,
                    });
                    return token;
                });
            });
        }
        return message;
    }
    deTokenize(message) {
        var _c;
        if (message.tokens && ((_c = message.tokens) === null || _c === void 0 ? void 0 : _c.length) > 0) {
            for (const { token, text, noHtml } of message.tokens) {
                message.msg = message.msg.replace(token, () => noHtml || text);
            }
        }
        return message.msg;
    }
    /**
     * Triggers the translation of the prepared (tokenized) message
     * and persists the result
     * @public
     * @param {object} message
     * @param {object} room
     * @param {object} targetLanguage
     * @returns {object} unmodified message object.
     */
    translateMessage(message_1, _c) {
        return __awaiter(this, arguments, void 0, function* (message, { room, targetLanguage }) {
            var _d;
            let targetLanguages;
            if (targetLanguage) {
                targetLanguages = [targetLanguage];
            }
            else {
                targetLanguages = (yield models_1.Subscriptions.getAutoTranslateLanguagesByRoomAndNotUser(room._id, (_d = message.u) === null || _d === void 0 ? void 0 : _d._id)).filter(isTruthy_1.isTruthy);
            }
            if (message.msg) {
                setImmediate(() => __awaiter(this, void 0, void 0, function* () {
                    let targetMessage = Object.assign({}, message);
                    targetMessage.html = (0, string_helpers_1.escapeHTML)(String(targetMessage.msg));
                    targetMessage = this.tokenize(targetMessage);
                    const translations = yield this._translateMessage(targetMessage, targetLanguages);
                    if (!underscore_1.default.isEmpty(translations)) {
                        yield models_1.Messages.addTranslations(message._id, translations, TranslationProviderRegistry[Provider] || '');
                        this.notifyTranslatedMessage(message._id);
                    }
                }));
            }
            if (message.attachments && message.attachments.length > 0) {
                setImmediate(() => __awaiter(this, void 0, void 0, function* () {
                    var _c, e_1, _d, _e;
                    var _f, _g, _h;
                    try {
                        for (var _j = true, _k = __asyncValues((_g = (_f = message.attachments) === null || _f === void 0 ? void 0 : _f.entries()) !== null && _g !== void 0 ? _g : []), _l; _l = yield _k.next(), _c = _l.done, !_c; _j = true) {
                            _e = _l.value;
                            _j = false;
                            const [index, attachment] = _e;
                            if (attachment.description || attachment.text) {
                                // Removes the initial link `[ ](quoterl)` from quote message before translation
                                const translatedText = ((_h = attachment === null || attachment === void 0 ? void 0 : attachment.text) === null || _h === void 0 ? void 0 : _h.replace(/\[(.*?)\]\(.*?\)/g, '$1')) || (attachment === null || attachment === void 0 ? void 0 : attachment.text);
                                const attachmentMessage = Object.assign(Object.assign({}, attachment), { text: translatedText });
                                const translations = yield this._translateAttachmentDescriptions(attachmentMessage, targetLanguages);
                                if (!underscore_1.default.isEmpty(translations)) {
                                    yield models_1.Messages.addAttachmentTranslations(message._id, String(index), translations);
                                    this.notifyTranslatedMessage(message._id);
                                }
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (!_j && !_c && (_d = _k.return)) yield _d.call(_k);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }));
            }
            return models_1.Messages.findOneById(message._id);
        });
    }
    notifyTranslatedMessage(messageId) {
        void (0, notifyListener_1.notifyOnMessageChange)({
            id: messageId,
        });
    }
}
exports.AutoTranslate = AutoTranslate;
meteor_1.Meteor.startup(() => {
    /** Register the active service provider on the 'AfterSaveMessage' callback.
     *  So the registered provider will be invoked when a message is saved.
     *  All the other inactive service provider must be deactivated.
     */
    server_2.settings.watch('AutoTranslate_ServiceProvider', (providerName) => {
        TranslationProviderRegistry.setCurrentProvider(providerName);
    });
    // Get Auto Translate Active flag
    server_2.settings.watch('AutoTranslate_Enabled', (value) => {
        TranslationProviderRegistry.setEnable(value);
    });
});
