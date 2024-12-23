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
const accounts_base_1 = require("meteor/accounts-base");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const oauth_1 = require("meteor/oauth");
accounts_base_1.Accounts.registerLoginHandler('iframe', (result) => __awaiter(void 0, void 0, void 0, function* () {
    if (!result.iframe) {
        return;
    }
    (0, check_1.check)(result.token, String);
    const user = yield models_1.Users.findOne({
        'services.iframe.token': result.token,
    });
    if (user) {
        return {
            userId: user._id,
        };
    }
}));
meteor_1.Meteor.methods({
    'OAuth.retrieveCredential'(credentialToken, credentialSecret) {
        return oauth_1.OAuth.retrieveCredential(credentialToken, credentialSecret);
    },
});
