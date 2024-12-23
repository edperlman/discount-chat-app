"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const js_1 = __importDefault(require("@bugsnag/js"));
const plugin_react_1 = __importDefault(require("@bugsnag/plugin-react"));
const react_1 = __importDefault(require("react"));
const react_error_boundary_1 = require("react-error-boundary");
const AppErrorPage_1 = __importDefault(require("./AppErrorPage"));
const rocketchat_info_1 = require("../../../app/utils/rocketchat.info");
let BugsnagErrorBoundary;
if (window.__BUGSNAG_KEY__) {
    js_1.default.start({
        apiKey: window.__BUGSNAG_KEY__,
        appVersion: rocketchat_info_1.Info.version,
        plugins: [new plugin_react_1.default()],
    });
    BugsnagErrorBoundary = (_a = js_1.default.getPlugin('react')) === null || _a === void 0 ? void 0 : _a.createErrorBoundary(react_1.default);
}
const OutermostErrorBoundary = ({ children }) => {
    if (BugsnagErrorBoundary) {
        return (0, jsx_runtime_1.jsx)(BugsnagErrorBoundary, { FallbackComponent: AppErrorPage_1.default, children: children });
    }
    return ((0, jsx_runtime_1.jsx)(react_error_boundary_1.ErrorBoundary, { fallbackRender: ({ error, resetErrorBoundary }) => (0, jsx_runtime_1.jsx)(AppErrorPage_1.default, { error: error, clearError: resetErrorBoundary }), children: children }));
};
exports.default = OutermostErrorBoundary;
