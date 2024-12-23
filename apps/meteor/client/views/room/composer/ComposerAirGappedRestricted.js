"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_composer_1 = require("@rocket.chat/ui-composer");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const ComposerAirGappedRestricted = () => {
    return ((0, jsx_runtime_1.jsxs)(ui_composer_1.MessageFooterCallout, { color: 'default', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'warning', size: 20, mie: 4 }), (0, jsx_runtime_1.jsx)("span", { children: (0, jsx_runtime_1.jsxs)(react_i18next_1.Trans, { i18nKey: 'Composer_readonly_airgapped', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'span', fontWeight: 600, children: "Workspace in read-only mode." }), "Admins can restore full functionality by connecting it to internet or upgrading to a premium plan."] }) })] }));
};
exports.default = ComposerAirGappedRestricted;
