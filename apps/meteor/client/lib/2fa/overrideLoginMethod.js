"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.callLoginMethod = exports.handleLogin = exports.overrideLoginMethod = void 0;
const utils_1 = require("./utils");
const overrideLoginMethod = (loginMethod, loginArgs, callback, loginMethodTOTP) => {
    loginMethod(...loginArgs, (error, result) => __awaiter(void 0, void 0, void 0, function* () {
        if (!(0, utils_1.isTotpRequiredError)(error)) {
            callback === null || callback === void 0 ? void 0 : callback(error);
            return;
        }
        const { process2faReturn } = yield Promise.resolve().then(() => __importStar(require('./process2faReturn')));
        yield process2faReturn({
            error,
            result,
            emailOrUsername: typeof loginArgs[0] === 'string' ? loginArgs[0] : undefined,
            originalCallback: callback,
            onCode: (code) => {
                loginMethodTOTP(...loginArgs, code, (error, result) => {
                    if (!error) {
                        callback === null || callback === void 0 ? void 0 : callback(undefined, result);
                        return;
                    }
                    if ((0, utils_1.isTotpInvalidError)(error)) {
                        callback === null || callback === void 0 ? void 0 : callback(error);
                        return;
                    }
                    Promise.all([Promise.resolve().then(() => __importStar(require('../../../app/utils/lib/i18n'))), Promise.resolve().then(() => __importStar(require('../toast')))]).then(([{ t }, { dispatchToastMessage }]) => {
                        if ((0, utils_1.isTotpMaxAttemptsError)(error)) {
                            dispatchToastMessage({
                                type: 'error',
                                message: t('totp-max-attempts'),
                            });
                            callback === null || callback === void 0 ? void 0 : callback(undefined);
                            return;
                        }
                        dispatchToastMessage({ type: 'error', message: t('Invalid_two_factor_code') });
                        callback === null || callback === void 0 ? void 0 : callback(undefined);
                    });
                });
            },
        });
    }));
};
exports.overrideLoginMethod = overrideLoginMethod;
const handleLogin = (login, loginWithTOTP) => {
    return (...args) => {
        const loginArgs = args.slice(0, -1);
        const callback = args.slice(-1)[0];
        return login(...loginArgs)
            .catch((error) => __awaiter(void 0, void 0, void 0, function* () {
            if (!(0, utils_1.isTotpRequiredError)(error)) {
                return Promise.reject(error);
            }
            const { process2faAsyncReturn } = yield Promise.resolve().then(() => __importStar(require('./process2faReturn')));
            return process2faAsyncReturn({
                emailOrUsername: typeof loginArgs[0] === 'string' ? loginArgs[0] : undefined,
                error,
                onCode: (code) => loginWithTOTP(...loginArgs, code),
            });
        }))
            .then((result) => callback === null || callback === void 0 ? void 0 : callback(undefined, result))
            .catch((error) => {
            if (!(0, utils_1.isTotpInvalidError)(error)) {
                callback === null || callback === void 0 ? void 0 : callback(error);
                return;
            }
            Promise.all([Promise.resolve().then(() => __importStar(require('../../../app/utils/lib/i18n'))), Promise.resolve().then(() => __importStar(require('../toast')))]).then(([{ t }, { dispatchToastMessage }]) => {
                dispatchToastMessage({ type: 'error', message: t('Invalid_two_factor_code') });
                callback === null || callback === void 0 ? void 0 : callback(undefined);
            });
        });
    };
};
exports.handleLogin = handleLogin;
const callLoginMethod = (options) => new Promise((resolve, reject) => {
    Accounts.callLoginMethod(Object.assign(Object.assign({}, options), { userCallback: (error) => {
            if (error) {
                reject(error);
            }
            else {
                resolve();
            }
        } }));
});
exports.callLoginMethod = callLoginMethod;
