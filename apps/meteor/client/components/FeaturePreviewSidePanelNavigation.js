"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeaturePreviewSidePanelNavigation = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_client_1 = require("@rocket.chat/ui-client");
const react_1 = __importDefault(require("react"));
const useSidePanelNavigation_1 = require("../hooks/useSidePanelNavigation");
const FeaturePreviewSidePanelNavigation = ({ children }) => {
    const disabled = !(0, useSidePanelNavigation_1.useSidePanelNavigationScreenSize)();
    return (0, jsx_runtime_1.jsx)(ui_client_1.FeaturePreview, { feature: 'sidepanelNavigation', disabled: disabled, children: children });
};
exports.FeaturePreviewSidePanelNavigation = FeaturePreviewSidePanelNavigation;
