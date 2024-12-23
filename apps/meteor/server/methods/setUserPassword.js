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
const server_1 = require("../../app/lib/server");
const compareUserPassword_1 = require("../lib/compareUserPassword");
meteor_1.Meteor.methods({
    setUserPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(password, String);
            const userId = meteor_1.Meteor.userId();
            if (!userId) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'setUserPassword',
                });
            }
            const user = yield models_1.Users.findOneById(userId);
            if (user && user.requirePasswordChange !== true) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', {
                    method: 'setUserPassword',
                });
            }
            if (!user) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', {
                    method: 'setUserPassword',
                });
            }
            if (yield (0, compareUserPassword_1.compareUserPassword)(user, { plain: password })) {
                throw new meteor_1.Meteor.Error('error-password-same-as-current', 'Entered password same as current password', {
                    method: 'setUserPassword',
                });
            }
            server_1.passwordPolicy.validate(password);
            yield accounts_base_1.Accounts.setPasswordAsync(userId, password, {
                logout: false,
            });
            return models_1.Users.unsetRequirePasswordChange(userId);
        });
    },
});
