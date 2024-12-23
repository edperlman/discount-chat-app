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
const GenericTable_1 = require("../../../../components/GenericTable");
const useFormatDateAndTime_1 = require("../../../../hooks/useFormatDateAndTime");
const AccountTokensRow = ({ bypassTwoFactor, createdAt, isMedium, lastTokenPart, name, onRegenerate, onRemove }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const formatDateAndTime = (0, useFormatDateAndTime_1.useFormatDateAndTime)();
    const handleRegenerate = (0, react_1.useCallback)(() => onRegenerate(name), [name, onRegenerate]);
    const handleRemove = (0, react_1.useCallback)(() => onRemove(name), [name, onRemove]);
    return ((0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableRow, { tabIndex: 0, role: 'link', "qa-token-name": name, children: [(0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, color: 'default', fontScale: 'p2m', children: name }), isMedium && (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: formatDateAndTime(createdAt) }), (0, jsx_runtime_1.jsxs)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: ["...", lastTokenPart] }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: bypassTwoFactor ? t('Ignore') : t('Require') }), (0, jsx_runtime_1.jsx)(GenericTable_1.GenericTableCell, { withTruncatedText: true, children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { title: t('Refresh'), icon: 'refresh', small: true, secondary: true, onClick: handleRegenerate }), (0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { title: t('Remove'), icon: 'trash', small: true, secondary: true, onClick: handleRemove })] }) })] }, name));
};
exports.default = AccountTokensRow;
