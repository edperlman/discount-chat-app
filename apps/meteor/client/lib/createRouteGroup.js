"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRouteGroup = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const appLayout_1 = require("./appLayout");
const RouterProvider_1 = require("../providers/RouterProvider");
const MainLayout_1 = __importDefault(require("../views/root/MainLayout"));
const createRouteGroup = (name, prefix, RouterComponent) => {
    RouterProvider_1.router.defineRoutes([
        {
            path: prefix,
            id: `${name}-index`,
            element: appLayout_1.appLayout.wrap((0, jsx_runtime_1.jsx)(MainLayout_1.default, { children: (0, jsx_runtime_1.jsx)(RouterComponent, {}) })),
        },
    ]);
    return (path, { name, component: RouteComponent, props, ready = true, }) => {
        let unregister;
        const register = () => {
            unregister = RouterProvider_1.router.defineRoutes([
                {
                    path: `${prefix}${path}`,
                    id: name,
                    element: appLayout_1.appLayout.wrap((0, jsx_runtime_1.jsx)(MainLayout_1.default, { children: (0, jsx_runtime_1.jsx)(RouterComponent, { children: (0, jsx_runtime_1.jsx)(RouteComponent, Object.assign({}, props)) }) })),
                },
            ]);
        };
        if (ready) {
            register();
        }
        return [register, () => unregister === null || unregister === void 0 ? void 0 : unregister()];
    };
};
exports.createRouteGroup = createRouteGroup;
