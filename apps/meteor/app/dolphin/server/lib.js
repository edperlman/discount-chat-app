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
const meteor_1 = require("meteor/meteor");
const service_configuration_1 = require("meteor/service-configuration");
const callbacks_1 = require("../../../lib/callbacks");
const beforeCreateUserCallback_1 = require("../../../lib/callbacks/beforeCreateUserCallback");
const custom_oauth_server_1 = require("../../custom-oauth/server/custom_oauth_server");
const server_1 = require("../../settings/server");
const config = {
    serverURL: '',
    authorizePath: '/m/oauth2/auth/',
    tokenPath: '/m/oauth2/token/',
    identityPath: '/m/oauth2/api/me/',
    scope: 'basic',
    addAutopublishFields: {
        forLoggedInUser: ['services.dolphin'],
        forOtherUsers: ['services.dolphin.name'],
    },
    accessTokenParam: 'access_token',
};
const Dolphin = new custom_oauth_server_1.CustomOAuth('dolphin', config);
function DolphinOnCreateUser(options, user) {
    var _a, _b;
    // TODO: callbacks Fix this
    if ((_b = (_a = user === null || user === void 0 ? void 0 : user.services) === null || _a === void 0 ? void 0 : _a.dolphin) === null || _b === void 0 ? void 0 : _b.NickName) {
        user.username = user.services.dolphin.NickName;
    }
    return options;
}
meteor_1.Meteor.startup(() => __awaiter(void 0, void 0, void 0, function* () {
    server_1.settings.watch('Accounts_OAuth_Dolphin_URL', (value) => {
        config.serverURL = value;
        return Dolphin.configure(config);
    });
    if (server_1.settings.get('Accounts_OAuth_Dolphin_URL')) {
        const data = {
            buttonLabelText: server_1.settings.get('Accounts_OAuth_Dolphin_button_label_text'),
            buttonColor: server_1.settings.get('Accounts_OAuth_Dolphin_button_color'),
            buttonLabelColor: server_1.settings.get('Accounts_OAuth_Dolphin_button_label_color'),
            clientId: server_1.settings.get('Accounts_OAuth_Dolphin_id'),
            secret: server_1.settings.get('Accounts_OAuth_Dolphin_secret'),
            serverURL: server_1.settings.get('Accounts_OAuth_Dolphin_URL'),
            loginStyle: server_1.settings.get('Accounts_OAuth_Dolphin_login_style'),
        };
        yield service_configuration_1.ServiceConfiguration.configurations.upsertAsync({ service: 'dolphin' }, { $set: data });
    }
    beforeCreateUserCallback_1.beforeCreateUserCallback.add(DolphinOnCreateUser, callbacks_1.callbacks.priority.HIGH, 'dolphin');
}));
