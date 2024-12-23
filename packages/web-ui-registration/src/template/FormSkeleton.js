"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const layout_1 = require("@rocket.chat/layout");
const FormSkeleton = () => {
    return ((0, jsx_runtime_1.jsxs)(layout_1.Form, { "aria-busy": true, children: [(0, jsx_runtime_1.jsx)(layout_1.Form.Header, { children: (0, jsx_runtime_1.jsx)(layout_1.Form.Title, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, {}) }) }), (0, jsx_runtime_1.jsx)(layout_1.Form.Container, {}), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, {}) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldDescription, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, {}) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.InputBox.Skeleton, {}) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, {}) })] }), (0, jsx_runtime_1.jsx)(layout_1.Form.Footer, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, {}) })] }));
};
exports.default = FormSkeleton;
