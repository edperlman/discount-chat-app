"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const _1 = require(".");
const MessageComposerSkeleton = () => ((0, jsx_runtime_1.jsxs)(_1.MessageComposer, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { width: '100%', display: 'flex', alignItems: 'center', height: 'x52', pi: 12, children: (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { width: '100%', height: 36 }) }), (0, jsx_runtime_1.jsx)(_1.MessageComposerToolbar, { height: 36 })] }));
exports.default = MessageComposerSkeleton;
