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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const PasswordChangeCheck_1 = __importDefault(require("./PasswordChangeCheck"));
const RegisterUsername_1 = __importDefault(require("./RegisterUsername"));
const useReactiveValue_1 = require("../../../hooks/useReactiveValue");
const useUserInfoQuery_1 = require("../../../hooks/useUserInfoQuery");
const UsernameCheck = ({ children }) => {
    const userId = (0, ui_contexts_1.useUserId)();
    const { data: userData, isLoading } = (0, useUserInfoQuery_1.useUserInfoQuery)({ userId: userId || '' });
    const allowAnonymousRead = (0, ui_contexts_1.useSetting)('Accounts_AllowAnonymousRead', false);
    const shouldRegisterUsername = (0, useReactiveValue_1.useReactiveValue)((0, react_1.useCallback)(() => {
        var _a;
        const hasUserInCollection = !!(userData === null || userData === void 0 ? void 0 : userData.user);
        const hasUsername = !!((_a = userData === null || userData === void 0 ? void 0 : userData.user) === null || _a === void 0 ? void 0 : _a.username);
        if (!userId) {
            return !allowAnonymousRead;
        }
        if (!hasUserInCollection) {
            return true;
        }
        return !hasUsername;
    }, [userData === null || userData === void 0 ? void 0 : userData.user, userId, allowAnonymousRead]));
    if (!isLoading && shouldRegisterUsername) {
        return (0, jsx_runtime_1.jsx)(RegisterUsername_1.default, {});
    }
    return (0, jsx_runtime_1.jsx)(PasswordChangeCheck_1.default, { children: children });
};
exports.default = UsernameCheck;
