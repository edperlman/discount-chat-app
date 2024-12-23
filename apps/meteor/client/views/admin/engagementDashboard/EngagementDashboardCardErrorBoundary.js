"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const react_error_boundary_1 = require("react-error-boundary");
const react_i18next_1 = require("react-i18next");
const EngagementDashboardCardErrorBoundary = ({ children }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [error, setError] = (0, react_1.useState)();
    const isError = (error) => error instanceof Error;
    const errorHandler = (error, info) => {
        setError(error);
        console.error('Uncaught Error:', error, info);
    };
    return ((0, jsx_runtime_1.jsx)(react_query_1.QueryErrorResetBoundary, { children: ({ reset }) => ((0, jsx_runtime_1.jsx)(react_error_boundary_1.ErrorBoundary, { children: children, onError: errorHandler, onReset: reset, fallbackRender: ({ resetErrorBoundary }) => ((0, jsx_runtime_1.jsxs)(fuselage_1.States, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.StatesIcon, { name: 'circle-exclamation' }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesTitle, { children: t('Something_went_wrong') }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesSubtitle, { children: isError(error) && (error === null || error === void 0 ? void 0 : error.message) }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesActions, { "data-qa": 'EngagementDashboardCardErrorBoundary', children: (0, jsx_runtime_1.jsx)(fuselage_1.StatesAction, { onClick: () => resetErrorBoundary(), children: t('Retry') }) })] })) })) }));
};
exports.default = EngagementDashboardCardErrorBoundary;
