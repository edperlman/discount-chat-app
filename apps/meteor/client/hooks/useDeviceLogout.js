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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDeviceLogout = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const useEndpointAction_1 = require("./useEndpointAction");
const GenericModal_1 = __importDefault(require("../components/GenericModal"));
const useDeviceLogout = (sessionId, endpoint) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const deviceManagementRouter = (0, ui_contexts_1.useRoute)('device-management');
    const routeId = (0, ui_contexts_1.useRouteParameter)('id');
    const logoutDevice = (0, useEndpointAction_1.useEndpointAction)('POST', endpoint);
    const handleCloseContextualBar = (0, react_1.useCallback)(() => deviceManagementRouter.push({}), [deviceManagementRouter]);
    const isContextualBarOpen = routeId === sessionId;
    const handleLogoutDeviceModal = (0, react_1.useCallback)((onReload) => {
        const closeModal = () => setModal(null);
        const handleLogoutDevice = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield logoutDevice({ sessionId });
                onReload();
                isContextualBarOpen && handleCloseContextualBar();
                dispatchToastMessage({ type: 'success', message: t('Device_Logged_Out') });
            }
            catch (error) {
                dispatchToastMessage({ type: 'error', message: error });
            }
            finally {
                closeModal();
            }
        });
        setModal((0, jsx_runtime_1.jsx)(GenericModal_1.default, { title: t('Logout_Device'), variant: 'danger', confirmText: t('Logout_Device'), cancelText: t('Cancel'), onConfirm: handleLogoutDevice, onCancel: closeModal, onClose: closeModal, children: t('Device_Logout_Text') }));
    }, [setModal, t, logoutDevice, sessionId, isContextualBarOpen, handleCloseContextualBar, dispatchToastMessage]);
    return handleLogoutDeviceModal;
};
exports.useDeviceLogout = useDeviceLogout;
