"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_client_1 = require("@rocket.chat/ui-client");
const react_1 = __importDefault(require("react"));
const ContextualbarTitle = (props) => ((0, jsx_runtime_1.jsxs)(ui_client_1.FeaturePreview, { feature: 'newNavigation', children: [(0, jsx_runtime_1.jsx)(ui_client_1.FeaturePreviewOff, { children: (0, jsx_runtime_1.jsx)(fuselage_1.ContextualbarTitle, Object.assign({ id: 'contextualbarTitle' }, props)) }), (0, jsx_runtime_1.jsx)(ui_client_1.FeaturePreviewOn, { children: (0, jsx_runtime_1.jsx)(fuselage_1.ContextualbarV2Title, Object.assign({ id: 'contextualbarTitle' }, props)) })] }));
exports.default = ContextualbarTitle;
