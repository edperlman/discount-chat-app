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
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const CustomRoleUpsellModal_1 = __importDefault(require("./CustomRoleUpsellModal"));
const EditRolePageWithData_1 = __importDefault(require("./EditRolePageWithData"));
const Contextualbar_1 = require("../../../components/Contextualbar");
const useHasLicenseModule_1 = require("../../../hooks/useHasLicenseModule");
const PermissionsContextBar = () => {
    const t = (0, ui_contexts_1.useTranslation)();
    const _id = (0, ui_contexts_1.useRouteParameter)('_id');
    const context = (0, ui_contexts_1.useRouteParameter)('context');
    const router = (0, ui_contexts_1.useRoute)('admin-permissions');
    const setModal = (0, ui_contexts_1.useSetModal)();
    const hasCustomRolesModule = (0, useHasLicenseModule_1.useHasLicenseModule)('custom-roles') === true;
    const handleCloseContextualbar = (0, fuselage_hooks_1.useMutableCallback)(() => {
        router.push({});
    });
    (0, react_1.useEffect)(() => {
        if (context !== 'new' || hasCustomRolesModule) {
            return;
        }
        setModal((0, jsx_runtime_1.jsx)(CustomRoleUpsellModal_1.default, { onClose: () => setModal(null) }));
        handleCloseContextualbar();
    }, [context, hasCustomRolesModule, handleCloseContextualbar, setModal]);
    return ((context && ((0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarDialog, { children: (0, jsx_runtime_1.jsxs)(Contextualbar_1.Contextualbar, { children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarHeader, { children: [(0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarTitle, { children: context === 'edit' ? t('Role_Editing') : t('New_role') }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarClose, { onClick: handleCloseContextualbar })] }), (0, jsx_runtime_1.jsx)(EditRolePageWithData_1.default, { roleId: _id })] }) }))) ||
        null);
};
exports.default = PermissionsContextBar;
