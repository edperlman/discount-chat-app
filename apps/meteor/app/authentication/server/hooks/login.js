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
const accounts_base_1 = require("meteor/accounts-base");
const callbacks_1 = require("../../../../lib/callbacks");
const server_1 = require("../../../settings/server");
const logLoginAttempts_1 = require("../lib/logLoginAttempts");
const restrictLoginAttempts_1 = require("../lib/restrictLoginAttempts");
const ignoredErrorTypes = ['totp-required', 'error-login-blocked-for-user'];
accounts_base_1.Accounts.onLoginFailure((login) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // do not save specific failed login attempts
    if (server_1.settings.get('Block_Multiple_Failed_Logins_Enabled') &&
        ((_a = login.error) === null || _a === void 0 ? void 0 : _a.error) &&
        !ignoredErrorTypes.includes(String(login.error.error))) {
        yield (0, restrictLoginAttempts_1.saveFailedLoginAttempts)(login);
    }
    (0, logLoginAttempts_1.logFailedLoginAttempts)(login);
}));
callbacks_1.callbacks.add('afterValidateLogin', (login) => {
    if (!server_1.settings.get('Block_Multiple_Failed_Logins_Enabled')) {
        return;
    }
    return (0, restrictLoginAttempts_1.saveSuccessfulLogin)(login);
});
