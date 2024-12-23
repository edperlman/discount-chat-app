"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_i18next_1 = require("react-i18next");
const className = (0, css_in_js_1.css) `
	padding-block: 6px;
	min-height: 28px;
	height: 28px;
`;
const VoipDialPadInput = ({ readOnly, value, onChange, onBackpaceClick }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsx)(fuselage_1.TextInput, { p: 0, readOnly: readOnly, height: '100%', minHeight: 0, value: value, className: className, "aria-label": t('Phone_number'), addon: (0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { small: true, icon: 'backspace', "aria-label": t('Remove_last_character'), "data-testid": 'dial-paid-input-backspace', size: '14px', disabled: !value, onClick: onBackpaceClick }), onChange: onChange }));
};
exports.default = VoipDialPadInput;
