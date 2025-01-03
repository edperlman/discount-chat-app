"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const UpdateRocketChatButton = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { icon: 'new-window', primary: true, is: 'a', href: 'https://docs.rocket.chat/v1/docs/en/updating-rocketchat', external: true, children: t('Update') }));
};
exports.default = UpdateRocketChatButton;