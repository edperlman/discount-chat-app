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
exports.validateUserData = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const patch_injection_1 = require("@rocket.chat/patch-injection");
const lodash_escape_1 = __importDefault(require("lodash.escape"));
const stringUtils_1 = require("../../../../../lib/utils/stringUtils");
const getRoles_1 = require("../../../../authorization/server/functions/getRoles");
const hasPermission_1 = require("../../../../authorization/server/functions/hasPermission");
const server_1 = require("../../../../settings/server");
const checkEmailAvailability_1 = require("../checkEmailAvailability");
const checkUsernameAvailability_1 = require("../checkUsernameAvailability");
exports.validateUserData = (0, patch_injection_1.makeFunction)((userId, userData) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const existingRoles = yield (0, getRoles_1.getRoleIds)();
    if (userData.verified && userData._id && userId === userData._id) {
        throw new core_services_1.MeteorError('error-action-not-allowed', 'Editing email verification is not allowed', {
            method: 'insertOrUpdateUser',
            action: 'Editing_user',
        });
    }
    if (userData._id && userId !== userData._id && !(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'edit-other-user-info'))) {
        throw new core_services_1.MeteorError('error-action-not-allowed', 'Editing user is not allowed', {
            method: 'insertOrUpdateUser',
            action: 'Editing_user',
        });
    }
    if (!userData._id && !(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'create-user'))) {
        throw new core_services_1.MeteorError('error-action-not-allowed', 'Adding user is not allowed', {
            method: 'insertOrUpdateUser',
            action: 'Adding_user',
        });
    }
    if (userData.roles) {
        const newRoles = userData.roles.filter((roleId) => !existingRoles.includes(roleId));
        if (newRoles.length > 0) {
            throw new core_services_1.MeteorError('error-action-not-allowed', 'The field Roles consist invalid role id', {
                method: 'insertOrUpdateUser',
                action: 'Assign_role',
            });
        }
    }
    if (((_a = userData.roles) === null || _a === void 0 ? void 0 : _a.includes('admin')) && !(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'assign-admin-role'))) {
        throw new core_services_1.MeteorError('error-action-not-allowed', 'Assigning admin is not allowed', {
            method: 'insertOrUpdateUser',
            action: 'Assign_admin',
        });
    }
    if (server_1.settings.get('Accounts_RequireNameForSignUp') && !userData._id && !(0, stringUtils_1.trim)(userData.name)) {
        throw new core_services_1.MeteorError('error-the-field-is-required', 'The field Name is required', {
            method: 'insertOrUpdateUser',
            field: 'Name',
        });
    }
    if (!userData._id && !(0, stringUtils_1.trim)(userData.username)) {
        throw new core_services_1.MeteorError('error-the-field-is-required', 'The field Username is required', {
            method: 'insertOrUpdateUser',
            field: 'Username',
        });
    }
    let nameValidation;
    try {
        nameValidation = new RegExp(`^${server_1.settings.get('UTF8_User_Names_Validation')}$`);
    }
    catch (e) {
        nameValidation = new RegExp('^[0-9a-zA-Z-_.]+$');
    }
    if (userData.username && !nameValidation.test(userData.username)) {
        throw new core_services_1.MeteorError('error-input-is-not-a-valid-field', `${(0, lodash_escape_1.default)(userData.username)} is not a valid username`, {
            method: 'insertOrUpdateUser',
            input: userData.username,
            field: 'Username',
        });
    }
    if (!userData._id && !userData.password && !userData.setRandomPassword) {
        throw new core_services_1.MeteorError('error-the-field-is-required', 'The field Password is required', {
            method: 'insertOrUpdateUser',
            field: 'Password',
        });
    }
    if (!userData._id) {
        if (userData.username && !(yield (0, checkUsernameAvailability_1.checkUsernameAvailability)(userData.username))) {
            throw new core_services_1.MeteorError('error-field-unavailable', `${(0, lodash_escape_1.default)(userData.username)} is already in use :(`, {
                method: 'insertOrUpdateUser',
                field: userData.username,
            });
        }
        if (userData.email && !(yield (0, checkEmailAvailability_1.checkEmailAvailability)(userData.email))) {
            throw new core_services_1.MeteorError('error-field-unavailable', `${(0, lodash_escape_1.default)(userData.email)} is already in use :(`, {
                method: 'insertOrUpdateUser',
                field: userData.email,
            });
        }
    }
}));
