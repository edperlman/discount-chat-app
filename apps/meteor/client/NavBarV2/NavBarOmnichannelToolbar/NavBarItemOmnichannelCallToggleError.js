"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const NavBarItemOmnichannelCallToggleError = (props) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return (0, jsx_runtime_1.jsx)(fuselage_1.NavBarItem, Object.assign({ icon: 'phone', danger: true, "data-tooltip": t('Error'), disabled: true }, props));
};
exports.default = NavBarItemOmnichannelCallToggleError;
