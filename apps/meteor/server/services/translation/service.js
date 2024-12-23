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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslationService = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const mem_1 = __importDefault(require("mem"));
const i18n_1 = require("../../lib/i18n");
class TranslationService extends core_services_1.ServiceClassInternal {
    constructor() {
        super(...arguments);
        this.name = 'translation';
        // Cache the server language for 1 hour
        this.getServerLanguageCached = (0, mem_1.default)(this.getServerLanguage.bind(this), { maxAge: 1000 * 60 * 60 });
    }
    getServerLanguage() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            return ((_a = (yield models_1.Settings.findOneById('Language'))) === null || _a === void 0 ? void 0 : _a.value) || 'en';
        });
    }
    // Use translateText when you already know the language, or want to translate to a predefined language
    translateText(text, targetLanguage, args) {
        return Promise.resolve(i18n_1.i18n.t(text, Object.assign({ lng: targetLanguage }, args)));
    }
    // Use translate when you want to translate to the user's language, or server's as a fallback
    translate(text, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const language = user.language || (yield this.getServerLanguageCached());
            return this.translateText(text, language);
        });
    }
    translateToServerLanguage(text, args) {
        return __awaiter(this, void 0, void 0, function* () {
            const language = yield this.getServerLanguageCached();
            return this.translateText(text, language, args);
        });
    }
    translateMultipleToServerLanguage(keys) {
        return __awaiter(this, void 0, void 0, function* () {
            const language = yield this.getServerLanguageCached();
            return keys.map((key) => ({
                key,
                value: i18n_1.i18n.t(key, { lng: language, fallbackLng: 'en' }),
            }));
        });
    }
}
exports.TranslationService = TranslationService;
