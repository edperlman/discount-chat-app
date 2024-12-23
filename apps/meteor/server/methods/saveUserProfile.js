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
const apps_1 = require("@rocket.chat/apps");
const models_1 = require("@rocket.chat/models");
const accounts_base_1 = require("meteor/accounts-base");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const twoFactorRequired_1 = require("../../app/2fa/server/twoFactorRequired");
const saveCustomFields_1 = require("../../app/lib/server/functions/saveCustomFields");
const saveUser_1 = require("../../app/lib/server/functions/saveUser");
const saveUserIdentity_1 = require("../../app/lib/server/functions/saveUserIdentity");
const passwordPolicy_1 = require("../../app/lib/server/lib/passwordPolicy");
const server_1 = require("../../app/settings/server");
const setUserStatus_1 = require("../../app/user-status/server/methods/setUserStatus");
const compareUserPassword_1 = require("../lib/compareUserPassword");
const compareUserPasswordHistory_1 = require("../lib/compareUserPasswordHistory");
const MAX_BIO_LENGTH = 260;
const MAX_NICKNAME_LENGTH = 120;
function saveUserProfile(settings, customFields, ..._) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        if (!server_1.settings.get('Accounts_AllowUserProfileChange')) {
            throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', {
                method: 'saveUserProfile',
            });
        }
        if (!this.userId) {
            throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                method: 'saveUserProfile',
            });
        }
        yield (0, saveUser_1.validateUserEditing)(this.userId, {
            _id: this.userId,
            email: settings.email,
            username: settings.username,
            name: settings.realname,
            password: settings.newPassword,
            statusText: settings.statusText,
        });
        const user = yield models_1.Users.findOneById(this.userId);
        if (settings.realname || settings.username) {
            if (!(yield (0, saveUserIdentity_1.saveUserIdentity)({
                _id: this.userId,
                name: settings.realname,
                username: settings.username,
            }))) {
                throw new meteor_1.Meteor.Error('error-could-not-save-identity', 'Could not save user identity', {
                    method: 'saveUserProfile',
                });
            }
        }
        if (settings.statusText || settings.statusText === '') {
            yield (0, setUserStatus_1.setUserStatusMethod)(this.userId, undefined, settings.statusText);
        }
        if (settings.statusType) {
            yield (0, setUserStatus_1.setUserStatusMethod)(this.userId, settings.statusType, undefined);
        }
        if (user && settings.bio) {
            if (typeof settings.bio !== 'string') {
                throw new meteor_1.Meteor.Error('error-invalid-field', 'bio', {
                    method: 'saveUserProfile',
                });
            }
            if (settings.bio.length > MAX_BIO_LENGTH) {
                throw new meteor_1.Meteor.Error('error-bio-size-exceeded', `Bio size exceeds ${MAX_BIO_LENGTH} characters`, {
                    method: 'saveUserProfile',
                });
            }
            yield models_1.Users.setBio(user._id, settings.bio.trim());
        }
        if (user && settings.nickname) {
            if (typeof settings.nickname !== 'string') {
                throw new meteor_1.Meteor.Error('error-invalid-field', 'nickname', {
                    method: 'saveUserProfile',
                });
            }
            if (settings.nickname.length > MAX_NICKNAME_LENGTH) {
                throw new meteor_1.Meteor.Error('error-nickname-size-exceeded', `Nickname size exceeds ${MAX_NICKNAME_LENGTH} characters`, {
                    method: 'saveUserProfile',
                });
            }
            yield models_1.Users.setNickname(user._id, settings.nickname.trim());
        }
        if (settings.email) {
            yield meteor_1.Meteor.callAsync('setEmail', settings.email);
        }
        const canChangePasswordForOAuth = server_1.settings.get('Accounts_AllowPasswordChangeForOAuthUsers');
        if (canChangePasswordForOAuth || ((_a = user === null || user === void 0 ? void 0 : user.services) === null || _a === void 0 ? void 0 : _a.password)) {
            // Should be the last check to prevent error when trying to check password for users without password
            if (settings.newPassword && server_1.settings.get('Accounts_AllowPasswordChange') === true && ((_c = (_b = user === null || user === void 0 ? void 0 : user.services) === null || _b === void 0 ? void 0 : _b.password) === null || _c === void 0 ? void 0 : _c.bcrypt)) {
                // don't let user change to same password
                if (user && (yield (0, compareUserPassword_1.compareUserPassword)(user, { plain: settings.newPassword }))) {
                    throw new meteor_1.Meteor.Error('error-password-same-as-current', 'Entered password same as current password', {
                        method: 'saveUserProfile',
                    });
                }
                if (((_d = user === null || user === void 0 ? void 0 : user.services) === null || _d === void 0 ? void 0 : _d.passwordHistory) && !(yield (0, compareUserPasswordHistory_1.compareUserPasswordHistory)(user, { plain: settings.newPassword }))) {
                    throw new meteor_1.Meteor.Error('error-password-in-history', 'Entered password has been previously used', {
                        method: 'saveUserProfile',
                    });
                }
                passwordPolicy_1.passwordPolicy.validate(settings.newPassword);
                yield accounts_base_1.Accounts.setPasswordAsync(this.userId, settings.newPassword, {
                    logout: false,
                });
                yield models_1.Users.addPasswordToHistory(this.userId, (_e = user.services) === null || _e === void 0 ? void 0 : _e.password.bcrypt, server_1.settings.get('Accounts_Password_History_Amount'));
                try {
                    yield meteor_1.Meteor.callAsync('removeOtherTokens');
                }
                catch (e) {
                    accounts_base_1.Accounts._clearAllLoginTokens(this.userId);
                }
            }
        }
        yield models_1.Users.setProfile(this.userId, {});
        if (customFields && Object.keys(customFields).length) {
            yield (0, saveCustomFields_1.saveCustomFields)(this.userId, customFields);
        }
        // App IPostUserUpdated event hook
        const updatedUser = yield models_1.Users.findOneById(this.userId);
        yield ((_f = apps_1.Apps.self) === null || _f === void 0 ? void 0 : _f.triggerEvent(apps_1.AppEvents.IPostUserUpdated, { user: updatedUser, previousUser: user }));
        return true;
    });
}
const saveUserProfileWithTwoFactor = (0, twoFactorRequired_1.twoFactorRequired)(saveUserProfile, {
    requireSecondFactor: true,
});
meteor_1.Meteor.methods({
    saveUserProfile(settings, customFields, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(settings, Object);
            (0, check_1.check)(customFields, check_1.Match.Maybe(Object));
            if (settings.email || settings.newPassword) {
                return saveUserProfileWithTwoFactor.call(this, settings, customFields, ...args);
            }
            return saveUserProfile.call(this, settings, customFields, ...args);
        });
    },
});
