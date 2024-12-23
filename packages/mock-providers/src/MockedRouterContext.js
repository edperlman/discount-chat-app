"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockedRouterContext = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const MockedRouterContext = ({ children, router, }) => {
    return ((0, jsx_runtime_1.jsx)(ui_contexts_1.RouterContext.Provider, { value: Object.assign({ subscribeToRouteChange: () => () => undefined, getLocationPathname: () => '/', getLocationSearch: () => '', getRouteParameters: () => ({}), getSearchParameters: () => ({}), getRouteName: () => undefined, buildRoutePath: () => '/', navigate: () => undefined, defineRoutes: () => () => undefined, getRoutes: () => [], subscribeToRoutesChange: () => () => undefined, getRoomRoute: () => ({ path: '/' }) }, router), children: children }));
};
exports.MockedRouterContext = MockedRouterContext;
