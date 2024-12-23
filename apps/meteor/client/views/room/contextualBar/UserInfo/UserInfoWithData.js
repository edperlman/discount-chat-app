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
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const UserInfoActions_1 = __importDefault(require("./UserInfoActions"));
const getUserEmailAddress_1 = require("../../../../../lib/getUserEmailAddress");
const Contextualbar_1 = require("../../../../components/Contextualbar");
const Skeleton_1 = require("../../../../components/Skeleton");
const UserCard_1 = require("../../../../components/UserCard");
const UserInfo_1 = require("../../../../components/UserInfo");
const UserStatus_1 = require("../../../../components/UserStatus");
const useAsyncState_1 = require("../../../../hooks/useAsyncState");
const useEndpointData_1 = require("../../../../hooks/useEndpointData");
const getUserEmailVerified_1 = require("../../../../lib/utils/getUserEmailVerified");
const UserInfoWithData = ({ uid, username, rid, onClose, onClickBack }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const getRoles = (0, ui_contexts_1.useRolesDescription)();
    const { value: data, phase: state, error, } = (0, useEndpointData_1.useEndpointData)('/v1/users.info', {
        params: (0, react_1.useMemo)(() => {
            if (uid) {
                return { userId: uid };
            }
            if (username) {
                return { username };
            }
            throw new Error('userId or username is required');
        }, [uid, username]),
    });
    const isLoading = state === useAsyncState_1.AsyncStatePhase.LOADING;
    const user = (0, react_1.useMemo)(() => {
        if (!(data === null || data === void 0 ? void 0 : data.user)) {
            return;
        }
        const { _id, name, username, roles = [], statusText, bio, utcOffset, lastLogin, customFields, phone, nickname, createdAt, canViewAllInfo, freeSwitchExtension, } = data.user;
        return {
            _id,
            name,
            username,
            lastLogin,
            roles: roles && getRoles(roles).map((role, index) => (0, jsx_runtime_1.jsx)(UserCard_1.UserCardRole, { children: role }, index)),
            bio,
            canViewAllInfo,
            phone,
            customFields,
            verified: (0, getUserEmailVerified_1.getUserEmailVerified)(data.user),
            email: (0, getUserEmailAddress_1.getUserEmailAddress)(data.user),
            utcOffset,
            createdAt,
            status: (0, jsx_runtime_1.jsx)(UserStatus_1.ReactiveUserStatus, { uid: _id }),
            statusText,
            nickname,
            freeSwitchExtension,
        };
    }, [data, getRoles]);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarHeader, { children: [onClickBack && (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarBack, { onClick: onClickBack }), !onClickBack && (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarIcon, { name: 'user' }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarTitle, { children: t('User_Info') }), onClose && (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarClose, { onClick: onClose })] }), isLoading && ((0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarContent, { children: (0, jsx_runtime_1.jsx)(Skeleton_1.FormSkeleton, {}) })), error && !user && ((0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarContent, { pb: 16, children: (0, jsx_runtime_1.jsx)(fuselage_1.Callout, { type: 'danger', children: t('User_not_found') }) })), !isLoading && user && (0, jsx_runtime_1.jsx)(UserInfo_1.UserInfo, Object.assign({}, user, { actions: (0, jsx_runtime_1.jsx)(UserInfoActions_1.default, { user: user, rid: rid, backToList: onClickBack }) }))] }));
};
exports.default = UserInfoWithData;
