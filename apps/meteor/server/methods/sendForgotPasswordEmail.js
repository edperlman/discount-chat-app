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
const server_1 = require("../../app/settings/server");
const system_1 = require("../lib/logger/system");
meteor_1.Meteor.methods({
    sendForgotPasswordEmail(to) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(to, String);
            const email = to.trim().toLowerCase();
            const user = yield models_1.Users.findOneByEmailAddress(email, { projection: { _id: 1, services: 1 } });
            if (!user) {
                return true;
            }
            if (user.services && !user.services.password) {
                if (!server_1.settings.get('Accounts_AllowPasswordChangeForOAuthUsers')) {
                    return false;
                }
            }
            try {
                accounts_base_1.Accounts.sendResetPasswordEmail(user._id, email);
                return true;
            }
            catch (error) {
                system_1.SystemLogger.error(error);
            }
        });
    },
});
