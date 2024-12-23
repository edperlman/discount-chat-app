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
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const RoleCell_1 = __importDefault(require("./RoleCell"));
const lib_1 = require("../../../../../app/authorization/lib");
const GenericTable_1 = require("../../../../components/GenericTable");
const useChangeRole_1 = require("../hooks/useChangeRole");
const getName = (t, permission) => {
    if (permission.level === lib_1.CONSTANTS.SETTINGS_LEVEL) {
        let path = '';
        if (permission.group) {
            path = `${t(permission.group)} > `;
        }
        if (permission.section) {
            path = `${path}${t(permission.section)} > `;
        }
        return `${path}${t(permission.settingId)}`;
    }
    return t(permission._id);
};
const PermissionRow = ({ permission, roleList, onGrant, onRemove }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { _id, roles } = permission;
    const [hovered, setHovered] = (0, react_1.useState)(false);
    const changeRole = (0, useChangeRole_1.useChangeRole)({ onGrant, onRemove, permissionId: _id });
    const onMouseEnter = (0, fuselage_hooks_1.useMutableCallback)(() => setHovered(true));
    const onMouseLeave = (0, fuselage_hooks_1.useMutableCallback)(() => setHovered(false));
    return ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableRow, { role: 'link', action: true, tabIndex: 0, onMouseEnter: onMouseEnter, onMouseLeave: onMouseLeave, children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { maxWidth: 'x300', withTruncatedText: true, title: t(`${_id}_description`), children: getName(t, permission) }), roleList.map(({ _id, name, description }) => ((0, jsx_runtime_1.jsx)(RoleCell_1.default, { _id: _id, name: name, description: description, grantedRoles: roles, onChange: changeRole, lineHovered: hovered, permissionId: _id }, _id)))] }, _id));
};
exports.default = (0, react_1.memo)(PermissionRow);
