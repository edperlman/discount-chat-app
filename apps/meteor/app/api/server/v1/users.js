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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const rest_typings_1 = require("@rocket.chat/rest-typings");
const tools_1 = require("@rocket.chat/tools");
const accounts_base_1 = require("meteor/accounts-base");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const i18n_1 = require("../../../../server/lib/i18n");
const resetUserE2EKey_1 = require("../../../../server/lib/resetUserE2EKey");
const sendWelcomeEmail_1 = require("../../../../server/lib/sendWelcomeEmail");
const saveUserPreferences_1 = require("../../../../server/methods/saveUserPreferences");
const code_1 = require("../../../2fa/server/code");
const resetTOTP_1 = require("../../../2fa/server/functions/resetTOTP");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const checkUsernameAvailability_1 = require("../../../lib/server/functions/checkUsernameAvailability");
const getFullUserData_1 = require("../../../lib/server/functions/getFullUserData");
const saveCustomFields_1 = require("../../../lib/server/functions/saveCustomFields");
const saveCustomFieldsWithoutValidation_1 = require("../../../lib/server/functions/saveCustomFieldsWithoutValidation");
const saveUser_1 = require("../../../lib/server/functions/saveUser");
const setStatusText_1 = require("../../../lib/server/functions/setStatusText");
const setUserAvatar_1 = require("../../../lib/server/functions/setUserAvatar");
const setUsername_1 = require("../../../lib/server/functions/setUsername");
const validateCustomFields_1 = require("../../../lib/server/functions/validateCustomFields");
const validateNameChars_1 = require("../../../lib/server/functions/validateNameChars");
const validateUsername_1 = require("../../../lib/server/functions/validateUsername");
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
const createToken_1 = require("../../../lib/server/methods/createToken");
const server_1 = require("../../../settings/server");
const getURL_1 = require("../../../utils/server/getURL");
const api_1 = require("../api");
const getPaginationItems_1 = require("../helpers/getPaginationItems");
const getUserFromParams_1 = require("../helpers/getUserFromParams");
const isUserFromParams_1 = require("../helpers/isUserFromParams");
const getUploadFormData_1 = require("../lib/getUploadFormData");
const isValidQuery_1 = require("../lib/isValidQuery");
const users_1 = require("../lib/users");
api_1.API.v1.addRoute('users.getAvatar', { authRequired: false }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield (0, getUserFromParams_1.getUserFromParams)(this.queryParams);
            const url = (0, getURL_1.getURL)(`/avatar/${user.username}`, { cdn: false, full: true });
            this.response.setHeader('Location', url);
            return {
                statusCode: 307,
                body: url,
            };
        });
    },
});
api_1.API.v1.addRoute('users.getAvatarSuggestion', {
    authRequired: true,
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const suggestions = yield meteor_1.Meteor.callAsync('getAvatarSuggestion');
            return api_1.API.v1.success({ suggestions });
        });
    },
});
api_1.API.v1.addRoute('users.update', { authRequired: true, twoFactorRequired: true, validateParams: rest_typings_1.isUsersUpdateParamsPOST }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = Object.assign({ _id: this.bodyParams.userId }, this.bodyParams.data);
            if (userData.name && !(0, validateNameChars_1.validateNameChars)(userData.name)) {
                return api_1.API.v1.failure('Name contains invalid characters');
            }
            yield (0, saveUser_1.saveUser)(this.userId, userData);
            if (this.bodyParams.data.customFields) {
                yield (0, saveCustomFields_1.saveCustomFields)(this.bodyParams.userId, this.bodyParams.data.customFields);
            }
            if (typeof this.bodyParams.data.active !== 'undefined') {
                const { userId, data: { active }, confirmRelinquish, } = this.bodyParams;
                yield meteor_1.Meteor.callAsync('setUserActiveStatus', userId, active, Boolean(confirmRelinquish));
            }
            const { fields } = yield this.parseJsonQuery();
            const user = yield models_1.Users.findOneById(this.bodyParams.userId, { projection: fields });
            if (!user) {
                return api_1.API.v1.failure('User not found');
            }
            return api_1.API.v1.success({ user });
        });
    },
});
api_1.API.v1.addRoute('users.updateOwnBasicInfo', { authRequired: true, validateParams: rest_typings_1.isUsersUpdateOwnBasicInfoParamsPOST }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const userData = {
                email: this.bodyParams.data.email,
                realname: this.bodyParams.data.name,
                username: this.bodyParams.data.username,
                nickname: this.bodyParams.data.nickname,
                bio: this.bodyParams.data.bio,
                statusText: this.bodyParams.data.statusText,
                statusType: this.bodyParams.data.statusType,
                newPassword: this.bodyParams.data.newPassword,
                typedPassword: this.bodyParams.data.currentPassword,
            };
            if (userData.realname && !(0, validateNameChars_1.validateNameChars)(userData.realname)) {
                return api_1.API.v1.failure('Name contains invalid characters');
            }
            // saveUserProfile now uses the default two factor authentication procedures, so we need to provide that
            const twoFactorOptions = !userData.typedPassword
                ? null
                : {
                    twoFactorCode: userData.typedPassword,
                    twoFactorMethod: 'password',
                };
            yield meteor_1.Meteor.callAsync('saveUserProfile', userData, this.bodyParams.customFields, twoFactorOptions);
            return api_1.API.v1.success({
                user: yield models_1.Users.findOneById(this.userId, { projection: api_1.API.v1.defaultFieldsToExclude }),
            });
        });
    },
});
api_1.API.v1.addRoute('users.setPreferences', { authRequired: true, validateParams: rest_typings_1.isUsersSetPreferencesParamsPOST }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (this.bodyParams.userId &&
                this.bodyParams.userId !== this.userId &&
                !(yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'edit-other-user-info'))) {
                throw new meteor_1.Meteor.Error('error-action-not-allowed', 'Editing user is not allowed');
            }
            const userId = this.bodyParams.userId ? this.bodyParams.userId : this.userId;
            if (!(yield models_1.Users.findOneById(userId))) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'The optional "userId" param provided does not match any users');
            }
            yield (0, saveUserPreferences_1.saveUserPreferences)(this.bodyParams.data, userId);
            const user = yield models_1.Users.findOneById(userId, {
                projection: {
                    'settings.preferences': 1,
                    'language': 1,
                },
            });
            if (!user) {
                return api_1.API.v1.failure('User not found');
            }
            return api_1.API.v1.success({
                user: {
                    _id: user._id,
                    settings: {
                        preferences: Object.assign(Object.assign({}, (_a = user.settings) === null || _a === void 0 ? void 0 : _a.preferences), { language: user.language }),
                    },
                },
            });
        });
    },
});
api_1.API.v1.addRoute('users.setAvatar', { authRequired: true, validateParams: rest_typings_1.isUsersSetAvatarProps }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const canEditOtherUserAvatar = yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'edit-other-user-avatar');
            if (!server_1.settings.get('Accounts_AllowUserAvatarChange') && !canEditOtherUserAvatar) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Change avatar is not allowed', {
                    method: 'users.setAvatar',
                });
            }
            let user = yield (() => __awaiter(this, void 0, void 0, function* () {
                if ((0, isUserFromParams_1.isUserFromParams)(this.bodyParams, this.userId, this.user)) {
                    return models_1.Users.findOneById(this.userId);
                }
                if (canEditOtherUserAvatar) {
                    return (0, getUserFromParams_1.getUserFromParams)(this.bodyParams);
                }
            }))();
            if (!user) {
                return api_1.API.v1.unauthorized();
            }
            if (this.bodyParams.avatarUrl) {
                yield (0, setUserAvatar_1.setUserAvatar)(user, this.bodyParams.avatarUrl, '', 'url');
                return api_1.API.v1.success();
            }
            const image = yield (0, getUploadFormData_1.getUploadFormData)({
                request: this.request,
            }, { field: 'image', sizeLimit: server_1.settings.get('FileUpload_MaxFileSize') });
            if (!image) {
                return api_1.API.v1.failure("The 'image' param is required");
            }
            const { fields, fileBuffer, mimetype } = image;
            const sentTheUserByFormData = fields.userId || fields.username;
            if (sentTheUserByFormData) {
                if (fields.userId) {
                    user = yield models_1.Users.findOneById(fields.userId, { projection: { username: 1 } });
                }
                else if (fields.username) {
                    user = yield models_1.Users.findOneByUsernameIgnoringCase(fields.username, { projection: { username: 1 } });
                }
                if (!user) {
                    throw new meteor_1.Meteor.Error('error-invalid-user', 'The optional "userId" or "username" param provided does not match any users');
                }
                const isAnotherUser = this.userId !== user._id;
                if (isAnotherUser && !(yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'edit-other-user-avatar'))) {
                    throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed');
                }
            }
            yield (0, setUserAvatar_1.setUserAvatar)(user, fileBuffer, mimetype, 'rest');
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('users.create', { authRequired: true, validateParams: rest_typings_1.isUserCreateParamsPOST }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            // New change made by pull request #5152
            if (typeof this.bodyParams.joinDefaultChannels === 'undefined') {
                this.bodyParams.joinDefaultChannels = true;
            }
            if (this.bodyParams.name && !(0, validateNameChars_1.validateNameChars)(this.bodyParams.name)) {
                return api_1.API.v1.failure('Name contains invalid characters');
            }
            if (this.bodyParams.customFields) {
                (0, validateCustomFields_1.validateCustomFields)(this.bodyParams.customFields);
            }
            const newUserId = yield (0, saveUser_1.saveUser)(this.userId, this.bodyParams);
            const userId = typeof newUserId !== 'string' ? this.userId : newUserId;
            if (this.bodyParams.customFields) {
                yield (0, saveCustomFieldsWithoutValidation_1.saveCustomFieldsWithoutValidation)(userId, this.bodyParams.customFields);
            }
            if (typeof this.bodyParams.active !== 'undefined') {
                yield meteor_1.Meteor.callAsync('setUserActiveStatus', userId, this.bodyParams.active);
            }
            const { fields } = yield this.parseJsonQuery();
            const user = yield models_1.Users.findOneById(userId, { projection: fields });
            if (!user) {
                return api_1.API.v1.failure('User not found');
            }
            return api_1.API.v1.success({ user });
        });
    },
});
api_1.API.v1.addRoute('users.delete', { authRequired: true, permissionsRequired: ['delete-user'] }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield (0, getUserFromParams_1.getUserFromParams)(this.bodyParams);
            const { confirmRelinquish = false } = this.bodyParams;
            yield meteor_1.Meteor.callAsync('deleteUser', user._id, confirmRelinquish);
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('users.deleteOwnAccount', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { password } = this.bodyParams;
            if (!password) {
                return api_1.API.v1.failure('Body parameter "password" is required.');
            }
            if (!server_1.settings.get('Accounts_AllowDeleteOwnAccount')) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed');
            }
            const { confirmRelinquish = false } = this.bodyParams;
            yield meteor_1.Meteor.callAsync('deleteUserOwnAccount', password, confirmRelinquish);
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('users.setActiveStatus', {
    authRequired: true,
    validateParams: rest_typings_1.isUserSetActiveStatusParamsPOST,
    permissionsRequired: {
        POST: { permissions: ['edit-other-user-active-status', 'manage-moderation-actions'], operation: 'hasAny' },
    },
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, activeStatus, confirmRelinquish = false } = this.bodyParams;
            yield meteor_1.Meteor.callAsync('setUserActiveStatus', userId, activeStatus, confirmRelinquish);
            const user = yield models_1.Users.findOneById(this.bodyParams.userId, { projection: { active: 1 } });
            if (!user) {
                return api_1.API.v1.failure('User not found');
            }
            return api_1.API.v1.success({
                user,
            });
        });
    },
});
api_1.API.v1.addRoute('users.deactivateIdle', { authRequired: true, validateParams: rest_typings_1.isUserDeactivateIdleParamsPOST, permissionsRequired: ['edit-other-user-active-status'] }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { daysIdle, role = 'user' } = this.bodyParams;
            const lastLoggedIn = new Date();
            lastLoggedIn.setDate(lastLoggedIn.getDate() - daysIdle);
            // since we're deactiving users that are not logged in, there is no need to send data through WS
            const { modifiedCount: count } = yield models_1.Users.setActiveNotLoggedInAfterWithRole(lastLoggedIn, role, false);
            return api_1.API.v1.success({
                count,
            });
        });
    },
});
api_1.API.v1.addRoute('users.info', { authRequired: true, validateParams: rest_typings_1.isUsersInfoParamsGetProps }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const searchTerms = ('userId' in this.queryParams && !!this.queryParams.userId && [this.queryParams.userId, 'id']) ||
                ('username' in this.queryParams && !!this.queryParams.username && [this.queryParams.username, 'username']) ||
                ('importId' in this.queryParams && !!this.queryParams.importId && [this.queryParams.importId, 'importId']);
            if (!searchTerms) {
                return api_1.API.v1.failure('Invalid search query.');
            }
            const user = yield (0, getFullUserData_1.getFullUserDataByIdOrUsernameOrImportId)(this.userId, ...searchTerms);
            if (!user) {
                return api_1.API.v1.failure('User not found.');
            }
            const myself = user._id === this.userId;
            if (this.queryParams.includeUserRooms === 'true' && (myself || (yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'view-other-user-channels')))) {
                return api_1.API.v1.success({
                    user: Object.assign(Object.assign({}, user), { rooms: yield models_1.Subscriptions.findByUserId(user._id, {
                            projection: {
                                rid: 1,
                                name: 1,
                                t: 1,
                                roles: 1,
                                unread: 1,
                                federated: 1,
                            },
                            sort: {
                                t: 1,
                                name: 1,
                            },
                        }).toArray() }),
                });
            }
            return api_1.API.v1.success({
                user,
            });
        });
    },
});
api_1.API.v1.addRoute('users.list', {
    authRequired: true,
    queryOperations: ['$or', '$and'],
    permissionsRequired: ['view-d-room'],
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            if (server_1.settings.get('API_Apply_permission_view-outside-room_on_users-list') &&
                !(yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'view-outside-room'))) {
                return api_1.API.v1.unauthorized();
            }
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort, fields, query } = yield this.parseJsonQuery();
            const nonEmptyQuery = (0, users_1.getNonEmptyQuery)(query, yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'view-full-other-user-info'));
            const nonEmptyFields = (0, users_1.getNonEmptyFields)(fields);
            const inclusiveFields = (0, users_1.getInclusiveFields)(nonEmptyFields);
            const inclusiveFieldsKeys = Object.keys(inclusiveFields);
            if (!(0, isValidQuery_1.isValidQuery)(nonEmptyQuery, [
                ...inclusiveFieldsKeys,
                inclusiveFieldsKeys.includes('emails') && 'emails.address.*',
                inclusiveFieldsKeys.includes('username') && 'username.*',
                inclusiveFieldsKeys.includes('name') && 'name.*',
                inclusiveFieldsKeys.includes('type') && 'type.*',
                inclusiveFieldsKeys.includes('customFields') && 'customFields.*',
            ].filter(Boolean), this.queryOperations)) {
                throw new meteor_1.Meteor.Error('error-invalid-query', isValidQuery_1.isValidQuery.errors.join('\n'));
            }
            const actualSort = sort || { username: 1 };
            if (sort === null || sort === void 0 ? void 0 : sort.status) {
                actualSort.active = sort.status;
            }
            if (sort === null || sort === void 0 ? void 0 : sort.name) {
                actualSort.nameInsensitive = sort.name;
            }
            const limit = count !== 0
                ? [
                    {
                        $limit: count,
                    },
                ]
                : [];
            const result = yield models_1.Users.col
                .aggregate([
                {
                    $match: nonEmptyQuery,
                },
                {
                    $project: inclusiveFields,
                },
                {
                    $addFields: {
                        nameInsensitive: {
                            $toLower: '$name',
                        },
                    },
                },
                {
                    $facet: {
                        sortedResults: [
                            {
                                $sort: actualSort,
                            },
                            {
                                $skip: offset,
                            },
                            ...limit,
                        ],
                        totalCount: [{ $group: { _id: null, total: { $sum: 1 } } }],
                    },
                },
            ])
                .toArray();
            const { sortedResults: users, totalCount: [{ total } = { total: 0 }], } = result[0];
            return api_1.API.v1.success({
                users,
                count: users.length,
                offset,
                total,
            });
        });
    },
});
api_1.API.v1.addRoute('users.listByStatus', {
    authRequired: true,
    validateParams: rest_typings_1.isUsersListStatusProps,
    permissionsRequired: ['view-d-room'],
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            if (server_1.settings.get('API_Apply_permission_view-outside-room_on_users-list') &&
                !(yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'view-outside-room'))) {
                return api_1.API.v1.unauthorized();
            }
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort } = yield this.parseJsonQuery();
            const { status, hasLoggedIn, type, roles, searchTerm } = this.queryParams;
            return api_1.API.v1.success(yield (0, users_1.findPaginatedUsersByStatus)({
                uid: this.userId,
                offset,
                count,
                sort,
                status,
                roles,
                searchTerm,
                hasLoggedIn,
                type,
            }));
        });
    },
});
api_1.API.v1.addRoute('users.sendWelcomeEmail', {
    authRequired: true,
    validateParams: rest_typings_1.isUsersSendWelcomeEmailProps,
    permissionsRequired: ['send-mail'],
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = this.bodyParams;
            yield (0, sendWelcomeEmail_1.sendWelcomeEmail)(email);
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('users.register', {
    authRequired: false,
    rateLimiterOptions: {
        numRequestsAllowed: (_a = server_1.settings.get('Rate_Limiter_Limit_RegisterUser')) !== null && _a !== void 0 ? _a : 1,
        intervalTimeInMS: server_1.settings.get('API_Enable_Rate_Limiter_Limit_Time_Default'),
    },
    validateParams: rest_typings_1.isUserRegisterParamsPOST,
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const _a = this.bodyParams, { secret: secretURL } = _a, params = __rest(_a, ["secret"]);
            if (this.userId) {
                return api_1.API.v1.failure('Logged in users can not register again.');
            }
            if (params.name && !(0, validateNameChars_1.validateNameChars)(params.name)) {
                return api_1.API.v1.failure('Name contains invalid characters');
            }
            if (!(0, validateUsername_1.validateUsername)(this.bodyParams.username)) {
                return api_1.API.v1.failure(`The username provided is not valid`);
            }
            if (!(yield (0, checkUsernameAvailability_1.checkUsernameAvailability)(this.bodyParams.username))) {
                return api_1.API.v1.failure('Username is already in use');
            }
            if (this.bodyParams.customFields) {
                try {
                    yield (0, validateCustomFields_1.validateCustomFields)(this.bodyParams.customFields);
                }
                catch (e) {
                    return api_1.API.v1.failure(e);
                }
            }
            // Register the user
            const userId = yield meteor_1.Meteor.callAsync('registerUser', Object.assign(Object.assign({}, params), (secretURL && { secretURL })));
            // Now set their username
            const { fields } = yield this.parseJsonQuery();
            yield (0, setUsername_1.setUsernameWithValidation)(userId, this.bodyParams.username);
            const user = yield models_1.Users.findOneById(userId, { projection: fields });
            if (!user) {
                return api_1.API.v1.failure('User not found');
            }
            if (this.bodyParams.customFields) {
                yield (0, saveCustomFields_1.saveCustomFields)(userId, this.bodyParams.customFields);
            }
            return api_1.API.v1.success({ user });
        });
    },
});
api_1.API.v1.addRoute('users.resetAvatar', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield (0, getUserFromParams_1.getUserFromParams)(this.bodyParams);
            if (server_1.settings.get('Accounts_AllowUserAvatarChange') && user._id === this.userId) {
                yield meteor_1.Meteor.callAsync('resetAvatar');
            }
            else if ((yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'edit-other-user-avatar')) ||
                (yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'manage-moderation-actions'))) {
                yield meteor_1.Meteor.callAsync('resetAvatar', user._id);
            }
            else {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Reset avatar is not allowed', {
                    method: 'users.resetAvatar',
                });
            }
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('users.createToken', { authRequired: true, deprecationVersion: '8.0.0' }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield (0, getUserFromParams_1.getUserFromParams)(this.bodyParams);
            const data = yield (0, createToken_1.generateAccessToken)(this.userId, user._id);
            return data ? api_1.API.v1.success({ data }) : api_1.API.v1.unauthorized();
        });
    },
});
api_1.API.v1.addRoute('users.getPreferences', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield models_1.Users.findOneById(this.userId);
            if (user === null || user === void 0 ? void 0 : user.settings) {
                const { preferences = {} } = user === null || user === void 0 ? void 0 : user.settings;
                preferences.language = user === null || user === void 0 ? void 0 : user.language;
                return api_1.API.v1.success({
                    preferences,
                });
            }
            return api_1.API.v1.failure(i18n_1.i18n.t('Accounts_Default_User_Preferences_not_available').toUpperCase());
        });
    },
});
api_1.API.v1.addRoute('users.forgotPassword', { authRequired: false }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const isPasswordResetEnabled = server_1.settings.get('Accounts_PasswordReset');
            if (!isPasswordResetEnabled) {
                return api_1.API.v1.failure('Password reset is not enabled');
            }
            const { email } = this.bodyParams;
            if (!email) {
                return api_1.API.v1.failure("The 'email' param is required");
            }
            yield meteor_1.Meteor.callAsync('sendForgotPasswordEmail', email.toLowerCase());
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('users.getUsernameSuggestion', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield meteor_1.Meteor.callAsync('getUsernameSuggestion');
            return api_1.API.v1.success({ result });
        });
    },
});
api_1.API.v1.addRoute('users.checkUsernameAvailability', {
    authRequired: true,
    validateParams: rest_typings_1.isUsersCheckUsernameAvailabilityParamsGET,
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { username } = this.queryParams;
            const result = yield (0, checkUsernameAvailability_1.checkUsernameAvailabilityWithValidation)(this.userId, username);
            return api_1.API.v1.success({ result });
        });
    },
});
api_1.API.v1.addRoute('users.generatePersonalAccessToken', { authRequired: true, twoFactorRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { tokenName, bypassTwoFactor } = this.bodyParams;
            if (!tokenName) {
                return api_1.API.v1.failure("The 'tokenName' param is required");
            }
            const token = yield meteor_1.Meteor.callAsync('personalAccessTokens:generateToken', { tokenName, bypassTwoFactor });
            return api_1.API.v1.success({ token });
        });
    },
});
api_1.API.v1.addRoute('users.regeneratePersonalAccessToken', { authRequired: true, twoFactorRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { tokenName } = this.bodyParams;
            if (!tokenName) {
                return api_1.API.v1.failure("The 'tokenName' param is required");
            }
            const token = yield meteor_1.Meteor.callAsync('personalAccessTokens:regenerateToken', { tokenName });
            return api_1.API.v1.success({ token });
        });
    },
});
api_1.API.v1.addRoute('users.getPersonalAccessTokens', { authRequired: true, permissionsRequired: ['create-personal-access-tokens'] }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const user = (yield models_1.Users.getLoginTokensByUserId(this.userId).toArray())[0];
            const isPersonalAccessToken = (loginToken) => 'type' in loginToken && loginToken.type === 'personalAccessToken';
            return api_1.API.v1.success({
                tokens: ((_c = (_b = (_a = user === null || user === void 0 ? void 0 : user.services) === null || _a === void 0 ? void 0 : _a.resume) === null || _b === void 0 ? void 0 : _b.loginTokens) === null || _c === void 0 ? void 0 : _c.filter(isPersonalAccessToken).map((loginToken) => ({
                    name: loginToken.name,
                    createdAt: loginToken.createdAt.toISOString(),
                    lastTokenPart: loginToken.lastTokenPart,
                    bypassTwoFactor: Boolean(loginToken.bypassTwoFactor),
                }))) || [],
            });
        });
    },
});
api_1.API.v1.addRoute('users.removePersonalAccessToken', { authRequired: true, twoFactorRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { tokenName } = this.bodyParams;
            if (!tokenName) {
                return api_1.API.v1.failure("The 'tokenName' param is required");
            }
            yield meteor_1.Meteor.callAsync('personalAccessTokens:removeToken', {
                tokenName,
            });
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('users.2fa.enableEmail', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const hasUnverifiedEmail = (_a = this.user.emails) === null || _a === void 0 ? void 0 : _a.some((email) => !email.verified);
            if (hasUnverifiedEmail) {
                throw new core_services_1.MeteorError('error-invalid-user', 'You need to verify your emails before setting up 2FA');
            }
            yield models_1.Users.enableEmail2FAByUserId(this.userId);
            // When 2FA is enable we logout all other clients
            const xAuthToken = this.request.headers['x-auth-token'];
            if (!xAuthToken) {
                return api_1.API.v1.success();
            }
            const hashedToken = accounts_base_1.Accounts._hashLoginToken(xAuthToken);
            if (!(yield models_1.Users.removeNonPATLoginTokensExcept(this.userId, hashedToken))) {
                throw new core_services_1.MeteorError('error-logging-out-other-clients', 'Error logging out other clients');
            }
            // TODO this can be optmized so places that care about loginTokens being removed are invoked directly
            // instead of having to listen to every watch.users event
            void (0, notifyListener_1.notifyOnUserChangeAsync)(() => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                const userTokens = yield models_1.Users.findOneById(this.userId, { projection: { 'services.resume.loginTokens': 1 } });
                if (!userTokens) {
                    return;
                }
                return {
                    clientAction: 'updated',
                    id: this.user._id,
                    diff: { 'services.resume.loginTokens': (_b = (_a = userTokens.services) === null || _a === void 0 ? void 0 : _a.resume) === null || _b === void 0 ? void 0 : _b.loginTokens },
                };
            }));
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('users.2fa.disableEmail', { authRequired: true, twoFactorRequired: true, twoFactorOptions: { disableRememberMe: true } }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.Users.disableEmail2FAByUserId(this.userId);
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('users.2fa.sendEmailCode', {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { emailOrUsername } = this.bodyParams;
            if (!emailOrUsername) {
                throw new meteor_1.Meteor.Error('error-parameter-required', 'emailOrUsername is required');
            }
            const method = emailOrUsername.includes('@') ? 'findOneByEmailAddress' : 'findOneByUsername';
            const userId = this.userId || ((_a = (yield models_1.Users[method](emailOrUsername, { projection: { _id: 1 } }))) === null || _a === void 0 ? void 0 : _a._id);
            if (!userId) {
                // this.logger.error('[2fa] User was not found when requesting 2fa email code');
                return api_1.API.v1.success();
            }
            const user = yield (0, code_1.getUserForCheck)(userId);
            if (!user) {
                // this.logger.error('[2fa] User was not found when requesting 2fa email code');
                return api_1.API.v1.success();
            }
            yield code_1.emailCheck.sendEmailCode(user);
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('users.sendConfirmationEmail', {
    authRequired: true,
    validateParams: rest_typings_1.isUsersSendConfirmationEmailParamsPOST,
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = this.bodyParams;
            if (yield meteor_1.Meteor.callAsync('sendConfirmationEmail', email)) {
                return api_1.API.v1.success();
            }
            return api_1.API.v1.failure();
        });
    },
});
api_1.API.v1.addRoute('users.presence', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            // if presence broadcast is disabled, return an empty array (all users are "offline")
            if (server_1.settings.get('Presence_broadcast_disabled')) {
                return api_1.API.v1.success({
                    users: [],
                    full: true,
                });
            }
            const { from, ids } = this.queryParams;
            const options = {
                projection: {
                    username: 1,
                    name: 1,
                    status: 1,
                    utcOffset: 1,
                    statusText: 1,
                    avatarETag: 1,
                },
            };
            if (ids) {
                return api_1.API.v1.success({
                    users: yield models_1.Users.findNotOfflineByIds(Array.isArray(ids) ? ids : ids.split(','), options).toArray(),
                    full: false,
                });
            }
            if (from) {
                const ts = new Date(from);
                const diff = (Date.now() - Number(ts)) / 1000 / 60;
                if (diff < 10) {
                    return api_1.API.v1.success({
                        users: yield models_1.Users.findNotIdUpdatedFrom(this.userId, ts, options).toArray(),
                        full: false,
                    });
                }
            }
            return api_1.API.v1.success({
                users: yield models_1.Users.findUsersNotOffline(options).toArray(),
                full: true,
            });
        });
    },
});
api_1.API.v1.addRoute('users.requestDataDownload', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { fullExport = false } = this.queryParams;
            const result = (yield meteor_1.Meteor.callAsync('requestDataDownload', { fullExport: fullExport === 'true' }));
            return api_1.API.v1.success({
                requested: Boolean(result.requested),
                exportOperation: result.exportOperation,
            });
        });
    },
});
api_1.API.v1.addRoute('users.logoutOtherClients', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            const xAuthToken = this.request.headers['x-auth-token'];
            if (!xAuthToken) {
                throw new meteor_1.Meteor.Error('error-parameter-required', 'x-auth-token is required');
            }
            const hashedToken = accounts_base_1.Accounts._hashLoginToken(xAuthToken);
            if (!(yield models_1.Users.removeNonPATLoginTokensExcept(this.userId, hashedToken))) {
                throw new meteor_1.Meteor.Error('error-invalid-user-id', 'Invalid user id');
            }
            const me = (yield models_1.Users.findOneById(this.userId, { projection: { 'services.resume.loginTokens': 1 } }));
            void (0, notifyListener_1.notifyOnUserChange)({
                clientAction: 'updated',
                id: this.userId,
                diff: { 'services.resume.loginTokens': (_b = (_a = me.services) === null || _a === void 0 ? void 0 : _a.resume) === null || _b === void 0 ? void 0 : _b.loginTokens },
            });
            const token = (_e = (_d = (_c = me.services) === null || _c === void 0 ? void 0 : _c.resume) === null || _d === void 0 ? void 0 : _d.loginTokens) === null || _e === void 0 ? void 0 : _e.find((token) => token.hashedToken === hashedToken);
            const loginExp = server_1.settings.get('Accounts_LoginExpiration');
            const tokenExpires = (token && 'when' in token && new Date(token.when.getTime() + (0, tools_1.getLoginExpirationInMs)(loginExp))) || undefined;
            return api_1.API.v1.success({
                token: xAuthToken,
                tokenExpires: (tokenExpires === null || tokenExpires === void 0 ? void 0 : tokenExpires.toISOString()) || '',
            });
        });
    },
});
api_1.API.v1.addRoute('users.autocomplete', { authRequired: true, validateParams: rest_typings_1.isUsersAutocompleteProps }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { selector: selectorRaw } = this.queryParams;
            const selector = JSON.parse(selectorRaw);
            try {
                if ((selector === null || selector === void 0 ? void 0 : selector.conditions) && !(0, isValidQuery_1.isValidQuery)(selector.conditions, ['*'], ['$or', '$and'])) {
                    throw new Error('error-invalid-query');
                }
            }
            catch (e) {
                return api_1.API.v1.failure(e);
            }
            return api_1.API.v1.success(yield (0, users_1.findUsersToAutocomplete)({
                uid: this.userId,
                selector,
            }));
        });
    },
});
api_1.API.v1.addRoute('users.removeOtherTokens', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            return api_1.API.v1.success(yield meteor_1.Meteor.callAsync('removeOtherTokens'));
        });
    },
});
api_1.API.v1.addRoute('users.resetE2EKey', { authRequired: true, twoFactorRequired: true, twoFactorOptions: { disableRememberMe: true } }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            if ('userId' in this.bodyParams || 'username' in this.bodyParams || 'user' in this.bodyParams) {
                // reset other user keys
                const user = yield (0, getUserFromParams_1.getUserFromParams)(this.bodyParams);
                if (!user) {
                    throw new meteor_1.Meteor.Error('error-invalid-user-id', 'Invalid user id');
                }
                if (!(yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'edit-other-user-e2ee'))) {
                    throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed');
                }
                if (!(yield (0, resetUserE2EKey_1.resetUserE2EEncriptionKey)(user._id, true))) {
                    return api_1.API.v1.failure();
                }
                return api_1.API.v1.success();
            }
            yield (0, resetUserE2EKey_1.resetUserE2EEncriptionKey)(this.userId, false);
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('users.resetTOTP', { authRequired: true, twoFactorRequired: true, twoFactorOptions: { disableRememberMe: true } }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            // // reset own keys
            if ('userId' in this.bodyParams || 'username' in this.bodyParams || 'user' in this.bodyParams) {
                // reset other user keys
                if (!(yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'edit-other-user-totp'))) {
                    throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed');
                }
                if (!server_1.settings.get('Accounts_TwoFactorAuthentication_Enabled')) {
                    throw new meteor_1.Meteor.Error('error-two-factor-not-enabled', 'Two factor authentication is not enabled');
                }
                const user = yield (0, getUserFromParams_1.getUserFromParams)(this.bodyParams);
                if (!user) {
                    throw new meteor_1.Meteor.Error('error-invalid-user-id', 'Invalid user id');
                }
                yield (0, resetTOTP_1.resetTOTP)(user._id, true);
                return api_1.API.v1.success();
            }
            yield (0, resetTOTP_1.resetTOTP)(this.userId, false);
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('users.listTeams', { authRequired: true, validateParams: rest_typings_1.isUsersListTeamsProps }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.queryParams, check_1.Match.ObjectIncluding({
                userId: check_1.Match.Maybe(String),
            }));
            const { userId } = this.queryParams;
            // If the caller has permission to view all teams, there's no need to filter the teams
            const adminId = (yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'view-all-teams')) ? undefined : this.userId;
            const teams = yield core_services_1.Team.findBySubscribedUserIds(userId, adminId);
            return api_1.API.v1.success({
                teams,
            });
        });
    },
});
api_1.API.v1.addRoute('users.logout', { authRequired: true, validateParams: rest_typings_1.isUserLogoutParamsPOST }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = this.bodyParams.userId || this.userId;
            if (userId !== this.userId && !(yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'logout-other-user'))) {
                return api_1.API.v1.unauthorized();
            }
            // this method logs the user out automatically, if successful returns 1, otherwise 0
            if (!(yield models_1.Users.unsetLoginTokens(userId))) {
                throw new meteor_1.Meteor.Error('error-invalid-user-id', 'Invalid user id');
            }
            void (0, notifyListener_1.notifyOnUserChange)({ clientAction: 'updated', id: userId, diff: { 'services.resume.loginTokens': [] } });
            return api_1.API.v1.success({
                message: `User ${userId} has been logged out!`,
            });
        });
    },
});
api_1.API.v1.addRoute('users.getPresence', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            if ((0, isUserFromParams_1.isUserFromParams)(this.queryParams, this.userId, this.user)) {
                const user = yield models_1.Users.findOneById(this.userId);
                return api_1.API.v1.success(Object.assign({ presence: ((user === null || user === void 0 ? void 0 : user.status) || 'offline'), connectionStatus: (user === null || user === void 0 ? void 0 : user.statusConnection) || 'offline' }, ((user === null || user === void 0 ? void 0 : user.lastLogin) && { lastLogin: user === null || user === void 0 ? void 0 : user.lastLogin })));
            }
            const user = yield (0, getUserFromParams_1.getUserFromParams)(this.queryParams);
            return api_1.API.v1.success({
                presence: user.status || 'offline',
            });
        });
    },
});
api_1.API.v1.addRoute('users.setStatus', { authRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.bodyParams, check_1.Match.OneOf(check_1.Match.ObjectIncluding({
                status: check_1.Match.Maybe(String),
                message: String,
            }), check_1.Match.ObjectIncluding({
                status: String,
                message: check_1.Match.Maybe(String),
            })));
            if (!server_1.settings.get('Accounts_AllowUserStatusMessageChange')) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Change status is not allowed', {
                    method: 'users.setStatus',
                });
            }
            const user = yield (() => __awaiter(this, void 0, void 0, function* () {
                if ((0, isUserFromParams_1.isUserFromParams)(this.bodyParams, this.userId, this.user)) {
                    return models_1.Users.findOneById(this.userId);
                }
                if (yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'edit-other-user-info')) {
                    return (0, getUserFromParams_1.getUserFromParams)(this.bodyParams);
                }
            }))();
            if (!user) {
                return api_1.API.v1.unauthorized();
            }
            // TODO refactor to not update the user twice (one inside of `setStatusText` and then later just the status + statusDefault)
            if (this.bodyParams.message || this.bodyParams.message === '') {
                yield (0, setStatusText_1.setStatusText)(user._id, this.bodyParams.message);
            }
            if (this.bodyParams.status) {
                const validStatus = ['online', 'away', 'offline', 'busy'];
                if (validStatus.includes(this.bodyParams.status)) {
                    const { status } = this.bodyParams;
                    if (status === 'offline' && !server_1.settings.get('Accounts_AllowInvisibleStatusOption')) {
                        throw new meteor_1.Meteor.Error('error-status-not-allowed', 'Invisible status is disabled', {
                            method: 'users.setStatus',
                        });
                    }
                    yield models_1.Users.updateOne({ _id: user._id }, {
                        $set: {
                            status,
                            statusDefault: status,
                        },
                    });
                    const { _id, username, statusText, roles, name } = user;
                    void core_services_1.api.broadcast('presence.status', {
                        user: { status, _id, username, statusText, roles, name },
                        previousStatus: user.status,
                    });
                }
                else {
                    throw new meteor_1.Meteor.Error('error-invalid-status', 'Valid status types include online, away, offline, and busy.', {
                        method: 'users.setStatus',
                    });
                }
            }
            return api_1.API.v1.success();
        });
    },
});
// status: 'online' | 'offline' | 'away' | 'busy';
// message?: string;
// _id: string;
// connectionStatus?: 'online' | 'offline' | 'away' | 'busy';
// };
api_1.API.v1.addRoute('users.getStatus', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            if ((0, isUserFromParams_1.isUserFromParams)(this.queryParams, this.userId, this.user)) {
                const user = yield models_1.Users.findOneById(this.userId);
                return api_1.API.v1.success({
                    _id: user === null || user === void 0 ? void 0 : user._id,
                    // message: user.statusText,
                    connectionStatus: ((user === null || user === void 0 ? void 0 : user.statusConnection) || 'offline'),
                    status: ((user === null || user === void 0 ? void 0 : user.status) || 'offline'),
                });
            }
            const user = yield (0, getUserFromParams_1.getUserFromParams)(this.queryParams);
            return api_1.API.v1.success({
                _id: user._id,
                // message: user.statusText,
                status: (user.status || 'offline'),
            });
        });
    },
});
server_1.settings.watch('Rate_Limiter_Limit_RegisterUser', (value) => {
    const userRegisterRoute = '/api/v1/users.registerpost';
    api_1.API.v1.updateRateLimiterDictionaryForRoute(userRegisterRoute, value);
});
