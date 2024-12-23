"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = require("react");
const messageComposerInputStyle = (0, css_in_js_1.css) `
	resize: none;

	&::placeholder {
		color: ${fuselage_1.Palette.text['font-annotation']};
	}
`;
const MessageComposerInput = (0, react_1.forwardRef)(function MessageComposerInput(props, ref) {
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'label', width: 'full', fontSize: 0, children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ className: [messageComposerInputStyle, 'rc-message-box__textarea js-input-message'], color: 'default', width: 'full', minHeight: '20px', maxHeight: '155px', rows: 1, fontScale: 'p2', ref: ref, pi: 12, mb: 16, borderWidth: 0, is: 'textarea' }, props)) }));
});
exports.default = MessageComposerInput;
