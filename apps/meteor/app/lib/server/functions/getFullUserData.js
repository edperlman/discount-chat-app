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
exports.getFullUserDataByIdOrUsernameOrImportId = getFullUserDataByIdOrUsernameOrImportId;
const logger_1 = require("@rocket.chat/logger");
const models_1 = require("@rocket.chat/models");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const server_1 = require("../../../settings/server");
const logger = new logger_1.Logger('getFullUserData');
const defaultFields = {
    name: 1,
    username: 1,
    nickname: 1,
    status: 1,
    utcOffset: 1,
    type: 1,
    active: 1,
    bio: 1,
    reason: 1,
    statusText: 1,
    avatarETag: 1,
    extension: 1,
    federated: 1,
    statusLivechat: 1,
};
const fullFields = {
    emails: 1,
    phone: 1,
    statusConnection: 1,
    bio: 1,
    createdAt: 1,
    lastLogin: 1,
    requirePasswordChange: 1,
    requirePasswordChangeReason: 1,
    roles: 1,
    importIds: 1,
    freeSwitchExtension: 1,
};
let publicCustomFields = {};
let customFields = {};
server_1.settings.watch('Accounts_CustomFields', (settingValue) => {
    publicCustomFields = {};
    customFields = {};
    const value = settingValue === null || settingValue === void 0 ? void 0 : settingValue.trim();
    if (!value) {
        return;
    }
    try {
        const customFieldsOnServer = JSON.parse(value);
        Object.keys(customFieldsOnServer).forEach((key) => {
            const element = customFieldsOnServer[key];
            if (element.public) {
                publicCustomFields[`customFields.${key}`] = 1;
            }
            customFields[`customFields.${key}`] = 1;
        });
    }
    catch (e) {
        logger.warn(`The JSON specified for "Accounts_CustomFields" is invalid. The following error was thrown: ${e}`);
    }
});
const getCustomFields = (canViewAllInfo) => (canViewAllInfo ? customFields : publicCustomFields);
const getFields = (canViewAllInfo) => (Object.assign(Object.assign(Object.assign({}, defaultFields), (canViewAllInfo && fullFields)), getCustomFields(canViewAllInfo)));
function getFullUserDataByIdOrUsernameOrImportId(userId, searchValue, searchType) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const caller = yield models_1.Users.findOneById(userId, { projection: { username: 1, importIds: 1 } });
        if (!caller) {
            return null;
        }
        const myself = (searchType === 'id' && searchValue === userId) ||
            (searchType === 'username' && searchValue === caller.username) ||
            (searchType === 'importId' && ((_a = caller.importIds) === null || _a === void 0 ? void 0 : _a.includes(searchValue)));
        const canViewAllInfo = !!myself || (yield (0, hasPermission_1.hasPermissionAsync)(userId, 'view-full-other-user-info'));
        const canViewExtension = !!myself || (yield (0, hasPermission_1.hasPermissionAsync)(userId, 'view-user-voip-extension'));
        // Only search for importId if the user has permission to view the import id
        if (searchType === 'importId' && !canViewAllInfo) {
            return null;
        }
        const fields = getFields(canViewAllInfo);
        const options = {
            projection: Object.assign(Object.assign(Object.assign({}, fields), (canViewExtension && { freeSwitchExtension: 1 })), (myself && { services: 1 })),
        };
        const user = yield (searchType === 'importId'
            ? models_1.Users.findOneByImportId(searchValue, options)
            : models_1.Users.findOneByIdOrUsername(searchValue, options));
        if (!user) {
            return null;
        }
        user.canViewAllInfo = canViewAllInfo;
        if ((_b = user === null || user === void 0 ? void 0 : user.services) === null || _b === void 0 ? void 0 : _b.password) {
            user.services.password = true;
        }
        return user;
    });
}
