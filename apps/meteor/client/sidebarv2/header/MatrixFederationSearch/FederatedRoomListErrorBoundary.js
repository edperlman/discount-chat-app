"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importDefault(require("react"));
const react_error_boundary_1 = require("react-error-boundary");
const react_i18next_1 = require("react-i18next");
const FederatedRoomListErrorBoundary = ({ children, resetKeys }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsx)(react_query_1.QueryErrorResetBoundary, { children: ({ reset }) => ((0, jsx_runtime_1.jsx)(react_error_boundary_1.ErrorBoundary, { children: children, resetKeys: resetKeys, fallbackRender: ({ resetErrorBoundary }) => ((0, jsx_runtime_1.jsxs)(fuselage_1.States, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.StatesIcon, { name: 'circle-exclamation', variation: 'danger' }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesTitle, { children: t('Error') }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesSubtitle, { children: t('Error_something_went_wrong') }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesActions, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.StatesAction, { onClick: () => {
                                reset();
                                resetErrorBoundary();
                            }, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'reload' }), " ", t('Reload')] }) })] })) })) }));
};
exports.default = FederatedRoomListErrorBoundary;
