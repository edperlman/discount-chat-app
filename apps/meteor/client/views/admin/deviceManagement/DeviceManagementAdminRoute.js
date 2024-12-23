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
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const DeviceManagementAdminPage_1 = __importDefault(require("./DeviceManagementAdminPage"));
const getURL_1 = require("../../../../app/utils/client/getURL");
const GenericUpsellModal_1 = __importDefault(require("../../../components/GenericUpsellModal"));
const hooks_1 = require("../../../components/GenericUpsellModal/hooks");
const PageSkeleton_1 = __importDefault(require("../../../components/PageSkeleton"));
const useHasLicenseModule_1 = require("../../../hooks/useHasLicenseModule");
const NotAuthorizedPage_1 = __importDefault(require("../../notAuthorized/NotAuthorizedPage"));
const DeviceManagementAdminRoute = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const router = (0, ui_contexts_1.useRouter)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const isModalOpen = !!(0, ui_contexts_1.useCurrentModal)();
    const hasDeviceManagement = (0, useHasLicenseModule_1.useHasLicenseModule)('device-management');
    const canViewDeviceManagement = (0, ui_contexts_1.usePermission)('view-device-management');
    const { shouldShowUpsell, handleManageSubscription } = (0, hooks_1.useUpsellActions)(hasDeviceManagement);
    (0, react_1.useEffect)(() => {
        if (shouldShowUpsell) {
            setModal((0, jsx_runtime_1.jsx)(GenericUpsellModal_1.default, { "aria-label": t('Device_Management'), title: t('Device_Management'), img: (0, getURL_1.getURL)('images/device-management.png'), subtitle: t('Ensure_secure_workspace_access'), description: t('Manage_which_devices'), onClose: () => setModal(null), onConfirm: handleManageSubscription, onCancel: () => setModal(null) }));
        }
    }, [shouldShowUpsell, router, setModal, t, handleManageSubscription]);
    if (isModalOpen) {
        return (0, jsx_runtime_1.jsx)(PageSkeleton_1.default, {});
    }
    if (!canViewDeviceManagement || !hasDeviceManagement) {
        return (0, jsx_runtime_1.jsx)(NotAuthorizedPage_1.default, {});
    }
    return (0, jsx_runtime_1.jsx)(DeviceManagementAdminPage_1.default, {});
};
exports.default = DeviceManagementAdminRoute;
