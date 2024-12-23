"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const MessageComposerToolbar = (props) => ((0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ backgroundColor: 'surface-neutral', p: 4, display: 'flex', justifyContent: 'space-between', w: 'full' }, props)));
exports.default = MessageComposerToolbar;
