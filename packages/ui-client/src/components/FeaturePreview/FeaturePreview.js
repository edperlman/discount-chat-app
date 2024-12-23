"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeaturePreviewOff = exports.FeaturePreviewOn = exports.FeaturePreview = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const useFeaturePreview_1 = require("../../hooks/useFeaturePreview");
const FeaturePreview = ({ feature, disabled = false, children, }) => {
    const featureToggleEnabled = (0, useFeaturePreview_1.useFeaturePreview)(feature) && !disabled;
    const toggledChildren = react_1.Children.map(children, (child) => (0, react_1.cloneElement)(child, {
        featureToggleEnabled,
    }));
    return (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: null, children: toggledChildren });
};
exports.FeaturePreview = FeaturePreview;
const FeaturePreviewOn = ({ children, featureToggleEnabled }) => ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: featureToggleEnabled && children }));
exports.FeaturePreviewOn = FeaturePreviewOn;
const FeaturePreviewOff = ({ children, featureToggleEnabled }) => ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: !featureToggleEnabled && children }));
exports.FeaturePreviewOff = FeaturePreviewOff;
