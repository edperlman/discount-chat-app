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
const meteor_1 = require("meteor/meteor");
const __1 = require("..");
meteor_1.Meteor.methods({
    'autoTranslate.translateMessage'(message, targetLanguage) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!__1.TranslationProviderRegistry.enabled) {
                return;
            }
            if (!(message === null || message === void 0 ? void 0 : message.rid)) {
                return;
            }
            const room = yield models_1.Rooms.findOneById(message === null || message === void 0 ? void 0 : message.rid);
            if (message && room) {
                yield __1.TranslationProviderRegistry.translateMessage(message, room, targetLanguage);
            }
        });
    },
});
