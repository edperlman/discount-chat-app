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
const core_typings_1 = require("@rocket.chat/core-typings");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_avatar_1 = require("@rocket.chat/ui-avatar");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const Roles_1 = require("../../../../../app/models/client/models/Roles");
const GenericTable_1 = require("../../../../components/GenericTable");
const UserStatus_1 = require("../../../../components/UserStatus");
const useChangeAdminStatusAction_1 = require("../hooks/useChangeAdminStatusAction");
const useChangeUserStatusAction_1 = require("../hooks/useChangeUserStatusAction");
const useDeleteUserAction_1 = require("../hooks/useDeleteUserAction");
const useResetE2EEKeyAction_1 = require("../hooks/useResetE2EEKeyAction");
const useResetTOTPAction_1 = require("../hooks/useResetTOTPAction");
const useSendWelcomeEmailMutation_1 = require("../hooks/useSendWelcomeEmailMutation");
const useVoipExtensionAction_1 = require("../voip/hooks/useVoipExtensionAction");
const UsersTableRow = ({ user, tab, isMobile, isLaptop, isSeatsCapExceeded, showVoipExtension, onClick, onReload, }) => {
    var _a;
    const { t } = (0, react_i18next_1.useTranslation)();
    const { _id, emails, username = '', name = '', roles, status, active, avatarETag, lastLogin, type, freeSwitchExtension } = user;
    const registrationStatusText = (0, react_1.useMemo)(() => {
        const usersExcludedFromPending = ['bot', 'app'];
        if (!lastLogin && !usersExcludedFromPending.includes(type)) {
            return t('Pending');
        }
        if (active && lastLogin) {
            return t('Active');
        }
        if (!active && lastLogin) {
            return t('Deactivated');
        }
    }, [active, lastLogin, t, type]);
    const roleNames = (roles || [])
        .map((roleId) => { var _a; return (_a = Roles_1.Roles.findOne(roleId, { fields: { name: 1 } })) === null || _a === void 0 ? void 0 : _a.name; })
        .filter((roleName) => !!roleName)
        .join(', ');
    const userId = user._id;
    const isAdmin = (_a = user.roles) === null || _a === void 0 ? void 0 : _a.includes('admin');
    const isActive = user.active;
    const isFederatedUser = !!user.federated;
    const changeAdminStatusAction = (0, useChangeAdminStatusAction_1.useChangeAdminStatusAction)(userId, isAdmin, onReload);
    const changeUserStatusAction = (0, useChangeUserStatusAction_1.useChangeUserStatusAction)(userId, isActive, onReload);
    const deleteUserAction = (0, useDeleteUserAction_1.useDeleteUserAction)(userId, onReload, onReload);
    const resetTOTPAction = (0, useResetTOTPAction_1.useResetTOTPAction)(userId);
    const resetE2EKeyAction = (0, useResetE2EEKeyAction_1.useResetE2EEKeyAction)(userId);
    const resendWelcomeEmail = (0, useSendWelcomeEmailMutation_1.useSendWelcomeEmailMutation)();
    const voipExtensionAction = (0, useVoipExtensionAction_1.useVoipExtensionAction)({
        enabled: showVoipExtension,
        extension: freeSwitchExtension,
        username,
        name,
    });
    const isNotPendingDeactivatedNorFederated = tab !== 'pending' && tab !== 'deactivated' && !isFederatedUser;
    const menuOptions = (0, react_1.useMemo)(() => (Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (voipExtensionAction && {
        voipExtensionAction: {
            label: { label: voipExtensionAction.label, icon: voipExtensionAction.icon },
            action: voipExtensionAction.action,
        },
    })), (isNotPendingDeactivatedNorFederated &&
        changeAdminStatusAction && {
        makeAdmin: {
            label: { label: changeAdminStatusAction.label, icon: changeAdminStatusAction.icon },
            action: changeAdminStatusAction.action,
        },
    })), (isNotPendingDeactivatedNorFederated &&
        resetE2EKeyAction && {
        resetE2EKey: { label: { label: resetE2EKeyAction.label, icon: resetE2EKeyAction.icon }, action: resetE2EKeyAction.action },
    })), (isNotPendingDeactivatedNorFederated &&
        resetTOTPAction && {
        resetTOTP: { label: { label: resetTOTPAction.label, icon: resetTOTPAction.icon }, action: resetTOTPAction.action },
    })), (changeUserStatusAction &&
        !isFederatedUser && {
        changeActiveStatus: {
            label: { label: changeUserStatusAction.label, icon: changeUserStatusAction.icon },
            action: changeUserStatusAction.action,
        },
    })), (deleteUserAction && {
        delete: { label: { label: deleteUserAction.label, icon: deleteUserAction.icon }, action: deleteUserAction.action },
    }))), [
        changeAdminStatusAction,
        changeUserStatusAction,
        deleteUserAction,
        isFederatedUser,
        isNotPendingDeactivatedNorFederated,
        resetE2EKeyAction,
        resetTOTPAction,
        voipExtensionAction,
    ]);
    const handleResendWelcomeEmail = () => resendWelcomeEmail.mutateAsync({ email: emails === null || emails === void 0 ? void 0 : emails[0].address });
    return ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableRow, { onKeyDown: (e) => onClick(_id, e), onClick: (e) => onClick(_id, e), tabIndex: 0, role: 'link', action: true, "qa-user-id": _id, children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', alignItems: 'center', children: [username && (0, jsx_runtime_1.jsx)(ui_avatar_1.UserAvatar, { size: isMobile || isLaptop ? 'x28' : 'x40', username: username, etag: avatarETag }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', flexGrow: 1, flexShrink: 1, flexBasis: '0%', alignSelf: 'center', alignItems: 'center', withTruncatedText: true, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { mi: 8, children: (0, jsx_runtime_1.jsx)(UserStatus_1.UserStatus, { status: status || core_typings_1.UserStatus.OFFLINE }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'p2', withTruncatedText: true, children: name || username })] })] }) }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'p2m', color: 'hint', withTruncatedText: true, children: username }) }), !isLaptop && (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: (emails === null || emails === void 0 ? void 0 : emails.length) && emails[0].address }), !isLaptop && (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: roleNames }), tab === 'all' && !isMobile && ((0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { fontScale: 'p2', color: 'hint', withTruncatedText: true, children: registrationStatusText })), tab === 'pending' && !isMobile && ((0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { fontScale: 'p2', color: 'hint', withTruncatedText: true, children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', alignContent: 'flex-end', children: active ? t('User_first_log_in') : t('Activation') }) })), tab === 'all' && showVoipExtension && ((0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { fontScale: 'p2', color: 'hint', withTruncatedText: true, children: freeSwitchExtension || t('Not_assigned') })), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { onClick: (e) => {
                    e.stopPropagation();
                }, children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', justifyContent: 'flex-end', children: [tab === 'pending' && ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: active ? ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { small: true, secondary: true, onClick: handleResendWelcomeEmail, children: t('Resend_welcome_email') })) : ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { small: true, primary: true, onClick: changeUserStatusAction === null || changeUserStatusAction === void 0 ? void 0 : changeUserStatusAction.action, disabled: isSeatsCapExceeded, children: t('Activate') })) })), (0, jsx_runtime_1.jsx)(fuselage_1.Menu, { mi: 4, placement: 'bottom-start', flexShrink: 0, "aria-label": t('More_actions'), title: t('More_actions'), renderItem: (_a) => {
                                var { label: { label, icon } } = _a, props = __rest(_a, ["label"]);
                                return ((0, jsx_runtime_1.jsx)(fuselage_1.Option, Object.assign({ label: label, title: label, icon: icon, variant: label === 'Delete' ? 'danger' : '' }, props)));
                            }, options: menuOptions }, 'menu')] }) })] }));
};
exports.default = UsersTableRow;
