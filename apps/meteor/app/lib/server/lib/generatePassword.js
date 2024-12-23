"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePassword = void 0;
const generate_password_1 = __importDefault(require("generate-password"));
const passwordPolicy_1 = require("./passwordPolicy");
const generatePassword = () => {
    var _a, _b, _c, _d;
    const policies = passwordPolicy_1.passwordPolicy.getPasswordPolicy();
    const maxLength = ((_b = (_a = policies.policy.find(([key]) => key === 'get-password-policy-maxLength')) === null || _a === void 0 ? void 0 : _a[1]) === null || _b === void 0 ? void 0 : _b.maxLength) || -1;
    const minLength = ((_d = (_c = policies.policy.find(([key]) => key === 'get-password-policy-minLength')) === null || _c === void 0 ? void 0 : _c[1]) === null || _d === void 0 ? void 0 : _d.minLength) || -1;
    const length = Math.min(Math.max(minLength, 12), maxLength > 0 ? maxLength : Number.MAX_SAFE_INTEGER);
    if (policies.enabled) {
        for (let i = 0; i < 10; i++) {
            const password = generate_password_1.default.generate(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ length }, (policies.policy && { numbers: true })), (policies.policy.some(([key]) => key === 'get-password-policy-mustContainAtLeastOneSpecialCharacter') && { symbols: true })), (policies.policy.some(([key]) => key === 'get-password-policy-mustContainAtLeastOneLowercase') && { lowercase: true })), (policies.policy.some(([key]) => key === 'get-password-policy-mustContainAtLeastOneUppercase') && { uppercase: true })), { strict: true }));
            if (passwordPolicy_1.passwordPolicy.validate(password)) {
                return password;
            }
        }
    }
    return generate_password_1.default.generate({ length: 17 });
};
exports.generatePassword = generatePassword;
