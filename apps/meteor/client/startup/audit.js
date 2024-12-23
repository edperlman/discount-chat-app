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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const client_1 = require("../../app/authorization/client");
const appLayout_1 = require("../lib/appLayout");
const onToggledFeature_1 = require("../lib/onToggledFeature");
const RouterProvider_1 = require("../providers/RouterProvider");
const NotAuthorizedPage_1 = __importDefault(require("../views/notAuthorized/NotAuthorizedPage"));
const MainLayout_1 = __importDefault(require("../views/root/MainLayout"));
const AuditPage = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('../views/audit/AuditPage'))));
const AuditLogPage = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('../views/audit/AuditLogPage'))));
const PermissionGuard = ({ children, permission }) => {
    const canView = (0, client_1.hasAllPermission)(permission);
    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: canView ? children : (0, jsx_runtime_1.jsx)(NotAuthorizedPage_1.default, {}) });
};
let unregisterAuditRoutes;
(0, onToggledFeature_1.onToggledFeature)('auditing', {
    up: () => {
        unregisterAuditRoutes = RouterProvider_1.router.defineRoutes([
            {
                path: '/audit/:tab?',
                id: 'audit-home',
                element: appLayout_1.appLayout.wrap((0, jsx_runtime_1.jsx)(MainLayout_1.default, { children: (0, jsx_runtime_1.jsx)(PermissionGuard, { permission: 'can-audit', children: (0, jsx_runtime_1.jsx)(AuditPage, {}) }) })),
            },
            {
                path: '/audit-log',
                id: 'audit-log',
                element: appLayout_1.appLayout.wrap((0, jsx_runtime_1.jsx)(MainLayout_1.default, { children: (0, jsx_runtime_1.jsx)(PermissionGuard, { permission: 'can-audit-log', children: (0, jsx_runtime_1.jsx)(AuditLogPage, {}) }) })),
            },
        ]);
    },
    down: () => {
        unregisterAuditRoutes();
    },
});
