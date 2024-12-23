"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_client_1 = require("@rocket.chat/ui-client");
const react_1 = __importDefault(require("react"));
const HeaderSkeleton_1 = __importDefault(require("./Header/HeaderSkeleton"));
const HeaderSkeleton_2 = __importDefault(require("./HeaderV2/HeaderSkeleton"));
const RoomComposerSkeleton_1 = __importDefault(require("./composer/RoomComposer/RoomComposerSkeleton"));
const RoomLayout_1 = __importDefault(require("./layout/RoomLayout"));
const MessageListSkeleton_1 = __importDefault(require("../../components/message/list/MessageListSkeleton"));
const RoomSkeleton = () => ((0, jsx_runtime_1.jsx)(RoomLayout_1.default, { header: (0, jsx_runtime_1.jsxs)(ui_client_1.FeaturePreview, { feature: 'newNavigation', children: [(0, jsx_runtime_1.jsx)(ui_client_1.FeaturePreviewOff, { children: (0, jsx_runtime_1.jsx)(HeaderSkeleton_1.default, {}) }), (0, jsx_runtime_1.jsx)(ui_client_1.FeaturePreviewOn, { children: (0, jsx_runtime_1.jsx)(HeaderSkeleton_2.default, {}) })] }), body: (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(MessageListSkeleton_1.default, {}), (0, jsx_runtime_1.jsx)(RoomComposerSkeleton_1.default, {})] }) }));
exports.default = RoomSkeleton;
