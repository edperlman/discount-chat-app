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
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const defaultPermissions = [
    'user.read',
    'user.write',
    'upload.read',
    'upload.write',
    'ui.interact',
    'server-setting.read',
    'server-setting.write',
    'room.read',
    'room.write',
    'message.read',
    'message.write',
    'livechat-department.read',
    'livechat-department.write',
    'livechat-room.read',
    'livechat-room.write',
    'livechat-message.read',
    'livechat-message.write',
    'livechat-visitor.read',
    'livechat-visitor.write',
    'livechat-status.read',
    'livechat-custom-fields.write',
    'scheduler',
    'networking',
    'persistence',
    'env.read',
    'slashcommand',
    'api',
];
const AppPermissionsList = ({ appPermissions }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const handleAppPermissions = (permission) => t(`Apps_Permissions_${permission.replace('.', '_')}`);
    if (appPermissions === null || appPermissions === void 0 ? void 0 : appPermissions.length) {
        return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: appPermissions.map((permission) => ((0, jsx_runtime_1.jsxs)(react_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("li", { children: handleAppPermissions(permission.name) }), permission.required && ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { is: 'span', color: 'status-font-on-danger', children: ["(", t('required'), ")"] }))] }, permission.name))) }));
    }
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: defaultPermissions.map((permission) => ((0, jsx_runtime_1.jsx)(react_1.Fragment, { children: (0, jsx_runtime_1.jsx)("li", { children: handleAppPermissions(permission) }) }, permission))) }));
};
exports.default = AppPermissionsList;
