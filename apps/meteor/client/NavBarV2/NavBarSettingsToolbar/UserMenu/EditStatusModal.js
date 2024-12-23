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
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const UserStatusMenu_1 = __importDefault(require("../../../components/UserStatusMenu"));
const constants_1 = require("../../../lib/constants");
const EditStatusModal = ({ onClose, userStatus, userStatusText }) => {
    const allowUserStatusMessageChange = (0, ui_contexts_1.useSetting)('Accounts_AllowUserStatusMessageChange');
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const [customStatus, setCustomStatus] = (0, fuselage_hooks_1.useLocalStorage)('Local_Custom_Status', '');
    const initialStatusText = customStatus || userStatusText;
    const t = (0, ui_contexts_1.useTranslation)();
    const [statusText, setStatusText] = (0, react_1.useState)(initialStatusText);
    const [statusType, setStatusType] = (0, react_1.useState)(userStatus);
    const [statusTextError, setStatusTextError] = (0, react_1.useState)();
    const setUserStatus = (0, ui_contexts_1.useEndpoint)('POST', '/v1/users.setStatus');
    const handleStatusText = (0, fuselage_hooks_1.useEffectEvent)((e) => {
        setStatusText(e.currentTarget.value);
        if (statusText && statusText.length > constants_1.USER_STATUS_TEXT_MAX_LENGTH) {
            return setStatusTextError(t('Max_length_is', constants_1.USER_STATUS_TEXT_MAX_LENGTH));
        }
        return setStatusTextError(undefined);
    });
    const handleStatusType = (type) => setStatusType(type);
    const handleSaveStatus = (0, react_1.useCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield setUserStatus({ message: statusText, status: statusType });
            setCustomStatus(statusText);
            dispatchToastMessage({ type: 'success', message: t('StatusMessage_Changed_Successfully') });
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
        onClose();
    }), [dispatchToastMessage, setUserStatus, statusText, statusType, onClose, t]);
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Modal, { wrapperFunction: (props) => ((0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ is: 'form', onSubmit: (e) => {
                e.preventDefault();
                handleSaveStatus();
            } }, props))), children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Header, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Modal.Icon, { name: 'info' }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Title, { children: t('Edit_Status') }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Close, { onClick: onClose })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Content, { fontScale: 'p2', children: (0, jsx_runtime_1.jsx)(fuselage_1.FieldGroup, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('StatusMessage') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, { error: statusTextError, disabled: !allowUserStatusMessageChange, flexGrow: 1, value: statusText, onChange: handleStatusText, placeholder: t('StatusMessage_Placeholder'), addon: (0, jsx_runtime_1.jsx)(UserStatusMenu_1.default, { margin: 'neg-x2', onChange: handleStatusType, initialStatus: statusType }) }) }), !allowUserStatusMessageChange && (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { children: t('StatusMessage_Change_Disabled') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { children: statusTextError })] }) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Footer, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Modal.FooterControllers, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { secondary: true, onClick: onClose, children: t('Cancel') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, type: 'submit', disabled: !!statusTextError, children: t('Save') })] }) })] }));
};
exports.default = EditStatusModal;
