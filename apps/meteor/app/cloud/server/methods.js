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
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const buildRegistrationData_1 = require("./functions/buildRegistrationData");
const checkUserHasCloudLogin_1 = require("./functions/checkUserHasCloudLogin");
const connectWorkspace_1 = require("./functions/connectWorkspace");
const finishOAuthAuthorization_1 = require("./functions/finishOAuthAuthorization");
const getOAuthAuthorizationUrl_1 = require("./functions/getOAuthAuthorizationUrl");
const retrieveRegistrationStatus_1 = require("./functions/retrieveRegistrationStatus");
const startRegisterWorkspace_1 = require("./functions/startRegisterWorkspace");
const syncWorkspace_1 = require("./functions/syncWorkspace");
const userLogout_1 = require("./functions/userLogout");
const hasPermission_1 = require("../../authorization/server/functions/hasPermission");
meteor_1.Meteor.methods({
    /**
     * @deprecated this method is deprecated and will be removed soon.
     * Prefer using cloud.registrationStatus rest api.
     */
    'cloud:checkRegisterStatus'() {
        return __awaiter(this, void 0, void 0, function* () {
            const uid = meteor_1.Meteor.userId();
            if (!uid) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'cloud:checkRegisterStatus',
                });
            }
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(uid, 'manage-cloud'))) {
                throw new meteor_1.Meteor.Error('error-not-authorized', 'Not authorized', {
                    method: 'cloud:checkRegisterStatus',
                });
            }
            return (0, retrieveRegistrationStatus_1.retrieveRegistrationStatus)();
        });
    },
    'cloud:getWorkspaceRegisterData'() {
        return __awaiter(this, void 0, void 0, function* () {
            const uid = meteor_1.Meteor.userId();
            if (!uid) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'cloud:getWorkspaceRegisterData',
                });
            }
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(uid, 'manage-cloud'))) {
                throw new meteor_1.Meteor.Error('error-not-authorized', 'Not authorized', {
                    method: 'cloud:getWorkspaceRegisterData',
                });
            }
            return Buffer.from(JSON.stringify(yield (0, buildRegistrationData_1.buildWorkspaceRegistrationData)(undefined))).toString('base64');
        });
    },
    'cloud:registerWorkspace'() {
        return __awaiter(this, void 0, void 0, function* () {
            const uid = meteor_1.Meteor.userId();
            if (!uid) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'cloud:registerWorkspace',
                });
            }
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(uid, 'manage-cloud'))) {
                throw new meteor_1.Meteor.Error('error-not-authorized', 'Not authorized', {
                    method: 'cloud:registerWorkspace',
                });
            }
            return (0, startRegisterWorkspace_1.startRegisterWorkspace)();
        });
    },
    'cloud:syncWorkspace'() {
        return __awaiter(this, void 0, void 0, function* () {
            const uid = meteor_1.Meteor.userId();
            if (!uid) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'cloud:syncWorkspace',
                });
            }
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(uid, 'manage-cloud'))) {
                throw new meteor_1.Meteor.Error('error-not-authorized', 'Not authorized', {
                    method: 'cloud:syncWorkspace',
                });
            }
            yield (0, syncWorkspace_1.syncWorkspace)();
            return true;
        });
    },
    'cloud:connectWorkspace'(token) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(token, String);
            const uid = meteor_1.Meteor.userId();
            if (!uid) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'cloud:connectWorkspace',
                });
            }
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(uid, 'manage-cloud'))) {
                throw new meteor_1.Meteor.Error('error-not-authorized', 'Not authorized', {
                    method: 'cloud:connectWorkspace',
                });
            }
            if (!token) {
                throw new meteor_1.Meteor.Error('error-invalid-payload', 'Token is required.', {
                    method: 'cloud:connectWorkspace',
                });
            }
            return (0, connectWorkspace_1.connectWorkspace)(token);
        });
    },
    // Currently unused but will link local account to Rocket.Chat Cloud account.
    'cloud:getOAuthAuthorizationUrl'() {
        return __awaiter(this, void 0, void 0, function* () {
            const uid = meteor_1.Meteor.userId();
            if (!uid) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'cloud:getOAuthAuthorizationUrl',
                });
            }
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(uid, 'manage-cloud'))) {
                throw new meteor_1.Meteor.Error('error-not-authorized', 'Not authorized', {
                    method: 'cloud:getOAuthAuthorizationUrl',
                });
            }
            return (0, getOAuthAuthorizationUrl_1.getOAuthAuthorizationUrl)();
        });
    },
    'cloud:finishOAuthAuthorization'(code, state) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(code, String);
            (0, check_1.check)(state, String);
            const uid = meteor_1.Meteor.userId();
            if (!uid) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'cloud:finishOAuthAuthorization',
                });
            }
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(uid, 'manage-cloud'))) {
                throw new meteor_1.Meteor.Error('error-not-authorized', 'Not authorized', {
                    method: 'cloud:finishOAuthAuthorization',
                });
            }
            return (0, finishOAuthAuthorization_1.finishOAuthAuthorization)(code, state);
        });
    },
    'cloud:checkUserLoggedIn'() {
        return __awaiter(this, void 0, void 0, function* () {
            const uid = meteor_1.Meteor.userId();
            if (!uid) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'cloud:checkUserLoggedIn',
                });
            }
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(uid, 'manage-cloud'))) {
                throw new meteor_1.Meteor.Error('error-not-authorized', 'Not authorized', {
                    method: 'cloud:checkUserLoggedIn',
                });
            }
            return (0, checkUserHasCloudLogin_1.checkUserHasCloudLogin)(uid);
        });
    },
    'cloud:logout'() {
        return __awaiter(this, void 0, void 0, function* () {
            const uid = meteor_1.Meteor.userId();
            if (!uid) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'cloud:logout',
                });
            }
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(uid, 'manage-cloud'))) {
                throw new meteor_1.Meteor.Error('error-not-authorized', 'Not authorized', {
                    method: 'cloud:logout',
                });
            }
            return (0, userLogout_1.userLogout)(uid);
        });
    },
});
