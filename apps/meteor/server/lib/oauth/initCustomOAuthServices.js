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
exports.initCustomOAuthServices = initCustomOAuthServices;
const addOAuthService_1 = require("./addOAuthService");
function initCustomOAuthServices() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        try {
            // Add settings for custom OAuth providers to the settings so they get
            // automatically added when they are defined in ENV variables
            for (var _d = true, _e = __asyncValues(Object.keys(process.env)), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                _c = _f.value;
                _d = false;
                const key = _c;
                if (/Accounts_OAuth_Custom_[a-zA-Z0-9_-]+$/.test(key)) {
                    // Most all shells actually prohibit the usage of - in environment variables
                    // So this will allow replacing - with _ and translate it back to the setting name
                    let name = key.replace('Accounts_OAuth_Custom_', '');
                    if (name.indexOf('_') > -1) {
                        name = name.replace(name.substr(name.indexOf('_')), '');
                    }
                    const serviceKey = `Accounts_OAuth_Custom_${name}`;
                    if (key === serviceKey) {
                        const values = {
                            enabled: process.env[`${serviceKey}`] === 'true',
                            clientId: process.env[`${serviceKey}_id`],
                            clientSecret: process.env[`${serviceKey}_secret`],
                            serverURL: process.env[`${serviceKey}_url`],
                            tokenPath: process.env[`${serviceKey}_token_path`],
                            identityPath: process.env[`${serviceKey}_identity_path`],
                            authorizePath: process.env[`${serviceKey}_authorize_path`],
                            scope: process.env[`${serviceKey}_scope`],
                            accessTokenParam: process.env[`${serviceKey}_access_token_param`],
                            buttonLabelText: process.env[`${serviceKey}_button_label_text`],
                            buttonLabelColor: process.env[`${serviceKey}_button_label_color`],
                            loginStyle: process.env[`${serviceKey}_login_style`],
                            buttonColor: process.env[`${serviceKey}_button_color`],
                            tokenSentVia: process.env[`${serviceKey}_token_sent_via`],
                            identityTokenSentVia: process.env[`${serviceKey}_identity_token_sent_via`],
                            keyField: process.env[`${serviceKey}_key_field`],
                            usernameField: process.env[`${serviceKey}_username_field`],
                            nameField: process.env[`${serviceKey}_name_field`],
                            emailField: process.env[`${serviceKey}_email_field`],
                            rolesClaim: process.env[`${serviceKey}_roles_claim`],
                            groupsClaim: process.env[`${serviceKey}_groups_claim`],
                            channelsMap: process.env[`${serviceKey}_groups_channel_map`],
                            channelsAdmin: process.env[`${serviceKey}_channels_admin`],
                            mergeUsers: process.env[`${serviceKey}_merge_users`] === 'true',
                            mergeUsersDistinctServices: process.env[`${serviceKey}_merge_users_distinct_services`] === 'true',
                            mapChannels: process.env[`${serviceKey}_map_channels`],
                            mergeRoles: process.env[`${serviceKey}_merge_roles`] === 'true',
                            rolesToSync: process.env[`${serviceKey}_roles_to_sync`],
                            showButton: process.env[`${serviceKey}_show_button`] === 'true',
                            avatarField: process.env[`${serviceKey}_avatar_field`],
                        };
                        yield (0, addOAuthService_1.addOAuthService)(name, values);
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
}
