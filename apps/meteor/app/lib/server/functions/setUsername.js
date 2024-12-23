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
exports.setUsername = exports._setUsername = exports.setUsernameWithValidation = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const accounts_base_1 = require("meteor/accounts-base");
const meteor_1 = require("meteor/meteor");
const underscore_1 = __importDefault(require("underscore"));
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const server_1 = require("../../../settings/server");
const lib_1 = require("../lib");
const addUserToRoom_1 = require("./addUserToRoom");
const checkUsernameAvailability_1 = require("./checkUsernameAvailability");
const getAvatarSuggestionForUser_1 = require("./getAvatarSuggestionForUser");
const joinDefaultChannels_1 = require("./joinDefaultChannels");
const saveUserIdentity_1 = require("./saveUserIdentity");
const setUserAvatar_1 = require("./setUserAvatar");
const validateUsername_1 = require("./validateUsername");
const callbacks_1 = require("../../../../lib/callbacks");
const system_1 = require("../../../../server/lib/logger/system");
const notifyListener_1 = require("../lib/notifyListener");
const setUsernameWithValidation = (userId, username, joinDefaultChannelsSilenced) => __awaiter(void 0, void 0, void 0, function* () {
    if (!username) {
        throw new meteor_1.Meteor.Error('error-invalid-username', 'Invalid username', { method: 'setUsername' });
    }
    const user = yield models_1.Users.findOneById(userId);
    if (!user) {
        throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'setUsername' });
    }
    if (user.username && !server_1.settings.get('Accounts_AllowUsernameChange')) {
        throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed');
    }
    if (user.username === username || (user.username && user.username.toLowerCase() === username.toLowerCase())) {
        return;
    }
    if (!(0, validateUsername_1.validateUsername)(username)) {
        throw new meteor_1.Meteor.Error('username-invalid', `${underscore_1.default.escape(username)} is not a valid username, use only letters, numbers, dots, hyphens and underscores`);
    }
    if (!(yield (0, checkUsernameAvailability_1.checkUsernameAvailability)(username))) {
        throw new meteor_1.Meteor.Error('error-field-unavailable', `<strong>${underscore_1.default.escape(username)}</strong> is already in use :(`, {
            method: 'setUsername',
            field: username,
        });
    }
    if (!(yield (0, saveUserIdentity_1.saveUserIdentity)({ _id: user._id, username }))) {
        throw new meteor_1.Meteor.Error('error-could-not-change-username', 'Could not change username', {
            method: 'setUsername',
        });
    }
    if (!user.username) {
        yield (0, joinDefaultChannels_1.joinDefaultChannels)(user._id, joinDefaultChannelsSilenced);
        setImmediate(() => __awaiter(void 0, void 0, void 0, function* () { return callbacks_1.callbacks.run('afterCreateUser', user); }));
    }
    void (0, notifyListener_1.notifyOnUserChange)({ clientAction: 'updated', id: user._id, diff: { username } });
});
exports.setUsernameWithValidation = setUsernameWithValidation;
const _setUsername = function (userId, u, fullUser) {
    return __awaiter(this, void 0, void 0, function* () {
        const username = u.trim();
        if (!userId || !username) {
            return false;
        }
        if (!(0, validateUsername_1.validateUsername)(username)) {
            return false;
        }
        const user = fullUser || (yield models_1.Users.findOneById(userId));
        // User already has desired username, return
        if (user.username === username) {
            return user;
        }
        const previousUsername = user.username;
        // Check username availability or if the user already owns a different casing of the name
        if (!previousUsername || !(username.toLowerCase() === previousUsername.toLowerCase())) {
            if (!(yield (0, checkUsernameAvailability_1.checkUsernameAvailability)(username))) {
                return false;
            }
        }
        // If first time setting username, send Enrollment Email
        try {
            if (!previousUsername && user.emails && user.emails.length > 0 && server_1.settings.get('Accounts_Enrollment_Email')) {
                setImmediate(() => {
                    accounts_base_1.Accounts.sendEnrollmentEmail(user._id);
                });
            }
        }
        catch (e) {
            system_1.SystemLogger.error(e);
        }
        // Set new username*
        yield models_1.Users.setUsername(user._id, username);
        user.username = username;
        if (!previousUsername && server_1.settings.get('Accounts_SetDefaultAvatar') === true) {
            const avatarSuggestions = yield (0, getAvatarSuggestionForUser_1.getAvatarSuggestionForUser)(user);
            let avatarData;
            let serviceName = 'gravatar';
            for (const service of Object.keys(avatarSuggestions)) {
                avatarData = avatarSuggestions[service];
                if (service !== 'gravatar') {
                    serviceName = service;
                    break;
                }
            }
            if (avatarData) {
                yield (0, setUserAvatar_1.setUserAvatar)(user, avatarData.blob, avatarData.contentType, serviceName);
            }
        }
        // If it's the first username and the user has an invite Token, then join the invite room
        if (!previousUsername && user.inviteToken) {
            const inviteData = yield models_1.Invites.findOneById(user.inviteToken);
            if (inviteData === null || inviteData === void 0 ? void 0 : inviteData.rid) {
                yield (0, addUserToRoom_1.addUserToRoom)(inviteData.rid, user);
            }
        }
        void core_services_1.api.broadcast('user.nameChanged', {
            _id: user._id,
            name: user.name,
            username: user.username,
        });
        return user;
    });
};
exports._setUsername = _setUsername;
exports.setUsername = lib_1.RateLimiter.limitFunction(exports._setUsername, 1, 60000, {
    0() {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = meteor_1.Meteor.userId();
            return !userId || !(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'edit-other-user-info'));
        });
    },
});
