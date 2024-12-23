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
exports.useVideoConfOpenCall = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const VideoConfBlockModal_1 = __importDefault(require("../VideoConfBlockModal"));
const useVideoConfOpenCall = () => {
    const setModal = (0, ui_contexts_1.useSetModal)();
    const handleOpenCall = (0, react_1.useCallback)((callUrl, providerName) => {
        const desktopApp = window.RocketChatDesktop;
        if (!(desktopApp === null || desktopApp === void 0 ? void 0 : desktopApp.openInternalVideoChatWindow)) {
            const open = () => window.open(callUrl);
            const popup = open();
            if (popup !== null) {
                return;
            }
            setModal((0, jsx_runtime_1.jsx)(VideoConfBlockModal_1.default, { onClose: () => setModal(null), onConfirm: open }));
            return;
        }
        desktopApp.openInternalVideoChatWindow(callUrl, { providerName });
    }, [setModal]);
    return handleOpenCall;
};
exports.useVideoConfOpenCall = useVideoConfOpenCall;
