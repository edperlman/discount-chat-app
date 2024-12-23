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
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const rest_typings_1 = require("@rocket.chat/rest-typings");
const meteor_1 = require("meteor/meteor");
const underscore_1 = __importDefault(require("underscore"));
const auditedSettingUpdates_1 = require("../../../../server/settings/lib/auditedSettingUpdates");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const disableCustomScripts_1 = require("../../../lib/server/functions/disableCustomScripts");
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
const server_1 = require("../../../settings/server");
const raw_1 = require("../../../settings/server/raw");
const api_1 = require("../api");
const getPaginationItems_1 = require("../helpers/getPaginationItems");
function fetchSettings(query, sort, offset, count, fields) {
    return __awaiter(this, void 0, void 0, function* () {
        const { cursor, totalCount } = models_1.Settings.findPaginated(query || {}, {
            sort: sort || { _id: 1 },
            skip: offset,
            limit: count,
            projection: Object.assign({ _id: 1, value: 1, enterprise: 1, invalidValue: 1, modules: 1 }, fields),
        });
        const [settings, total] = yield Promise.all([cursor.toArray(), totalCount]);
        server_1.SettingsEvents.emit('fetch-settings', settings);
        return { settings, totalCount: total };
    });
}
// settings endpoints
api_1.API.v1.addRoute('settings.public', { authRequired: false, validateParams: rest_typings_1.isSettingsPublicWithPaginationProps }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort, fields, query } = yield this.parseJsonQuery();
            const { _id } = this.queryParams;
            const parsedQueryId = typeof _id === 'string' && _id ? { _id: { $in: _id.split(',').map((id) => id.trim()) } } : {};
            const ourQuery = Object.assign(Object.assign(Object.assign({}, query), parsedQueryId), { hidden: { $ne: true }, public: true });
            const { settings, totalCount: total } = yield fetchSettings(ourQuery, sort, offset, count, fields);
            return api_1.API.v1.success({
                settings,
                count: settings.length,
                offset,
                total,
            });
        });
    },
});
api_1.API.v1.addRoute('settings.oauth', { authRequired: false }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const oAuthServicesEnabled = yield models_1.LoginServiceConfiguration.find({}, { projection: { secret: 0 } }).toArray();
            return api_1.API.v1.success({
                services: oAuthServicesEnabled.map((service) => {
                    if (!service) {
                        return service;
                    }
                    if (service.custom || (service.service && ['saml', 'cas', 'wordpress'].includes(service.service))) {
                        return Object.assign({}, service);
                    }
                    return {
                        _id: service._id,
                        name: service.service,
                        clientId: service.appId ||
                            service.clientId ||
                            service.consumerKey,
                        buttonLabelText: service.buttonLabelText || '',
                        buttonColor: service.buttonColor || '',
                        buttonLabelColor: service.buttonLabelColor || '',
                        custom: false,
                    };
                }),
            });
        });
    },
});
api_1.API.v1.addRoute('settings.addCustomOAuth', { authRequired: true, twoFactorRequired: true }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!((_a = this.bodyParams.name) === null || _a === void 0 ? void 0 : _a.trim())) {
                throw new meteor_1.Meteor.Error('error-name-param-not-provided', 'The parameter "name" is required');
            }
            yield meteor_1.Meteor.callAsync('addOAuthService', this.bodyParams.name, this.userId);
            return api_1.API.v1.success();
        });
    },
});
api_1.API.v1.addRoute('settings', { authRequired: true }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset, count } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { sort, fields, query } = yield this.parseJsonQuery();
            let ourQuery = {
                hidden: { $ne: true },
            };
            if (!(yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'view-privileged-setting'))) {
                ourQuery.public = true;
            }
            ourQuery = Object.assign({}, query, ourQuery);
            const { settings, totalCount: total } = yield fetchSettings(ourQuery, sort, offset, count, fields);
            return api_1.API.v1.success({
                settings,
                count: settings.length,
                offset,
                total,
            });
        });
    },
});
api_1.API.v1.addRoute('settings/:_id', {
    authRequired: true,
    permissionsRequired: {
        GET: { permissions: ['view-privileged-setting'], operation: 'hasAll' },
        POST: { permissions: ['edit-privileged-setting'], operation: 'hasAll' },
    },
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const setting = yield models_1.Settings.findOneNotHiddenById(this.urlParams._id);
            if (!setting) {
                return api_1.API.v1.failure();
            }
            return api_1.API.v1.success(underscore_1.default.pick(setting, '_id', 'value'));
        });
    },
    post: {
        twoFactorRequired: true,
        action() {
            return __awaiter(this, void 0, void 0, function* () {
                if (typeof this.urlParams._id !== 'string') {
                    throw new meteor_1.Meteor.Error('error-id-param-not-provided', 'The parameter "id" is required');
                }
                // Disable custom scripts in cloud trials to prevent phishing campaigns
                if ((0, disableCustomScripts_1.disableCustomScripts)() && /^Custom_Script_/.test(this.urlParams._id)) {
                    return api_1.API.v1.unauthorized();
                }
                // allow special handling of particular setting types
                const setting = yield models_1.Settings.findOneNotHiddenById(this.urlParams._id);
                if (!setting) {
                    return api_1.API.v1.failure();
                }
                if ((0, core_typings_1.isSettingAction)(setting) && (0, rest_typings_1.isSettingsUpdatePropsActions)(this.bodyParams) && this.bodyParams.execute) {
                    // execute the configured method
                    yield meteor_1.Meteor.callAsync(setting.value);
                    return api_1.API.v1.success();
                }
                const auditSettingOperation = (0, auditedSettingUpdates_1.updateAuditedByUser)({
                    _id: this.userId,
                    username: this.user.username,
                    ip: this.requestIp,
                    useragent: this.request.headers['user-agent'] || '',
                });
                if ((0, core_typings_1.isSettingColor)(setting) && (0, rest_typings_1.isSettingsUpdatePropsColor)(this.bodyParams)) {
                    const updateOptionsPromise = models_1.Settings.updateOptionsById(this.urlParams._id, { editor: this.bodyParams.editor });
                    const updateValuePromise = auditSettingOperation(models_1.Settings.updateValueNotHiddenById, this.urlParams._id, this.bodyParams.value);
                    const [updateOptionsResult, updateValueResult] = yield Promise.all([updateOptionsPromise, updateValuePromise]);
                    if (updateOptionsResult.modifiedCount || updateValueResult.modifiedCount) {
                        yield (0, notifyListener_1.notifyOnSettingChangedById)(this.urlParams._id);
                    }
                    return api_1.API.v1.success();
                }
                if ((0, rest_typings_1.isSettingsUpdatePropDefault)(this.bodyParams)) {
                    const { matchedCount } = yield auditSettingOperation(models_1.Settings.updateValueNotHiddenById, this.urlParams._id, this.bodyParams.value);
                    if (!matchedCount) {
                        return api_1.API.v1.failure();
                    }
                    const s = yield models_1.Settings.findOneNotHiddenById(this.urlParams._id);
                    if (!s) {
                        return api_1.API.v1.failure();
                    }
                    server_1.settings.set(s);
                    (0, raw_1.setValue)(this.urlParams._id, this.bodyParams.value);
                    yield (0, notifyListener_1.notifyOnSettingChanged)(s);
                    return api_1.API.v1.success();
                }
                return api_1.API.v1.failure();
            });
        },
    },
});
api_1.API.v1.addRoute('service.configurations', { authRequired: false }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            return api_1.API.v1.success({
                configurations: yield models_1.LoginServiceConfiguration.find({}, { projection: { secret: 0 } }).toArray(),
            });
        });
    },
});
