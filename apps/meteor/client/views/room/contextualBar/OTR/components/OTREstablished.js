"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const OTREstablished = ({ onClickRefresh, onClickEnd }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { stretch: true, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: onClickRefresh, children: t('Refresh_keys') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { secondary: true, danger: true, onClick: onClickEnd, children: t('End_OTR') })] }));
};
exports.default = OTREstablished;
