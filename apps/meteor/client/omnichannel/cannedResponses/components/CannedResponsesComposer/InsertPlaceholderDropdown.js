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
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const InsertPlaceholderDropdown = ({ onChange, textAreaRef, setVisible }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const clickable = (0, css_in_js_1.css) `
		cursor: pointer;
	`;
    const setPlaceholder = (name) => {
        if (textAreaRef === null || textAreaRef === void 0 ? void 0 : textAreaRef.current) {
            const text = textAreaRef.current.value;
            const startPos = textAreaRef.current.selectionStart;
            const placeholder = `{{${name}}}`;
            textAreaRef.current.value = text.slice(0, startPos) + placeholder + text.slice(startPos);
            textAreaRef.current.focus();
            textAreaRef.current.setSelectionRange(startPos + placeholder.length, startPos + placeholder.length);
            setVisible(false);
            onChange(textAreaRef.current.value);
        }
    };
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { textTransform: 'uppercase', fontScale: 'c1', fontSize: '10px', children: t('Contact') }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { is: 'ul', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { className: clickable, is: 'li', onClick: () => setPlaceholder('contact.name'), children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mb: '4px', style: { width: '100%' }, fontScale: 'p2', children: t('Name') }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { className: clickable, is: 'li', onClick: () => setPlaceholder('contact.email'), children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mb: '4px', style: { width: '100%' }, fontScale: 'p2', children: t('Email') }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { className: clickable, is: 'li', onClick: () => setPlaceholder('contact.phone'), children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mb: '4px', style: { width: '100%' }, fontScale: 'p2', children: t('Phone') }) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Divider, {}), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { textTransform: 'uppercase', fontScale: 'c1', fontSize: '10px', children: t('Agent') }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { is: 'ul', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { className: clickable, is: 'li', onClick: () => setPlaceholder('agent.name'), children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mb: '4px', style: { width: '100%' }, fontScale: 'p2', children: t('Name') }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { className: clickable, is: 'li', onClick: () => setPlaceholder('agent.email'), children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mb: '4px', style: { width: '100%' }, fontScale: 'p2', children: t('Email') }) })] })] }));
};
exports.default = (0, react_1.memo)(InsertPlaceholderDropdown);
