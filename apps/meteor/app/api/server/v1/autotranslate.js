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
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("@rocket.chat/models");
const rest_typings_1 = require("@rocket.chat/rest-typings");
const meteor_1 = require("meteor/meteor");
const server_1 = require("../../../settings/server");
const api_1 = require("../api");
api_1.API.v1.addRoute('autotranslate.getSupportedLanguages', {
    authRequired: true,
    validateParams: rest_typings_1.isAutotranslateGetSupportedLanguagesParamsGET,
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!server_1.settings.get('AutoTranslate_Enabled')) {
                return api_1.API.v1.failure('AutoTranslate is disabled.');
            }
            const { targetLanguage } = this.queryParams;
            const languages = yield meteor_1.Meteor.callAsync('autoTranslate.getSupportedLanguages', targetLanguage);
            return api_1.API.v1.success({ languages: languages || [] });
        });
    },
});
api_1.API.v1.addRoute('autotranslate.saveSettings', {
    authRequired: true,
    validateParams: rest_typings_1.isAutotranslateSaveSettingsParamsPOST,
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { roomId, field, value, defaultLanguage } = this.bodyParams;
            if (!server_1.settings.get('AutoTranslate_Enabled')) {
                return api_1.API.v1.failure('AutoTranslate is disabled.');
            }
            if (!roomId) {
                return api_1.API.v1.failure('The bodyParam "roomId" is required.');
            }
            if (!field) {
                return api_1.API.v1.failure('The bodyParam "field" is required.');
            }
            if (value === undefined) {
                return api_1.API.v1.failure('The bodyParam "value" is required.');
            }
            if (field === 'autoTranslate' && typeof value !== 'boolean') {
                return api_1.API.v1.failure('The bodyParam "autoTranslate" must be a boolean.');
            }
            if (field === 'autoTranslateLanguage' && (typeof value !== 'string' || !Number.isNaN(Number.parseInt(value)))) {
                return api_1.API.v1.failure('The bodyParam "autoTranslateLanguage" must be a string.');
            }
            yield meteor_1.Meteor.callAsync('autoTranslate.saveSettings', roomId, field, value === true ? '1' : String(value).valueOf(), {
                defaultLanguage,
            });
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('autotranslate.translateMessage', {
    authRequired: true,
    validateParams: rest_typings_1.isAutotranslateTranslateMessageParamsPOST,
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { messageId, targetLanguage } = this.bodyParams;
            if (!server_1.settings.get('AutoTranslate_Enabled')) {
                return api_1.API.v1.failure('AutoTranslate is disabled.');
            }
            if (!messageId) {
                return api_1.API.v1.failure('The bodyParam "messageId" is required.');
            }
            const message = yield models_1.Messages.findOneById(messageId);
            if (!message) {
                return api_1.API.v1.failure('Message not found.');
            }
            const translatedMessage = yield meteor_1.Meteor.callAsync('autoTranslate.translateMessage', message, targetLanguage);
            return api_1.API.v1.success({ message: translatedMessage });
        });
    },
});
