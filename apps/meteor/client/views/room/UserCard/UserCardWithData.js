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
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_client_1 = require("@rocket.chat/ui-client");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const getUserDisplayName_1 = require("../../../../lib/getUserDisplayName");
const LocalTime_1 = __importDefault(require("../../../components/LocalTime"));
const UserCard_1 = require("../../../components/UserCard");
const UserStatus_1 = require("../../../components/UserStatus");
const useUserInfoQuery_1 = require("../../../hooks/useUserInfoQuery");
const useMemberExists_1 = require("../../hooks/useMemberExists");
const useUserInfoActions_1 = require("../hooks/useUserInfoActions");
const UserCardWithData = ({ username, rid, onOpenUserInfo, onClose }) => {
    var _a;
    const { t } = (0, react_i18next_1.useTranslation)();
    const getRoles = (0, ui_contexts_1.useRolesDescription)();
    const showRealNames = (0, ui_contexts_1.useSetting)('UI_Use_Real_Name', false);
    const { data, isLoading: isUserInfoLoading } = (0, useUserInfoQuery_1.useUserInfoQuery)({ username });
    const { data: isMemberData, refetch, isSuccess: membershipCheckSuccess, isLoading: isMembershipStatusLoading, } = (0, useMemberExists_1.useMemberExists)({ roomId: rid, username });
    const isLoading = isUserInfoLoading || isMembershipStatusLoading;
    const isMember = membershipCheckSuccess && (isMemberData === null || isMemberData === void 0 ? void 0 : isMemberData.isMember);
    const user = (0, react_1.useMemo)(() => {
        const defaultValue = isLoading ? undefined : null;
        const { _id, name, roles = defaultValue, statusText = defaultValue, bio = defaultValue, utcOffset = defaultValue, nickname, avatarETag, freeSwitchExtension, } = (data === null || data === void 0 ? void 0 : data.user) || {};
        return {
            _id,
            name: (0, getUserDisplayName_1.getUserDisplayName)(name, username, showRealNames),
            username,
            roles: roles && getRoles(roles).map((role, index) => (0, jsx_runtime_1.jsx)(UserCard_1.UserCardRole, { children: role }, index)),
            bio,
            etag: avatarETag,
            localTime: utcOffset && Number.isInteger(utcOffset) && (0, jsx_runtime_1.jsx)(LocalTime_1.default, { utcOffset: utcOffset }),
            status: _id && (0, jsx_runtime_1.jsx)(UserStatus_1.ReactiveUserStatus, { uid: _id }),
            customStatus: statusText,
            nickname,
            freeSwitchExtension,
        };
    }, [data, username, showRealNames, isLoading, getRoles]);
    const handleOpenUserInfo = (0, fuselage_hooks_1.useEffectEvent)(() => {
        onOpenUserInfo();
        onClose();
    });
    const { actions: actionsDefinition, menuActions: menuOptions } = (0, useUserInfoActions_1.useUserInfoActions)({
        rid,
        user: { _id: (_a = user._id) !== null && _a !== void 0 ? _a : '', username: user.username, name: user.name, freeSwitchExtension: user.freeSwitchExtension },
        size: 3,
        isMember,
        reload: refetch,
    });
    const menu = (0, react_1.useMemo)(() => {
        if (!(menuOptions === null || menuOptions === void 0 ? void 0 : menuOptions.length)) {
            return null;
        }
        return ((0, jsx_runtime_1.jsx)(ui_client_1.GenericMenu, { title: t('More'), "data-qa-id": 'menu', sections: menuOptions, placement: 'bottom-start', callbackAction: onClose }, 'menu'));
    }, [menuOptions, onClose, t]);
    const actions = (0, react_1.useMemo)(() => {
        const mapAction = ([key, { content, title, icon, onClick }]) => ((0, jsx_runtime_1.jsx)(UserCard_1.UserCardAction, { label: content || title, "aria-label": content || title, onClick: onClick, icon: icon }, key));
        return [...actionsDefinition.map(mapAction), menu].filter(Boolean);
    }, [actionsDefinition, menu]);
    if (isLoading) {
        return (0, jsx_runtime_1.jsx)(UserCard_1.UserCardSkeleton, {});
    }
    return (0, jsx_runtime_1.jsx)(UserCard_1.UserCard, { user: user, onClose: onClose, onOpenUserInfo: handleOpenUserInfo, actions: actions });
};
exports.default = UserCardWithData;
