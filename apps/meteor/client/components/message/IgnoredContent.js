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
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const IgnoredContent = ({ onShowMessageIgnored }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const showMessageIgnored = (event) => {
        event.stopPropagation();
        onShowMessageIgnored();
    };
    return ((0, jsx_runtime_1.jsx)(fuselage_1.MessageBody, { "data-qa-type": 'message-body', dir: 'auto', children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', alignItems: 'center', fontSize: 'c2', color: 'hint', children: (0, jsx_runtime_1.jsxs)("span", { tabIndex: 0, role: 'button', onClick: showMessageIgnored, onKeyDown: (e) => e.code === 'Enter' && showMessageIgnored(e), style: { cursor: 'pointer' }, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'chevron-left' }), " ", t('Message_Ignored')] }) }) }));
};
exports.default = (0, react_1.memo)(IgnoredContent);
