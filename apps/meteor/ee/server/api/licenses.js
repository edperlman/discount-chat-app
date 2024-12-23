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
const license_1 = require("@rocket.chat/license");
const models_1 = require("@rocket.chat/models");
const rest_typings_1 = require("@rocket.chat/rest-typings");
const check_1 = require("meteor/check");
const api_1 = require("../../../app/api/server/api");
const hasPermission_1 = require("../../../app/authorization/server/functions/hasPermission");
const notifyListener_1 = require("../../../app/lib/server/lib/notifyListener");
const auditedSettingUpdates_1 = require("../../../server/settings/lib/auditedSettingUpdates");
api_1.API.v1.addRoute('licenses.info', { authRequired: true, validateParams: rest_typings_1.isLicensesInfoProps }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const unrestrictedAccess = yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'view-privileged-setting');
            const loadCurrentValues = unrestrictedAccess && Boolean(this.queryParams.loadValues);
            const license = yield license_1.License.getInfo({ limits: unrestrictedAccess, license: unrestrictedAccess, currentValues: loadCurrentValues });
            return api_1.API.v1.success({ license });
        });
    },
});
api_1.API.v1.addRoute('licenses.add', { authRequired: true, permissionsRequired: ['edit-privileged-setting'] }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(this.bodyParams, {
                license: String,
            });
            const { license } = this.bodyParams;
            if (!(yield license_1.License.validateFormat(license))) {
                return api_1.API.v1.failure('Invalid license');
            }
            const auditSettingOperation = (0, auditedSettingUpdates_1.updateAuditedByUser)({
                _id: this.userId,
                username: this.user.username,
                ip: this.requestIp,
                useragent: this.request.headers['user-agent'] || '',
            });
            (yield auditSettingOperation(models_1.Settings.updateValueById, 'Enterprise_License', license)).modifiedCount &&
                void (0, notifyListener_1.notifyOnSettingChangedById)('Enterprise_License');
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('licenses.maxActiveUsers', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const maxActiveUsers = license_1.License.getMaxActiveUsers();
            const activeUsers = yield models_1.Users.getActiveLocalUserCount();
            return api_1.API.v1.success({ maxActiveUsers: maxActiveUsers > 0 ? maxActiveUsers : null, activeUsers });
        });
    },
});
