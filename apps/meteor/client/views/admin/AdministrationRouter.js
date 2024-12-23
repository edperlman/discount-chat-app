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
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const AdministrationLayout_1 = __importDefault(require("./AdministrationLayout"));
const sidebarItems_1 = require("./sidebarItems");
const PageSkeleton_1 = __importDefault(require("../../components/PageSkeleton"));
const createSidebarItems_1 = require("../../lib/createSidebarItems");
const SettingsProvider_1 = __importDefault(require("../../providers/SettingsProvider"));
const isSidebarDivider = (sidebarItem) => {
    return sidebarItem.divider === true;
};
const firstSidebarPage = (sidebarItem) => {
    var _a;
    if (isSidebarDivider(sidebarItem)) {
        return false;
    }
    return Boolean((_a = sidebarItem.permissionGranted) === null || _a === void 0 ? void 0 : _a.call(sidebarItem));
};
const AdministrationRouter = ({ children }) => {
    const router = (0, ui_contexts_1.useRouter)();
    (0, react_1.useEffect)(() => router.subscribeToRouteChange(() => {
        var _a, _b;
        if (router.getRouteName() !== 'admin-index') {
            return;
        }
        const defaultRoutePath = (_b = (_a = (0, sidebarItems_1.getAdminSidebarItems)().find(firstSidebarPage)) === null || _a === void 0 ? void 0 : _a.href) !== null && _b !== void 0 ? _b : '/admin/workspace';
        if ((0, createSidebarItems_1.isGoRocketChatLink)(defaultRoutePath)) {
            window.open(defaultRoutePath, '_blank');
            return;
        }
        router.navigate(defaultRoutePath, { replace: true });
    }), [router]);
    return ((0, jsx_runtime_1.jsx)(AdministrationLayout_1.default, { children: (0, jsx_runtime_1.jsx)(SettingsProvider_1.default, { privileged: true, children: children ? (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)(PageSkeleton_1.default, {}), children: children }) : (0, jsx_runtime_1.jsx)(PageSkeleton_1.default, {}) }) }));
};
exports.default = AdministrationRouter;
