"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_aria_1 = require("react-aria");
const react_i18next_1 = require("react-i18next");
const dialPadButtonClass = (0, css_in_js_1.css) `
	width: 52px;
	height: 40px;
	min-width: 52px;
	padding: 4px;

	> .rcx-button--content {
		display: flex;
		flex-direction: column;
	}
`;
const VoipDialPadButton = ({ digit, subDigit, longPressDigit, onClick }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { longPressProps } = (0, react_aria_1.useLongPress)({
        accessibilityDescription: `${t(`Long_press_to_do_x`, { action: longPressDigit })}`,
        onLongPress: () => longPressDigit && onClick(longPressDigit),
    });
    const { pressProps } = (0, react_aria_1.usePress)({
        onPress: () => onClick(digit),
    });
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Button, Object.assign({ className: dialPadButtonClass }, (0, react_aria_1.mergeProps)(pressProps, longPressProps), { "data-testid": `dial-pad-button-${digit}`, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'span', fontSize: 16, lineHeight: 16, children: digit }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'span', fontSize: 12, lineHeight: 12, mbs: 4, color: 'hint', "aria-hidden": true, children: subDigit })] })));
};
exports.default = VoipDialPadButton;
