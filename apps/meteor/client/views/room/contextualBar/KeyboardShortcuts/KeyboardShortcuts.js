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
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const KeyboardShortcutSection_1 = __importDefault(require("./KeyboardShortcutSection"));
const Contextualbar_1 = require("../../../../components/Contextualbar");
const KeyboardShortcuts = ({ handleClose }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarHeader, { children: [(0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarIcon, { name: 'keyboard' }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarTitle, { children: t('Keyboard_Shortcuts_Title') }), handleClose && (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarClose, { onClick: handleClose })] }), (0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarScrollableContent, { children: [(0, jsx_runtime_1.jsx)(KeyboardShortcutSection_1.default, { title: t('Keyboard_Shortcuts_Open_Channel_Slash_User_Search'), command: t('Keyboard_Shortcuts_Keys_1') }), (0, jsx_runtime_1.jsx)(KeyboardShortcutSection_1.default, { title: t('Keyboard_Shortcuts_Mark_all_as_read'), command: t('Keyboard_Shortcuts_Keys_8') }), (0, jsx_runtime_1.jsx)(KeyboardShortcutSection_1.default, { title: t('Keyboard_Shortcuts_Edit_Previous_Message'), command: t('Keyboard_Shortcuts_Keys_2') }), (0, jsx_runtime_1.jsx)(KeyboardShortcutSection_1.default, { title: t('Keyboard_Shortcuts_Move_To_Beginning_Of_Message'), command: t('Keyboard_Shortcuts_Keys_3') }), (0, jsx_runtime_1.jsx)(KeyboardShortcutSection_1.default, { title: t('Keyboard_Shortcuts_Move_To_Beginning_Of_Message'), command: t('Keyboard_Shortcuts_Keys_4') }), (0, jsx_runtime_1.jsx)(KeyboardShortcutSection_1.default, { title: t('Keyboard_Shortcuts_Move_To_End_Of_Message'), command: t('Keyboard_Shortcuts_Keys_5') }), (0, jsx_runtime_1.jsx)(KeyboardShortcutSection_1.default, { title: t('Keyboard_Shortcuts_Move_To_End_Of_Message'), command: t('Keyboard_Shortcuts_Keys_6') }), (0, jsx_runtime_1.jsx)(KeyboardShortcutSection_1.default, { title: t('Keyboard_Shortcuts_New_Line_In_Message'), command: t('Keyboard_Shortcuts_Keys_7') })] })] }));
};
exports.default = (0, react_1.memo)(KeyboardShortcuts);
