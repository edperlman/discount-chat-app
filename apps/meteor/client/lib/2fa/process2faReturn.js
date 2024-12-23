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
exports.invokeTwoFactorModal = void 0;
exports.process2faReturn = process2faReturn;
exports.process2faAsyncReturn = process2faAsyncReturn;
const sha256_1 = require("@rocket.chat/sha256");
const meteor_1 = require("meteor/meteor");
const react_1 = require("react");
const imperativeModal_1 = require("../imperativeModal");
const utils_1 = require("./utils");
const TwoFactorModal = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('../../components/TwoFactorModal'))));
const twoFactorMethods = ['totp', 'email', 'password'];
const isTwoFactorMethod = (method) => twoFactorMethods.includes(method);
const hasRequiredTwoFactorMethod = (error) => {
    const details = error.details;
    return (typeof details === 'object' &&
        details !== null &&
        typeof details.method === 'string' &&
        isTwoFactorMethod(details.method));
};
function assertModalProps(props) {
    if (props.method === 'email' && typeof props.emailOrUsername !== 'string') {
        throw new Error('Invalid Two Factor method');
    }
}
const getProps = (method, emailOrUsername) => {
    var _a;
    switch (method) {
        case 'totp':
            return { method };
        case 'email':
            return {
                method,
                emailOrUsername: typeof emailOrUsername === 'string' ? emailOrUsername : (_a = meteor_1.Meteor.user()) === null || _a === void 0 ? void 0 : _a.username,
            };
        case 'password':
            return { method };
    }
};
function process2faReturn(_a) {
    return __awaiter(this, arguments, void 0, function* ({ error, result, originalCallback, onCode, emailOrUsername, }) {
        if (!((0, utils_1.isTotpRequiredError)(error) || (0, utils_1.isTotpInvalidError)(error)) || !hasRequiredTwoFactorMethod(error)) {
            originalCallback === null || originalCallback === void 0 ? void 0 : originalCallback(error, result);
            return;
        }
        const props = Object.assign(Object.assign({}, getProps(error.details.method, emailOrUsername || error.details.emailOrUsername)), { 
            // eslint-disable-next-line no-nested-ternary
            invalidAttempt: (0, utils_1.isTotpInvalidError)(error) });
        try {
            const code = yield (0, exports.invokeTwoFactorModal)(props);
            onCode(code, props.method);
        }
        catch (error) {
            process2faReturn({
                error: error,
                result,
                originalCallback,
                onCode,
                emailOrUsername,
            });
        }
    });
}
function process2faAsyncReturn(_a) {
    return __awaiter(this, arguments, void 0, function* ({ error, onCode, emailOrUsername, }) {
        var _b;
        // if the promise is rejected, we need to check if it's a 2fa error
        // if it's not a 2fa error, we reject the promise
        if (!((0, utils_1.isTotpRequiredError)(error) || (0, utils_1.isTotpInvalidError)(error)) || !hasRequiredTwoFactorMethod(error)) {
            throw error;
        }
        const props = {
            method: error.details.method,
            emailOrUsername: emailOrUsername || error.details.emailOrUsername || ((_b = meteor_1.Meteor.user()) === null || _b === void 0 ? void 0 : _b.username),
            // eslint-disable-next-line no-nested-ternary
            invalidAttempt: (0, utils_1.isTotpInvalidError)(error),
        };
        assertModalProps(props);
        try {
            const code = yield (0, exports.invokeTwoFactorModal)(props);
            return onCode(code, props.method);
        }
        catch (error) {
            return process2faAsyncReturn({
                error,
                onCode,
                emailOrUsername,
            });
        }
    });
}
const invokeTwoFactorModal = (props) => __awaiter(void 0, void 0, void 0, function* () {
    assertModalProps(props);
    return new Promise((resolve, reject) => {
        imperativeModal_1.imperativeModal.open({
            component: TwoFactorModal,
            props: Object.assign(Object.assign({}, props), { onConfirm: (code, method) => {
                    imperativeModal_1.imperativeModal.close();
                    resolve(method === 'password' ? (0, sha256_1.SHA256)(code) : code);
                }, onClose: () => {
                    imperativeModal_1.imperativeModal.close();
                    reject(new meteor_1.Meteor.Error('totp-canceled'));
                } }),
        });
    });
});
exports.invokeTwoFactorModal = invokeTwoFactorModal;
