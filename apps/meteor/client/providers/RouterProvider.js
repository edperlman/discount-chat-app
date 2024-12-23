"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const kadira_flow_router_1 = require("meteor/kadira:flow-router");
const tracker_1 = require("meteor/tracker");
const react_1 = __importDefault(require("react"));
const appLayout_1 = require("../lib/appLayout");
const roomCoordinator_1 = require("../lib/rooms/roomCoordinator");
const queueMicrotask_1 = require("../lib/utils/queueMicrotask");
const subscribers = new Set();
const listenToRouteChange = () => {
    kadira_flow_router_1.FlowRouter.watchPathChange();
    subscribers.forEach((onRouteChange) => onRouteChange());
};
let computation;
(0, queueMicrotask_1.queueMicrotask)(() => {
    computation = tracker_1.Tracker.autorun(listenToRouteChange);
});
const subscribeToRouteChange = (onRouteChange) => {
    subscribers.add(onRouteChange);
    computation === null || computation === void 0 ? void 0 : computation.invalidate();
    return () => {
        subscribers.delete(onRouteChange);
        if (subscribers.size === 0) {
            (0, queueMicrotask_1.queueMicrotask)(() => computation === null || computation === void 0 ? void 0 : computation.stop());
        }
    };
};
const getLocationPathname = () => kadira_flow_router_1.FlowRouter.current().path.replace(/\?.*/, '');
const getLocationSearch = () => location.search;
const getRouteParameters = () => { var _a; return ((_a = kadira_flow_router_1.FlowRouter.current().params) !== null && _a !== void 0 ? _a : {}); };
const getSearchParameters = () => { var _a; return ((_a = kadira_flow_router_1.FlowRouter.current().queryParams) !== null && _a !== void 0 ? _a : {}); };
const getRouteName = () => { var _a; return (_a = kadira_flow_router_1.FlowRouter.current().route) === null || _a === void 0 ? void 0 : _a.name; };
const encodeSearchParameters = (searchParameters) => {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParameters)) {
        search.append(key, value);
    }
    const searchString = search.toString();
    return searchString ? `?${searchString}` : '';
};
const buildRoutePath = (to) => {
    if (typeof to === 'string') {
        return to;
    }
    if ('pathname' in to) {
        const { pathname, search = {} } = to;
        return (pathname + encodeSearchParameters(search));
    }
    if ('pattern' in to) {
        const { pattern, params = {}, search = {} } = to;
        return tracker_1.Tracker.nonreactive(() => kadira_flow_router_1.FlowRouter.path(pattern, params, search));
    }
    if ('name' in to) {
        const { name, params = {}, search = {} } = to;
        return tracker_1.Tracker.nonreactive(() => kadira_flow_router_1.FlowRouter.path(name, params, search));
    }
    throw new Error('Invalid route');
};
const navigate = (toOrDelta, options) => {
    if (typeof toOrDelta === 'number') {
        history.go(toOrDelta);
        return;
    }
    const path = buildRoutePath(toOrDelta);
    const state = { path };
    if (options === null || options === void 0 ? void 0 : options.replace) {
        history.replaceState(state, '', path);
    }
    else {
        history.pushState(state, '', path);
    }
    dispatchEvent(new PopStateEvent('popstate', { state }));
};
const routes = [];
const routesSubscribers = new Set();
const updateFlowRouter = () => {
    if (kadira_flow_router_1.FlowRouter._initialized) {
        kadira_flow_router_1.FlowRouter._updateCallbacks();
        kadira_flow_router_1.FlowRouter._page.dispatch(new kadira_flow_router_1.FlowRouter._page.Context(kadira_flow_router_1.FlowRouter._current.path));
        return;
    }
    kadira_flow_router_1.FlowRouter.initialize();
};
const defineRoutes = (routes) => {
    const flowRoutes = routes.map((route) => {
        if (route.path === '*') {
            kadira_flow_router_1.FlowRouter.notFound = {
                action: () => appLayout_1.appLayout.render((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: route.element })),
            };
            return kadira_flow_router_1.FlowRouter.notFound;
        }
        return kadira_flow_router_1.FlowRouter.route(route.path, {
            name: route.id,
            action: () => appLayout_1.appLayout.render((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: route.element })),
        });
    });
    routes.push(...routes);
    const index = routes.length - 1;
    updateFlowRouter();
    routesSubscribers.forEach((onRoutesChange) => onRoutesChange());
    return () => {
        flowRoutes.forEach((flowRoute) => {
            kadira_flow_router_1.FlowRouter._routes = kadira_flow_router_1.FlowRouter._routes.filter((r) => r !== flowRoute);
            if ('name' in flowRoute && flowRoute.name) {
                delete kadira_flow_router_1.FlowRouter._routesMap[flowRoute.name];
            }
            else {
                kadira_flow_router_1.FlowRouter.notFound = {
                    action: () => appLayout_1.appLayout.render((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {})),
                };
            }
        });
        if (index !== -1) {
            routes.splice(index, 1);
        }
        updateFlowRouter();
        routesSubscribers.forEach((onRoutesChange) => onRoutesChange());
    };
};
const getRoutes = () => routes;
const subscribeToRoutesChange = (onRoutesChange) => {
    routesSubscribers.add(onRoutesChange);
    onRoutesChange();
    return () => {
        routesSubscribers.delete(onRoutesChange);
    };
};
/** @deprecated */
exports.router = {
    subscribeToRouteChange,
    getLocationPathname,
    getLocationSearch,
    getRouteParameters,
    getSearchParameters,
    getRouteName,
    buildRoutePath,
    navigate,
    defineRoutes,
    getRoutes,
    subscribeToRoutesChange,
    getRoomRoute(roomType, routeData) {
        return { path: roomCoordinator_1.roomCoordinator.getRouteLink(roomType, routeData) || '/' };
    },
};
const RouterProvider = ({ children }) => (0, jsx_runtime_1.jsx)(ui_contexts_1.RouterContext.Provider, { children: children, value: exports.router });
exports.default = RouterProvider;
