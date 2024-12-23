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
exports.saveUser = void 0;
const apps_1 = require("@rocket.chat/apps");
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const accounts_base_1 = require("meteor/accounts-base");
const meteor_1 = require("meteor/meteor");
const callbacks_1 = require("../../../../../lib/callbacks");
const hasPermission_1 = require("../../../../authorization/server/functions/hasPermission");
const safeGetMeteorUser_1 = require("../../../../utils/server/functions/safeGetMeteorUser");
const generatePassword_1 = require("../../lib/generatePassword");
const notifyListener_1 = require("../../lib/notifyListener");
const passwordPolicy_1 = require("../../lib/passwordPolicy");
const saveUserIdentity_1 = require("../saveUserIdentity");
const setEmail_1 = require("../setEmail");
const setStatusText_1 = require("../setStatusText");
const handleBio_1 = require("./handleBio");
const handleNickname_1 = require("./handleNickname");
const saveNewUser_1 = require("./saveNewUser");
const sendUserEmail_1 = require("./sendUserEmail");
const validateUserData_1 = require("./validateUserData");
const validateUserEditing_1 = require("./validateUserEditing");
const saveUser = function (userId, userData) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const oldUserData = userData._id && (yield models_1.Users.findOneById(userData._id));
        if (oldUserData && (0, core_typings_1.isUserFederated)(oldUserData)) {
            throw new meteor_1.Meteor.Error('Edit_Federated_User_Not_Allowed', 'Not possible to edit a federated user');
        }
        yield (0, validateUserData_1.validateUserData)(userId, userData);
        yield callbacks_1.callbacks.run('beforeSaveUser', {
            user: userData,
            oldUser: oldUserData,
        });
        let sendPassword = false;
        if (userData.hasOwnProperty('setRandomPassword')) {
            if (userData.setRandomPassword) {
                userData.password = (0, generatePassword_1.generatePassword)();
                userData.requirePasswordChange = true;
                sendPassword = true;
            }
            delete userData.setRandomPassword;
        }
        if (!userData._id) {
            return (0, saveNewUser_1.saveNewUser)(userData, sendPassword);
        }
        yield (0, validateUserEditing_1.validateUserEditing)(userId, userData);
        // update user
        if (userData.hasOwnProperty('username') || userData.hasOwnProperty('name')) {
            if (!(yield (0, saveUserIdentity_1.saveUserIdentity)({
                _id: userData._id,
                username: userData.username,
                name: userData.name,
                updateUsernameInBackground: true,
            }))) {
                throw new meteor_1.Meteor.Error('error-could-not-save-identity', 'Could not save user identity', {
                    method: 'saveUser',
                });
            }
        }
        if (typeof userData.statusText === 'string') {
            yield (0, setStatusText_1.setStatusText)(userData._id, userData.statusText);
        }
        if (userData.email) {
            const shouldSendVerificationEmailToUser = userData.verified !== true;
            yield (0, setEmail_1.setEmail)(userData._id, userData.email, shouldSendVerificationEmailToUser);
        }
        if (((_a = userData.password) === null || _a === void 0 ? void 0 : _a.trim()) &&
            (yield (0, hasPermission_1.hasPermissionAsync)(userId, 'edit-other-user-password')) &&
            passwordPolicy_1.passwordPolicy.validate(userData.password)) {
            yield accounts_base_1.Accounts.setPasswordAsync(userData._id, userData.password.trim());
        }
        else {
            sendPassword = false;
        }
        const updateUser = {
            $set: {},
            $unset: {},
        };
        (0, handleBio_1.handleBio)(updateUser, userData.bio);
        (0, handleNickname_1.handleNickname)(updateUser, userData.nickname);
        if (userData.roles) {
            updateUser.$set.roles = userData.roles;
        }
        if (userData.settings) {
            updateUser.$set.settings = { preferences: userData.settings.preferences };
        }
        if (userData.language) {
            updateUser.$set.language = userData.language;
        }
        if (typeof userData.requirePasswordChange !== 'undefined') {
            updateUser.$set.requirePasswordChange = userData.requirePasswordChange;
            if (!userData.requirePasswordChange) {
                updateUser.$unset.requirePasswordChangeReason = 1;
            }
        }
        if (typeof userData.verified === 'boolean') {
            updateUser.$set['emails.0.verified'] = userData.verified;
        }
        yield models_1.Users.updateOne({ _id: userData._id }, updateUser);
        // App IPostUserUpdated event hook
        const userUpdated = yield models_1.Users.findOneById(userData._id);
        yield callbacks_1.callbacks.run('afterSaveUser', {
            user: userUpdated,
            oldUser: oldUserData,
        });
        yield ((_b = apps_1.Apps.self) === null || _b === void 0 ? void 0 : _b.triggerEvent(apps_1.AppEvents.IPostUserUpdated, {
            user: userUpdated,
            previousUser: oldUserData,
            performedBy: yield (0, safeGetMeteorUser_1.safeGetMeteorUser)(),
        }));
        if (sendPassword) {
            yield (0, sendUserEmail_1.sendPasswordEmail)(userData);
        }
        if (typeof userData.verified === 'boolean') {
            delete userData.verified;
        }
        void (0, notifyListener_1.notifyOnUserChange)({
            clientAction: 'updated',
            id: userData._id,
            diff: Object.assign(Object.assign({}, userData), { emails: userUpdated === null || userUpdated === void 0 ? void 0 : userUpdated.emails }),
        });
        return true;
    });
};
exports.saveUser = saveUser;
