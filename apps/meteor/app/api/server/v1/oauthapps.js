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
const rest_typings_1 = require("@rocket.chat/rest-typings");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const deprecationWarningLogger_1 = require("../../../lib/server/lib/deprecationWarningLogger");
const addOAuthApp_1 = require("../../../oauth2-server-config/server/admin/functions/addOAuthApp");
const api_1 = require("../api");
api_1.API.v1.addRoute('oauth-apps.list', { authRequired: true, permissionsRequired: ['manage-oauth-apps'] }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            return api_1.API.v1.success({
                oauthApps: yield models_1.OAuthApps.find().toArray(),
            });
        });
    },
});
api_1.API.v1.addRoute('oauth-apps.get', { authRequired: true, validateParams: rest_typings_1.isOauthAppsGetParams }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const isOAuthAppsManager = yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'manage-oauth-apps');
            const oauthApp = yield models_1.OAuthApps.findOneAuthAppByIdOrClientId(this.queryParams, !isOAuthAppsManager ? { projection: { clientSecret: 0 } } : {});
            if (!oauthApp) {
                return api_1.API.v1.failure('OAuth app not found.');
            }
            if ('appId' in this.queryParams) {
                deprecationWarningLogger_1.apiDeprecationLogger.parameter(this.request.route, 'appId', '7.0.0', this.response);
            }
            return api_1.API.v1.success({
                oauthApp,
            });
        });
    },
});
api_1.API.v1.addRoute('oauth-apps.update', {
    authRequired: true,
    validateParams: rest_typings_1.isUpdateOAuthAppParams,
    permissionsRequired: ['manage-oauth-apps'],
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { appId } = this.bodyParams;
            const result = yield Meteor.callAsync('updateOAuthApp', appId, this.bodyParams);
            return api_1.API.v1.success(result);
        });
    },
});
api_1.API.v1.addRoute('oauth-apps.delete', {
    authRequired: true,
    validateParams: rest_typings_1.isDeleteOAuthAppParams,
    permissionsRequired: ['manage-oauth-apps'],
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { appId } = this.bodyParams;
            const result = yield Meteor.callAsync('deleteOAuthApp', appId);
            return api_1.API.v1.success(result);
        });
    },
});
api_1.API.v1.addRoute('oauth-apps.create', {
    authRequired: true,
    validateParams: rest_typings_1.isOauthAppsAddParams,
    permissionsRequired: ['manage-oauth-apps'],
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const application = yield (0, addOAuthApp_1.addOAuthApp)(this.bodyParams, this.userId);
            return api_1.API.v1.success({ application });
        });
    },
});
