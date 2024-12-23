"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
require("./UiKitElementWrapper.scss");
const fuselage_1 = require("@rocket.chat/fuselage");
const ElementWrapper = (props) => ((0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ className: 'uikit-element-wrapper' }, props)));
exports.default = ElementWrapper;
