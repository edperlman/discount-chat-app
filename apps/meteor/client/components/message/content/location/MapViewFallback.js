"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_client_1 = require("@rocket.chat/ui-client");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const MapViewFallback = ({ linkUrl }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { is: 'span', fontScale: 'p2', display: 'inline-flex', alignItems: 'center', paddingBlock: 4, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'map-pin', size: 'x20', color: 'hint' }), (0, jsx_runtime_1.jsx)(ui_client_1.ExternalLink, { to: linkUrl, children: t('Shared_Location') })] }));
};
exports.default = MapViewFallback;
