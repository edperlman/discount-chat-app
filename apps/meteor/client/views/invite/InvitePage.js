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
const layout_1 = require("@rocket.chat/layout");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const LoginPage_1 = __importDefault(require("../root/MainLayout/LoginPage"));
const PageLoading_1 = __importDefault(require("../root/PageLoading"));
const useInviteTokenMutation_1 = require("./hooks/useInviteTokenMutation");
const useValidateInviteQuery_1 = require("./hooks/useValidateInviteQuery");
const InvitePage = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const token = (0, ui_contexts_1.useRouteParameter)('hash');
    const userId = (0, ui_contexts_1.useUserId)();
    const { isLoading, data: isValidInvite } = (0, useValidateInviteQuery_1.useValidateInviteQuery)(userId, token);
    const getInviteRoomMutation = (0, useInviteTokenMutation_1.useInviteTokenMutation)();
    (0, react_1.useEffect)(() => {
        if (userId && token) {
            getInviteRoomMutation(token);
        }
    }, [getInviteRoomMutation, token, userId]);
    if (isLoading) {
        return (0, jsx_runtime_1.jsx)(PageLoading_1.default, {});
    }
    if (isValidInvite) {
        return (0, jsx_runtime_1.jsx)(LoginPage_1.default, {});
    }
    return ((0, jsx_runtime_1.jsx)(layout_1.HeroLayout, { children: (0, jsx_runtime_1.jsx)(layout_1.HeroLayoutTitle, { children: t('Invalid_or_expired_invite_token') }) }));
};
exports.default = InvitePage;
