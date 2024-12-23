"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iframeLogin = exports.IframeLogin = void 0;
const accounts_base_1 = require("meteor/accounts-base");
const check_1 = require("meteor/check");
const http_1 = require("meteor/http");
const meteor_1 = require("meteor/meteor");
const reactive_var_1 = require("meteor/reactive-var");
const tracker_1 = require("meteor/tracker");
const client_1 = require("../../../settings/client");
class IframeLogin {
    constructor() {
        this.enabled = false;
        this.reactiveEnabled = new reactive_var_1.ReactiveVar(false);
        this.reactiveIframeUrl = new reactive_var_1.ReactiveVar(undefined);
        tracker_1.Tracker.autorun((c) => {
            this.enabled = client_1.settings.get('Accounts_iframe_enabled');
            this.reactiveEnabled.set(this.enabled);
            this.iframeUrl = client_1.settings.get('Accounts_iframe_url');
            this.apiUrl = client_1.settings.get('Accounts_Iframe_api_url');
            this.apiMethod = client_1.settings.get('Accounts_Iframe_api_method');
            if (this.enabled === false) {
                return c.stop();
            }
            if (this.enabled === true && this.iframeUrl && this.apiUrl && this.apiMethod) {
                c.stop();
                if (!accounts_base_1.Accounts._storedLoginToken()) {
                    this.tryLogin();
                }
            }
        });
    }
    tryLogin(callback) {
        if (!this.enabled) {
            return;
        }
        if (!this.iframeUrl || !this.apiUrl || !this.apiMethod) {
            return;
        }
        console.log('tryLogin');
        const options = {
            beforeSend: (xhr) => {
                xhr.withCredentials = true;
            },
        };
        let { iframeUrl } = this;
        let separator = '?';
        if (iframeUrl.indexOf('?') > -1) {
            separator = '&';
        }
        if (navigator.userAgent.indexOf('Electron') > -1) {
            iframeUrl += `${separator}client=electron`;
        }
        http_1.HTTP.call(this.apiMethod, this.apiUrl, options, (error, result) => {
            console.log(error, result);
            if ((result === null || result === void 0 ? void 0 : result.data) && (result.data.token || result.data.loginToken)) {
                this.loginWithToken(result.data, (error) => {
                    if (error) {
                        this.reactiveIframeUrl.set(iframeUrl);
                    }
                    else {
                        this.reactiveIframeUrl.set(undefined);
                    }
                    callback === null || callback === void 0 ? void 0 : callback(error, result);
                });
            }
            else {
                this.reactiveIframeUrl.set(iframeUrl);
                callback === null || callback === void 0 ? void 0 : callback(error, result);
            }
        });
    }
    loginWithToken(tokenData, callback) {
        if (!this.enabled) {
            return;
        }
        if (check_1.Match.test(tokenData, String)) {
            tokenData = {
                token: tokenData,
            };
        }
        console.log('loginWithToken');
        if ('loginToken' in tokenData) {
            return meteor_1.Meteor.loginWithToken(tokenData.loginToken, callback);
        }
        accounts_base_1.Accounts.callLoginMethod({
            methodArguments: [
                {
                    iframe: true,
                    token: tokenData.token,
                },
            ],
            userCallback: callback,
        });
    }
}
exports.IframeLogin = IframeLogin;
exports.iframeLogin = new IframeLogin();
