"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const PermissionsTable_1 = __importDefault(require("./PermissionsTable"));
const UsersInRole_1 = __importDefault(require("./UsersInRole"));
const PageSkeleton_1 = __importDefault(require("../../../components/PageSkeleton"));
const useIsEnterprise_1 = require("../../../hooks/useIsEnterprise");
const NotAuthorizedPage_1 = __importDefault(require("../../notAuthorized/NotAuthorizedPage"));
const PermissionsRouter = () => {
    const canViewPermission = (0, ui_contexts_1.usePermission)('access-permissions');
    const canViewSettingPermission = (0, ui_contexts_1.usePermission)('access-setting-permissions');
    const context = (0, ui_contexts_1.useRouteParameter)('context');
    const { data, isLoading } = (0, useIsEnterprise_1.useIsEnterprise)();
    if (isLoading) {
        (0, jsx_runtime_1.jsx)(PageSkeleton_1.default, {});
    }
    if (!canViewPermission && !canViewSettingPermission) {
        return (0, jsx_runtime_1.jsx)(NotAuthorizedPage_1.default, {});
    }
    if (context === 'users-in-role') {
        return (0, jsx_runtime_1.jsx)(UsersInRole_1.default, {});
    }
    return (0, jsx_runtime_1.jsx)(PermissionsTable_1.default, { isEnterprise: !!(data === null || data === void 0 ? void 0 : data.isEnterprise) });
};
exports.default = PermissionsRouter;
