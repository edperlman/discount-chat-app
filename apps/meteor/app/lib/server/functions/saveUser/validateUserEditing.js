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
exports.validateUserEditing = validateUserEditing;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const hasPermission_1 = require("../../../../authorization/server/functions/hasPermission");
const server_1 = require("../../../../settings/server");
const isEditingUserRoles = (previousRoles, newRoles) => newRoles !== undefined &&
    (newRoles.some((item) => !previousRoles.includes(item)) || previousRoles.some((item) => !newRoles.includes(item)));
const isEditingField = (previousValue, newValue) => typeof newValue !== 'undefined' && newValue !== previousValue;
/**
 * Validate permissions to edit user fields
 *
 * @param {string} userId
 * @param {{ _id: string, roles?: string[], username?: string, name?: string, statusText?: string, email?: string, password?: string}} userData
 */
function validateUserEditing(userId, userData) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const editingMyself = userData._id && userId === userData._id;
        const canEditOtherUserInfo = yield (0, hasPermission_1.hasPermissionAsync)(userId, 'edit-other-user-info');
        const canEditOtherUserPassword = yield (0, hasPermission_1.hasPermissionAsync)(userId, 'edit-other-user-password');
        const user = yield models_1.Users.findOneById(userData._id);
        if (!user) {
            throw new core_services_1.MeteorError('error-invalid-user', 'Invalid user');
        }
        if (isEditingUserRoles(user.roles, userData.roles) && !(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'assign-roles'))) {
            throw new core_services_1.MeteorError('error-action-not-allowed', 'Assign roles is not allowed', {
                method: 'insertOrUpdateUser',
                action: 'Assign_role',
            });
        }
        if (!server_1.settings.get('Accounts_AllowUserProfileChange') && !canEditOtherUserInfo && !canEditOtherUserPassword) {
            throw new core_services_1.MeteorError('error-action-not-allowed', 'Edit user profile is not allowed', {
                method: 'insertOrUpdateUser',
                action: 'Update_user',
            });
        }
        if (isEditingField(user.username, userData.username) &&
            !server_1.settings.get('Accounts_AllowUsernameChange') &&
            (!canEditOtherUserInfo || editingMyself)) {
            throw new core_services_1.MeteorError('error-action-not-allowed', 'Edit username is not allowed', {
                method: 'insertOrUpdateUser',
                action: 'Update_user',
            });
        }
        if (isEditingField(user.statusText, userData.statusText) &&
            !server_1.settings.get('Accounts_AllowUserStatusMessageChange') &&
            (!canEditOtherUserInfo || editingMyself)) {
            throw new core_services_1.MeteorError('error-action-not-allowed', 'Edit user status is not allowed', {
                method: 'insertOrUpdateUser',
                action: 'Update_user',
            });
        }
        if (isEditingField(user.name, userData.name) &&
            !server_1.settings.get('Accounts_AllowRealNameChange') &&
            (!canEditOtherUserInfo || editingMyself)) {
            throw new core_services_1.MeteorError('error-action-not-allowed', 'Edit user real name is not allowed', {
                method: 'insertOrUpdateUser',
                action: 'Update_user',
            });
        }
        if (((_a = user.emails) === null || _a === void 0 ? void 0 : _a[0]) &&
            isEditingField(user.emails[0].address, userData.email) &&
            !server_1.settings.get('Accounts_AllowEmailChange') &&
            (!canEditOtherUserInfo || editingMyself)) {
            throw new core_services_1.MeteorError('error-action-not-allowed', 'Edit user email is not allowed', {
                method: 'insertOrUpdateUser',
                action: 'Update_user',
            });
        }
        if (userData.password && !server_1.settings.get('Accounts_AllowPasswordChange') && (!canEditOtherUserPassword || editingMyself)) {
            throw new core_services_1.MeteorError('error-action-not-allowed', 'Edit user password is not allowed', {
                method: 'insertOrUpdateUser',
                action: 'Update_user',
            });
        }
    });
}
