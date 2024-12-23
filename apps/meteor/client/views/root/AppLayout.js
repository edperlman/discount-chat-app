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
const shim_1 = require("use-sync-external-store/shim");
const DocumentTitleWrapper_1 = __importDefault(require("./DocumentTitleWrapper"));
const PageLoading_1 = __importDefault(require("./PageLoading"));
const useEscapeKeyStroke_1 = require("./hooks/useEscapeKeyStroke");
const useGoogleTagManager_1 = require("./hooks/useGoogleTagManager");
const useMessageLinkClicks_1 = require("./hooks/useMessageLinkClicks");
const loadScript_1 = require("../../../app/analytics/client/loadScript");
const useAnalyticsEventTracking_1 = require("../../hooks/useAnalyticsEventTracking");
const useLoadRoomForAllowedAnonymousRead_1 = require("../../hooks/useLoadRoomForAllowedAnonymousRead");
const useNotifyUser_1 = require("../../hooks/useNotifyUser");
const appLayout_1 = require("../../lib/appLayout");
const AppLayout = () => {
    (0, react_1.useEffect)(() => {
        document.body.classList.add('color-primary-font-color', 'rcx-content--main');
        return () => {
            document.body.classList.remove('color-primary-font-color', 'rcx-content--main');
        };
    }, []);
    (0, useMessageLinkClicks_1.useMessageLinkClicks)();
    (0, useGoogleTagManager_1.useGoogleTagManager)();
    (0, loadScript_1.useAnalytics)();
    (0, useEscapeKeyStroke_1.useEscapeKeyStroke)();
    (0, useAnalyticsEventTracking_1.useAnalyticsEventTracking)();
    (0, useLoadRoomForAllowedAnonymousRead_1.useLoadRoomForAllowedAnonymousRead)();
    (0, useNotifyUser_1.useNotifyUser)();
    const layout = (0, shim_1.useSyncExternalStore)(appLayout_1.appLayout.subscribe, appLayout_1.appLayout.getSnapshot);
    return ((0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)(PageLoading_1.default, {}), children: (0, jsx_runtime_1.jsx)(DocumentTitleWrapper_1.default, { children: layout }) }));
};
exports.default = AppLayout;
