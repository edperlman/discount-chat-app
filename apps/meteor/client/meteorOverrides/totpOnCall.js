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
const i18n_1 = require("../../app/utils/lib/i18n");
const process2faReturn_1 = require("../lib/2fa/process2faReturn");
const utils_1 = require("../lib/2fa/utils");
const withSyncTOTP = (call) => {
    const callWithTotp = (methodName, args, callback) => (twoFactorCode, twoFactorMethod) => call(methodName, ...args, { twoFactorCode, twoFactorMethod }, (error, result) => {
        if ((0, utils_1.isTotpInvalidError)(error)) {
            callback(new Error(twoFactorMethod === 'password' ? (0, i18n_1.t)('Invalid_password') : (0, i18n_1.t)('Invalid_two_factor_code')));
            return;
        }
        callback(error, result);
    });
    const callWithoutTotp = (methodName, args, callback) => () => call(methodName, ...args, (error, result) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, process2faReturn_1.process2faReturn)({
            error,
            result,
            onCode: callWithTotp(methodName, args, callback),
            originalCallback: callback,
            emailOrUsername: undefined,
        });
    }));
    return function (methodName, ...args) {
        const callback = args.length > 0 && typeof args[args.length - 1] === 'function' ? args.pop() : () => undefined;
        return callWithoutTotp(methodName, args, callback)();
    };
};
const withAsyncTOTP = (callAsync) => {
    return function callAsyncWithTOTP(methodName, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield callAsync(methodName, ...args);
            }
            catch (error) {
                return (0, process2faReturn_1.process2faAsyncReturn)({
                    error,
                    onCode: (twoFactorCode, twoFactorMethod) => meteor_1.Meteor.callAsync(methodName, ...args, { twoFactorCode, twoFactorMethod }),
                    emailOrUsername: undefined,
                });
            }
        });
    };
};
meteor_1.Meteor.call = withSyncTOTP(meteor_1.Meteor.call);
meteor_1.Meteor.callAsync = withAsyncTOTP(meteor_1.Meteor.callAsync);
