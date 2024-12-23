"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const oauth_1 = require("meteor/oauth");
const client_1 = require("../../settings/client");
oauth_1.OAuth.launchLogin = ((func) => function (options) {
    var _a;
    const proxy = client_1.settings.get('Accounts_OAuth_Proxy_services').replace(/\s/g, '').split(',');
    if (proxy.includes(options.loginService)) {
        const redirectUri = (_a = options.loginUrl.match(/(&redirect_uri=)([^&]+|$)/)) === null || _a === void 0 ? void 0 : _a[2];
        options.loginUrl = options.loginUrl.replace(/(&redirect_uri=)([^&]+|$)/, `$1${encodeURIComponent(client_1.settings.get('Accounts_OAuth_Proxy_host'))}/oauth_redirect`);
        options.loginUrl = options.loginUrl.replace(/(&state=)([^&]+|$)/, `$1${redirectUri}!$2`);
        options.loginUrl = `${client_1.settings.get('Accounts_OAuth_Proxy_host')}/redirect/${encodeURIComponent(options.loginUrl)}`;
    }
    return func(options);
})(oauth_1.OAuth.launchLogin.bind(oauth_1.OAuth));
