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
const Contextualbar_1 = require("../../../../components/Contextualbar");
const useScopeDict_1 = require("../../../hooks/useScopeDict");
const CannedResponse = ({ allowEdit, allowUse, data: { departmentName, shortcut, text, scope: dataScope, tags }, onClickBack, onClickEdit, onClickUse, }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const scope = (0, useScopeDict_1.useScopeDict)(dataScope, departmentName);
    return ((0, jsx_runtime_1.jsxs)(Contextualbar_1.Contextualbar, { color: 'default', display: 'flex', flexDirection: 'column', width: 'full', overflow: 'hidden', zIndex: 100, insetBlock: 0, children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarHeader, { children: [onClickBack && (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarAction, { onClick: onClickBack, title: t('Back_to_threads'), name: 'arrow-back' }), (0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarTitle, { children: ["!", shortcut] })] }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarContent, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { pb: '24px', children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { mbe: '16px', children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { fontScale: 'p2m', mbe: '8px', children: [t('Shortcut'), ":"] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { fontScale: 'c1', color: 'hint', children: ["!", shortcut] })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { mbe: '16px', children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { fontScale: 'p2m', mbe: '8px', children: [t('Content'), ":"] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { fontScale: 'c1', color: 'hint', children: ["\"", text, "\""] })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { mbe: '16px', children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { fontScale: 'p2m', mbe: '8px', children: [t('Sharing'), ":"] }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'c1', color: 'hint', children: scope })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { mbe: '16px', children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { fontScale: 'p2m', mbe: '8px', children: [t('Tags'), ":"] }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', children: tags && tags.length > 0 ? ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', w: 'full', flexDirection: 'row', mbs: '8px', flexWrap: 'wrap', children: tags.map((tag, idx) => ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { mie: '4px', mbe: '4px', children: (0, jsx_runtime_1.jsx)(fuselage_1.Tag, { children: tag }) }, idx))) })) : ('-') })] })] }) }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarFooter, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { stretch: true, children: [allowEdit && (0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: onClickEdit, children: t('Edit') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, disabled: !allowUse, onClick: onClickUse, children: t('Use') })] }) })] }));
};
exports.default = (0, react_1.memo)(CannedResponse);
