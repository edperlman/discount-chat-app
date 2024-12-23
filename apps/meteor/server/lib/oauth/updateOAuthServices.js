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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOAuthServices = updateOAuthServices;
const models_1 = require("@rocket.chat/models");
const logger_1 = require("./logger");
const custom_oauth_server_1 = require("../../../app/custom-oauth/server/custom_oauth_server");
const notifyListener_1 = require("../../../app/lib/server/lib/notifyListener");
const cached_1 = require("../../../app/settings/server/cached");
function updateOAuthServices() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        const services = cached_1.settings.getByRegexp(/^(Accounts_OAuth_|Accounts_OAuth_Custom-)[a-z0-9_]+$/i);
        const filteredServices = services.filter(([, value]) => typeof value === 'boolean');
        try {
            for (var _d = true, filteredServices_1 = __asyncValues(filteredServices), filteredServices_1_1; filteredServices_1_1 = yield filteredServices_1.next(), _a = filteredServices_1_1.done, !_a; _d = true) {
                _c = filteredServices_1_1.value;
                _d = false;
                const [key, value] = _c;
                logger_1.logger.debug({ oauth_updated: key });
                let serviceName = key.replace('Accounts_OAuth_', '');
                if (serviceName === 'Meteor') {
                    serviceName = 'meteor-developer';
                }
                if (/Accounts_OAuth_Custom-/.test(key)) {
                    serviceName = key.replace('Accounts_OAuth_Custom-', '');
                }
                const serviceKey = serviceName.toLowerCase();
                if (value === true) {
                    const data = {
                        clientId: cached_1.settings.get(`${key}_id`),
                        secret: cached_1.settings.get(`${key}_secret`),
                    };
                    if (/Accounts_OAuth_Custom-/.test(key)) {
                        data.custom = true;
                        data.clientId = cached_1.settings.get(`${key}-id`);
                        data.secret = cached_1.settings.get(`${key}-secret`);
                        data.serverURL = cached_1.settings.get(`${key}-url`);
                        data.tokenPath = cached_1.settings.get(`${key}-token_path`);
                        data.identityPath = cached_1.settings.get(`${key}-identity_path`);
                        data.authorizePath = cached_1.settings.get(`${key}-authorize_path`);
                        data.scope = cached_1.settings.get(`${key}-scope`);
                        data.accessTokenParam = cached_1.settings.get(`${key}-access_token_param`);
                        data.buttonLabelText = cached_1.settings.get(`${key}-button_label_text`);
                        data.buttonLabelColor = cached_1.settings.get(`${key}-button_label_color`);
                        data.loginStyle = cached_1.settings.get(`${key}-login_style`);
                        data.buttonColor = cached_1.settings.get(`${key}-button_color`);
                        data.tokenSentVia = cached_1.settings.get(`${key}-token_sent_via`);
                        data.identityTokenSentVia = cached_1.settings.get(`${key}-identity_token_sent_via`);
                        data.keyField = cached_1.settings.get(`${key}-key_field`);
                        data.usernameField = cached_1.settings.get(`${key}-username_field`);
                        data.emailField = cached_1.settings.get(`${key}-email_field`);
                        data.nameField = cached_1.settings.get(`${key}-name_field`);
                        data.avatarField = cached_1.settings.get(`${key}-avatar_field`);
                        data.rolesClaim = cached_1.settings.get(`${key}-roles_claim`);
                        data.groupsClaim = cached_1.settings.get(`${key}-groups_claim`);
                        data.channelsMap = cached_1.settings.get(`${key}-groups_channel_map`);
                        data.channelsAdmin = cached_1.settings.get(`${key}-channels_admin`);
                        data.mergeUsers = cached_1.settings.get(`${key}-merge_users`);
                        data.mergeUsersDistinctServices = cached_1.settings.get(`${key}-merge_users_distinct_services`);
                        data.mapChannels = cached_1.settings.get(`${key}-map_channels`);
                        data.mergeRoles = cached_1.settings.get(`${key}-merge_roles`);
                        data.rolesToSync = cached_1.settings.get(`${key}-roles_to_sync`);
                        data.showButton = cached_1.settings.get(`${key}-show_button`);
                        new custom_oauth_server_1.CustomOAuth(serviceKey, {
                            serverURL: data.serverURL,
                            tokenPath: data.tokenPath,
                            identityPath: data.identityPath,
                            authorizePath: data.authorizePath,
                            scope: data.scope,
                            loginStyle: data.loginStyle,
                            tokenSentVia: data.tokenSentVia,
                            identityTokenSentVia: data.identityTokenSentVia,
                            keyField: data.keyField,
                            usernameField: data.usernameField,
                            emailField: data.emailField,
                            nameField: data.nameField,
                            avatarField: data.avatarField,
                            rolesClaim: data.rolesClaim,
                            groupsClaim: data.groupsClaim,
                            mapChannels: data.mapChannels,
                            channelsMap: data.channelsMap,
                            channelsAdmin: data.channelsAdmin,
                            mergeUsers: data.mergeUsers,
                            mergeUsersDistinctServices: data.mergeUsersDistinctServices,
                            mergeRoles: data.mergeRoles,
                            rolesToSync: data.rolesToSync,
                            accessTokenParam: data.accessTokenParam,
                            showButton: data.showButton,
                        });
                    }
                    if (serviceName === 'Facebook') {
                        data.appId = data.clientId;
                        delete data.clientId;
                    }
                    if (serviceName === 'Twitter') {
                        data.consumerKey = data.clientId;
                        delete data.clientId;
                    }
                    if (serviceName === 'Linkedin') {
                        data.clientConfig = {
                            requestPermissions: ['openid', 'email', 'profile'],
                        };
                    }
                    if (serviceName === 'Nextcloud') {
                        data.buttonLabelText = cached_1.settings.get('Accounts_OAuth_Nextcloud_button_label_text');
                        data.buttonLabelColor = cached_1.settings.get('Accounts_OAuth_Nextcloud_button_label_color');
                        data.buttonColor = cached_1.settings.get('Accounts_OAuth_Nextcloud_button_color');
                    }
                    yield models_1.LoginServiceConfiguration.createOrUpdateService(serviceKey, data);
                    void (0, notifyListener_1.notifyOnLoginServiceConfigurationChangedByService)(serviceKey);
                }
                else {
                    const service = yield models_1.LoginServiceConfiguration.findOneByService(serviceName, { projection: { _id: 1 } });
                    if (service === null || service === void 0 ? void 0 : service._id) {
                        const { deletedCount } = yield models_1.LoginServiceConfiguration.removeService(service._id);
                        if (deletedCount > 0) {
                            void (0, notifyListener_1.notifyOnLoginServiceConfigurationChanged)({ _id: service._id }, 'removed');
                        }
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = filteredServices_1.return)) yield _b.call(filteredServices_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
}
