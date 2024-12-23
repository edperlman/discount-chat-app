"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const colors_json_1 = __importDefault(require("@rocket.chat/fuselage-tokens/colors.json"));
const styled_1 = __importDefault(require("@rocket.chat/styled"));
const react_1 = require("react");
const react_error_boundary_1 = require("react-error-boundary");
const Fallback = (0, styled_1.default)('span') `
	text-decoration: underline;
	text-decoration-color: ${colors_json_1.default.r400};
`;
const KatexErrorBoundary = ({ children, code }) => {
    const [error, setError] = (0, react_1.useState)(null);
    return (0, jsx_runtime_1.jsx)(react_error_boundary_1.ErrorBoundary, { children: children, onError: setError, fallback: (0, jsx_runtime_1.jsx)(Fallback, { title: error === null || error === void 0 ? void 0 : error.message, children: code }) });
};
exports.default = KatexErrorBoundary;
