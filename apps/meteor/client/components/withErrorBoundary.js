"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withErrorBoundary = withErrorBoundary;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const react_error_boundary_1 = require("react-error-boundary");
function withErrorBoundary(Component, fallback = null) {
    var _a, _b;
    const WrappedComponent = function (props) {
        return ((0, jsx_runtime_1.jsx)(react_error_boundary_1.ErrorBoundary, { fallback: (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: fallback }), children: (0, jsx_runtime_1.jsx)(Component, Object.assign({}, props)) }));
    };
    WrappedComponent.displayName = `withErrorBoundary(${(_b = (_a = Component.displayName) !== null && _a !== void 0 ? _a : Component.name) !== null && _b !== void 0 ? _b : 'Component'})`;
    return WrappedComponent;
}
