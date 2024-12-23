"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const GenericModal_1 = __importDefault(require("./GenericModal"));
const UrlChangeModal = ({ onConfirm, siteUrl, currentUrl, onClose }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(GenericModal_1.default, { variant: 'warning', title: t('Warning'), onConfirm: onConfirm, onClose: onClose, onCancel: onClose, confirmText: t('Yes'), children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'p', mbe: 16, dangerouslySetInnerHTML: {
                    __html: t('The_setting_s_is_configured_to_s_and_you_are_accessing_from_s', {
                        postProcess: 'sprintf',
                        sprintf: [t('Site_Url'), siteUrl, currentUrl],
                    }),
                } }), (0, jsx_runtime_1.jsx)("p", { dangerouslySetInnerHTML: {
                    __html: t('Do_you_want_to_change_to_s_question', {
                        postProcess: 'sprintf',
                        sprintf: [currentUrl],
                    }),
                } })] }));
};
exports.default = UrlChangeModal;
