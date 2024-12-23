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
exports.wrapRequestCredentialFn = wrapRequestCredentialFn;
const accounts_base_1 = require("meteor/accounts-base");
const oauth_1 = require("meteor/oauth");
const loginServices_1 = require("./loginServices");
function wrapRequestCredentialFn(serviceName, fn) {
    const wrapped = (options, credentialRequestCompleteCallback) => __awaiter(this, void 0, void 0, function* () {
        const config = yield loginServices_1.loginServices.loadLoginService(serviceName);
        if (!config) {
            credentialRequestCompleteCallback === null || credentialRequestCompleteCallback === void 0 ? void 0 : credentialRequestCompleteCallback(new accounts_base_1.Accounts.ConfigError());
            return;
        }
        const loginStyle = oauth_1.OAuth._loginStyle(serviceName, config, options);
        fn({
            config,
            loginStyle,
            options,
            credentialRequestCompleteCallback,
        });
    });
    return (options, credentialRequestCompleteCallback) => {
        if (!credentialRequestCompleteCallback && typeof options === 'function') {
            void wrapped({}, options);
            return;
        }
        void wrapped(options, credentialRequestCompleteCallback);
    };
}
