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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = __importStar(require("react"));
const lib_1 = require("../../../../../app/authorization/lib");
const GenericTable_1 = require("../../../../components/GenericTable");
const RoleCell = ({ _id, name, description, onChange, lineHovered, permissionId, grantedRoles = [] }) => {
    const [granted, setGranted] = (0, react_1.useState)(() => !!grantedRoles.includes(_id));
    const [loading, setLoading] = (0, react_1.useState)(false);
    const isRestrictedForRole = lib_1.AuthorizationUtils.isPermissionRestrictedForRole(permissionId, _id);
    const handleChange = (0, fuselage_hooks_1.useMutableCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        setLoading(true);
        const result = yield onChange(_id, granted);
        setGranted(result);
        setLoading(false);
    }));
    const isDisabled = !!loading || !!isRestrictedForRole;
    return ((0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: (0, jsx_runtime_1.jsxs)(fuselage_1.Margins, { inline: 2, children: [(0, jsx_runtime_1.jsx)(fuselage_1.CheckBox, { checked: granted, onChange: handleChange, disabled: isDisabled }), !loading && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'inline', color: 'hint', invisible: !lineHovered, children: description || name })), loading && (0, jsx_runtime_1.jsx)(fuselage_1.Throbber, { size: 'x12', display: 'inline-block' })] }) }));
};
exports.default = (0, react_1.memo)(RoleCell);
