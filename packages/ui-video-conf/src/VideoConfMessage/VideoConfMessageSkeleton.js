"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const VideoConfMessage_1 = __importDefault(require("./VideoConfMessage"));
const VideoConfMessageRow_1 = __importDefault(require("./VideoConfMessageRow"));
const VideoConfMessageSkeleton = (props) => ((0, jsx_runtime_1.jsxs)(VideoConfMessage_1.default, Object.assign({}, props, { children: [(0, jsx_runtime_1.jsx)(VideoConfMessageRow_1.default, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { width: 'full', pb: 4 }) }), (0, jsx_runtime_1.jsx)(VideoConfMessageRow_1.default, { backgroundColor: 'tint', children: (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { width: 'full', pb: 4 }) })] })));
exports.default = VideoConfMessageSkeleton;
