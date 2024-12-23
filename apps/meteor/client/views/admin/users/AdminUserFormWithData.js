"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const AdminUserForm_1 = __importDefault(require("./AdminUserForm"));
const Skeleton_1 = require("../../../components/Skeleton");
const useUserInfoQuery_1 = require("../../../hooks/useUserInfoQuery");
const AdminUserFormWithData = ({ uid, onReload, context, roleData, roleError }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { data, isLoading, isError, refetch } = (0, useUserInfoQuery_1.useUserInfoQuery)({ userId: uid });
    const handleReload = (0, fuselage_hooks_1.useEffectEvent)(() => {
        onReload();
        refetch();
    });
    if (isLoading) {
        return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { p: 24, children: (0, jsx_runtime_1.jsx)(Skeleton_1.FormSkeleton, {}) }));
    }
    if (isError) {
        return ((0, jsx_runtime_1.jsx)(fuselage_1.Callout, { m: 16, type: 'danger', children: t('User_not_found') }));
    }
    if ((data === null || data === void 0 ? void 0 : data.user) && !!data.user.federated) {
        return ((0, jsx_runtime_1.jsx)(fuselage_1.Callout, { m: 16, type: 'danger', children: t('Edit_Federated_User_Not_Allowed') }));
    }
    return ((0, jsx_runtime_1.jsx)(AdminUserForm_1.default, { userData: data === null || data === void 0 ? void 0 : data.user, onReload: onReload, context: context, refetchUserFormData: handleReload, roleData: roleData, roleError: roleError }));
};
exports.default = AdminUserFormWithData;
