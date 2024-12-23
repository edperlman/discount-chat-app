"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const accounts_base_1 = require("meteor/accounts-base");
const client_1 = require("../../ui-utils/client");
const iframeLogin = new client_1.IframeLogin();
const { _unstoreLoginToken } = accounts_base_1.Accounts;
accounts_base_1.Accounts._unstoreLoginToken = function (...args) {
    iframeLogin.tryLogin();
    _unstoreLoginToken.apply(accounts_base_1.Accounts, args);
};
window.addEventListener('message', (e) => {
    if (!(typeof e.data === 'function' || (typeof e.data === 'object' && !!e.data))) {
        return;
    }
    switch (e.data.event) {
        case 'try-iframe-login':
            iframeLogin.tryLogin((error) => {
                var _a;
                if (error) {
                    (_a = e.source) === null || _a === void 0 ? void 0 : _a.postMessage({
                        event: 'login-error',
                        response: error.message,
                    }, { targetOrigin: e.origin });
                }
            });
            break;
        case 'login-with-token':
            iframeLogin.loginWithToken(e.data, (error) => {
                var _a;
                if (error) {
                    (_a = e.source) === null || _a === void 0 ? void 0 : _a.postMessage({
                        event: 'login-error',
                        response: error.message,
                    }, { targetOrigin: e.origin });
                }
            });
            break;
    }
});
