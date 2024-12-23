"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Method = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const TwoFactorEmailModal_1 = __importDefault(require("./TwoFactorEmailModal"));
const TwoFactorPasswordModal_1 = __importDefault(require("./TwoFactorPasswordModal"));
const TwoFactorTotpModal_1 = __importDefault(require("./TwoFactorTotpModal"));
var Method;
(function (Method) {
    Method["TOTP"] = "totp";
    Method["EMAIL"] = "email";
    Method["PASSWORD"] = "password";
})(Method || (exports.Method = Method = {}));
const TwoFactorModal = (_a) => {
    var { onConfirm, onClose, invalidAttempt } = _a, props = __rest(_a, ["onConfirm", "onClose", "invalidAttempt"]);
    if (props.method === Method.TOTP) {
        return (0, jsx_runtime_1.jsx)(TwoFactorTotpModal_1.default, { onConfirm: onConfirm, onClose: onClose, invalidAttempt: invalidAttempt });
    }
    if (props.method === Method.EMAIL) {
        const { emailOrUsername } = props;
        return (0, jsx_runtime_1.jsx)(TwoFactorEmailModal_1.default, { onConfirm: onConfirm, onClose: onClose, emailOrUsername: emailOrUsername, invalidAttempt: invalidAttempt });
    }
    if (props.method === Method.PASSWORD) {
        return (0, jsx_runtime_1.jsx)(TwoFactorPasswordModal_1.default, { onConfirm: onConfirm, onClose: onClose, invalidAttempt: invalidAttempt });
    }
    throw new Error('Invalid Two Factor method');
};
exports.default = TwoFactorModal;
