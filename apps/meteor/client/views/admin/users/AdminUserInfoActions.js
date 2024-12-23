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
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const useChangeAdminStatusAction_1 = require("./hooks/useChangeAdminStatusAction");
const useChangeUserStatusAction_1 = require("./hooks/useChangeUserStatusAction");
const useDeleteUserAction_1 = require("./hooks/useDeleteUserAction");
const useResetE2EEKeyAction_1 = require("./hooks/useResetE2EEKeyAction");
const useResetTOTPAction_1 = require("./hooks/useResetTOTPAction");
const UserInfo_1 = require("../../../components/UserInfo");
const useActionSpread_1 = require("../../hooks/useActionSpread");
// TODO: Replace menu
const AdminUserInfoActions = ({ username, userId, isFederatedUser, isActive, isAdmin, tab, onChange, onReload, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const directRoute = (0, ui_contexts_1.useRoute)('direct');
    const userRoute = (0, ui_contexts_1.useRoute)('admin-users');
    const canDirectMessage = (0, ui_contexts_1.usePermission)('create-d');
    const canEditOtherUserInfo = (0, ui_contexts_1.usePermission)('edit-other-user-info');
    const changeAdminStatusAction = (0, useChangeAdminStatusAction_1.useChangeAdminStatusAction)(userId, isAdmin, onChange);
    const changeUserStatusAction = (0, useChangeUserStatusAction_1.useChangeUserStatusAction)(userId, isActive, onChange);
    const deleteUserAction = (0, useDeleteUserAction_1.useDeleteUserAction)(userId, onChange, onReload);
    const resetTOTPAction = (0, useResetTOTPAction_1.useResetTOTPAction)(userId);
    const resetE2EKeyAction = (0, useResetE2EEKeyAction_1.useResetE2EEKeyAction)(userId);
    const directMessageClick = (0, react_1.useCallback)(() => username &&
        directRoute.push({
            rid: username,
        }), [directRoute, username]);
    const editUserClick = (0, react_1.useCallback)(() => userRoute.push({
        context: 'edit',
        id: userId,
    }), [userId, userRoute]);
    const isNotPendingDeactivatedNorFederated = tab !== 'pending' && tab !== 'deactivated' && !isFederatedUser;
    const options = (0, react_1.useMemo)(() => (Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (canDirectMessage && {
        directMessage: {
            icon: 'balloon',
            label: t('Direct_Message'),
            title: t('Direct_Message'),
            action: directMessageClick,
        },
    })), (canEditOtherUserInfo && {
        editUser: {
            icon: 'edit',
            label: t('Edit'),
            title: isFederatedUser ? t('Edit_Federated_User_Not_Allowed') : t('Edit'),
            action: editUserClick,
            disabled: isFederatedUser,
        },
    })), (isNotPendingDeactivatedNorFederated && changeAdminStatusAction && { makeAdmin: changeAdminStatusAction })), (isNotPendingDeactivatedNorFederated && resetE2EKeyAction && { resetE2EKey: resetE2EKeyAction })), (isNotPendingDeactivatedNorFederated && resetTOTPAction && { resetTOTP: resetTOTPAction })), (changeUserStatusAction && !isFederatedUser && { changeActiveStatus: changeUserStatusAction })), (deleteUserAction && { delete: deleteUserAction }))), [
        canDirectMessage,
        canEditOtherUserInfo,
        changeAdminStatusAction,
        changeUserStatusAction,
        deleteUserAction,
        directMessageClick,
        editUserClick,
        isFederatedUser,
        isNotPendingDeactivatedNorFederated,
        resetE2EKeyAction,
        resetTOTPAction,
        t,
    ]);
    const { actions: actionsDefinition, menu: menuOptions } = (0, useActionSpread_1.useActionSpread)(options);
    const menu = (0, react_1.useMemo)(() => {
        if (!menuOptions) {
            return null;
        }
        return ((0, jsx_runtime_1.jsx)(fuselage_1.Menu, { mi: 4, placement: 'bottom-start', small: false, secondary: true, flexShrink: 0, renderItem: (_a) => {
                var { label: { label, icon } } = _a, props = __rest(_a, ["label"]);
                return ((0, jsx_runtime_1.jsx)(fuselage_1.Option, Object.assign({ label: label, title: label, icon: icon, variant: label === 'Delete' ? 'danger' : '' }, props)));
            }, options: menuOptions }, 'menu'));
    }, [menuOptions]);
    // TODO: sanitize Action type to avoid any
    const actions = (0, react_1.useMemo)(() => {
        const mapAction = ([key, { label, icon, action, disabled, title }]) => ((0, jsx_runtime_1.jsx)(UserInfo_1.UserInfoAction, { title: title, label: label, onClick: action, disabled: disabled, icon: icon }, key));
        return [...actionsDefinition.map(mapAction), menu].filter(Boolean);
    }, [actionsDefinition, menu]);
    return ((0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, { align: 'center', "data-qa-id": 'UserInfoActions', children: actions }));
};
exports.default = AdminUserInfoActions;
