"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const useHighlightedCode_1 = require("../../../../../hooks/useHighlightedCode");
const AppLogsItemEntry = ({ severity, timestamp, caller, args }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { color: 'default', children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Box, { children: [severity, ": ", timestamp, " ", t('Caller'), ": ", caller] }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { withRichContent: true, width: 'full', children: (0, jsx_runtime_1.jsx)("pre", { children: (0, jsx_runtime_1.jsx)("code", { dangerouslySetInnerHTML: {
                            __html: (0, useHighlightedCode_1.useHighlightedCode)('json', JSON.stringify(args, null, 2)),
                        } }) }) })] }));
};
exports.default = AppLogsItemEntry;
