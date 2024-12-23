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
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const oauth_1 = require("meteor/oauth");
const index_1 = require("./code/index");
const callbacks_1 = require("../../../lib/callbacks");
const isMeteorError = (error) => {
    return (error === null || error === void 0 ? void 0 : error.meteorError) !== undefined;
};
const isCredentialWithError = (credential) => {
    return (credential === null || credential === void 0 ? void 0 : credential.error) !== undefined;
};
accounts_base_1.Accounts.registerLoginHandler('totp', function (options) {
    var _a;
    if (!((_a = options.totp) === null || _a === void 0 ? void 0 : _a.code)) {
        return;
    }
    // @ts-expect-error - not sure how to type this yet
    return accounts_base_1.Accounts._runLoginHandlers(this, options.totp.login);
});
callbacks_1.callbacks.add('onValidateLogin', (login) => __awaiter(void 0, void 0, void 0, function* () {
    if (!login.user ||
        login.type === 'resume' ||
        login.type === 'proxy' ||
        login.type === 'cas' ||
        (login.type === 'password' && login.methodName === 'resetPassword') ||
        login.methodName === 'verifyEmail') {
        return login;
    }
    const [loginArgs] = login.methodArguments;
    const { totp } = loginArgs;
    yield (0, index_1.checkCodeForUser)({
        user: login.user,
        code: totp === null || totp === void 0 ? void 0 : totp.code,
        options: { disablePasswordFallback: true },
    });
    return login;
}), callbacks_1.callbacks.priority.MEDIUM, '2fa');
const copyTo = (from, to) => {
    Object.getOwnPropertyNames(to).forEach((key) => {
        const idx = key;
        to[idx] = from[idx];
    });
    return to;
};
const recreateError = (errorDoc) => {
    if (isMeteorError(errorDoc)) {
        const error = new meteor_1.Meteor.Error('');
        return copyTo(errorDoc, error);
    }
    const error = new Error();
    return copyTo(errorDoc, error);
};
oauth_1.OAuth._retrievePendingCredential = function (key, ...args) {
    return __awaiter(this, void 0, void 0, function* () {
        const credentialSecret = args.length > 0 && args[0] !== undefined ? args[0] : undefined;
        (0, check_1.check)(key, String);
        const pendingCredential = yield oauth_1.OAuth._pendingCredentials.findOneAsync({
            key,
            credentialSecret,
        });
        if (!pendingCredential) {
            return;
        }
        if (isCredentialWithError(pendingCredential.credential)) {
            oauth_1.OAuth._pendingCredentials.remove({
                _id: pendingCredential._id,
            });
            return recreateError(pendingCredential.credential.error);
        }
        // Work-around to make the credentials reusable for 2FA
        const future = new Date();
        future.setMinutes(future.getMinutes() + 2);
        yield oauth_1.OAuth._pendingCredentials.updateAsync({
            _id: pendingCredential._id,
        }, {
            $set: {
                createdAt: future,
            },
        });
        return oauth_1.OAuth.openSecret(pendingCredential.credential);
    });
};
