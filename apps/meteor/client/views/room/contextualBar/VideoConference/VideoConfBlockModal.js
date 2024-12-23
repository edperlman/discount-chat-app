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
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const GenericModal_1 = __importDefault(require("../../../../components/GenericModal"));
const VideoConfBlockModal = ({ onClose, onConfirm }) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const workspaceUrl = (0, ui_contexts_1.useSetting)('Site_Url');
    const confirmButtonContent = ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Icon, { mie: 8, size: 'x20', name: 'new-window' }), t('Open_call')] }));
    const handleConfirm = (0, react_1.useCallback)(() => {
        onConfirm();
        onClose();
    }, [onClose, onConfirm]);
    return ((0, jsx_runtime_1.jsx)(GenericModal_1.default, { open: true, icon: null, variant: 'warning', title: t('Open_call_in_new_tab'), confirmText: confirmButtonContent, onConfirm: handleConfirm, onCancel: onClose, onClose: onClose, children: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbe: 24, children: t('Your_web_browser_blocked_Rocket_Chat_from_opening_tab') }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { children: [t('To_prevent_seeing_this_message_again_allow_popups_from_workspace_URL'), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'span', fontWeight: 700, children: workspaceUrl })] })] }) }));
};
exports.default = VideoConfBlockModal;
