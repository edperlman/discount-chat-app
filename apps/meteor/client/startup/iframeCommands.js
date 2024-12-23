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
const string_helpers_1 = require("@rocket.chat/string-helpers");
const meteor_1 = require("meteor/meteor");
const client_1 = require("../../app/settings/client");
const AccountBox_1 = require("../../app/ui-utils/client/lib/AccountBox");
const SDKClient_1 = require("../../app/utils/client/lib/SDKClient");
const afterLogoutCleanUpCallback_1 = require("../../lib/callbacks/afterLogoutCleanUpCallback");
const stringUtils_1 = require("../../lib/utils/stringUtils");
const baseURI_1 = require("../lib/baseURI");
const loginServices_1 = require("../lib/loginServices");
const RouterProvider_1 = require("../providers/RouterProvider");
const commands = {
    'go'(data) {
        if (typeof data.path !== 'string' || data.path.trim().length === 0) {
            return console.error('`path` not defined');
        }
        const newUrl = new URL(`${(0, stringUtils_1.rtrim)(baseURI_1.baseURI, '/')}/${(0, stringUtils_1.ltrim)(data.path, '/')}`);
        const newParams = Array.from(newUrl.searchParams.entries()).reduce((ret, [key, value]) => {
            ret[key] = value;
            return ret;
        }, {});
        const newPath = newUrl.pathname.replace(new RegExp(`^${(0, string_helpers_1.escapeRegExp)(__meteor_runtime_config__.ROOT_URL_PATH_PREFIX)}`), '');
        RouterProvider_1.router.navigate({
            pathname: newPath,
            search: Object.assign(Object.assign({}, RouterProvider_1.router.getSearchParameters()), newParams),
        });
    },
    'set-user-status'(data) {
        AccountBox_1.AccountBox.setStatus(data.status);
    },
    'call-custom-oauth-login'(data, event) {
        const customOAuthCallback = (response) => {
            var _a;
            (_a = event.source) === null || _a === void 0 ? void 0 : _a.postMessage({
                event: 'custom-oauth-callback',
                response,
            }, { targetOrigin: event.origin });
        };
        const siteUrl = `${meteor_1.Meteor.settings.Site_Url}/`;
        if (typeof data.redirectUrl !== 'string' || !data.redirectUrl.startsWith(siteUrl)) {
            data.redirectUrl = null;
        }
        if (typeof data.service === 'string' && window.ServiceConfiguration) {
            const customOauth = loginServices_1.loginServices.getLoginService(data.service);
            if (customOauth) {
                const customLoginWith = meteor_1.Meteor[`loginWith${(0, stringUtils_1.capitalize)(customOauth.service, true)}`];
                const customRedirectUri = data.redirectUrl || siteUrl;
                customLoginWith.call(meteor_1.Meteor, { redirectUrl: customRedirectUri }, customOAuthCallback);
            }
        }
    },
    'login-with-token'(data) {
        if (typeof data.token === 'string') {
            meteor_1.Meteor.loginWithToken(data.token, () => {
                console.log('Iframe command [login-with-token]: result', data);
            });
        }
    },
    'logout'() {
        return __awaiter(this, void 0, void 0, function* () {
            const user = meteor_1.Meteor.user();
            meteor_1.Meteor.logout(() => {
                if (!user) {
                    return;
                }
                void afterLogoutCleanUpCallback_1.afterLogoutCleanUpCallback.run(user);
                SDKClient_1.sdk.call('logoutCleanUp', user);
                return RouterProvider_1.router.navigate('/home');
            });
        });
    },
};
window.addEventListener('message', (e) => {
    if (!client_1.settings.get('Iframe_Integration_receive_enable')) {
        return;
    }
    if (typeof e.data !== 'object' || typeof e.data.externalCommand !== 'string') {
        return;
    }
    const origins = client_1.settings.get('Iframe_Integration_receive_origin');
    if (origins !== '*' && origins.split(',').indexOf(e.origin) === -1) {
        console.error('Origin not allowed', e.origin);
        return;
    }
    if (!(e.data.externalCommand in commands)) {
        console.error('Command not allowed', e.data.externalCommand);
        return;
    }
    const command = commands[e.data.externalCommand];
    command(e.data, e);
});
