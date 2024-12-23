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
const fuselage_toastbar_1 = require("@rocket.chat/fuselage-toastbar");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const errorHandling_1 = require("../lib/errorHandling");
const toast_1 = require("../lib/toast");
const contextValue = {
    dispatch: toast_1.dispatchToastMessage,
};
const ToastMessageInnerProvider = ({ children }) => {
    const dispatchToastBar = (0, fuselage_toastbar_1.useToastBarDispatch)();
    (0, react_1.useEffect)(() => (0, toast_1.subscribeToToastMessages)(({ type, message, title = '' }) => {
        if (type === 'error' && typeof message === 'object') {
            dispatchToastBar({ type, message: (0, errorHandling_1.getErrorMessage)(message) });
            return;
        }
        if (typeof message !== 'string' && message instanceof Error) {
            message = `[${message.name}] ${message.message}`;
        }
        if (type === 'warning') {
            return;
        }
        dispatchToastBar({ type, message: title + message });
    }), [dispatchToastBar]);
    return (0, jsx_runtime_1.jsx)(ui_contexts_1.ToastMessagesContext.Provider, { children: children, value: contextValue });
};
// eslint-disable-next-line react/no-multi-comp
const ToastMessagesProvider = ({ children }) => ((0, jsx_runtime_1.jsx)(fuselage_toastbar_1.ToastBarProvider, { children: (0, jsx_runtime_1.jsx)(ToastMessageInnerProvider, { children: children }) }));
exports.default = ToastMessagesProvider;
