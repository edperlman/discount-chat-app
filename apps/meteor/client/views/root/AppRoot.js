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
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const react_dom_1 = require("react-dom");
const OutermostErrorBoundary_1 = __importDefault(require("./OutermostErrorBoundary"));
const PageLoading_1 = __importDefault(require("./PageLoading"));
const queryClient_1 = require("../../lib/queryClient");
const MeteorProvider = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('../../providers/MeteorProvider'))));
const AppLayout = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./AppLayout'))));
const AppRoot = () => ((0, jsx_runtime_1.jsxs)(OutermostErrorBoundary_1.default, { children: [(0, react_dom_1.createPortal)((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("meta", { charSet: 'utf-8' }), (0, jsx_runtime_1.jsx)("meta", { httpEquiv: 'content-type', content: 'text/html; charset=utf-8' }), (0, jsx_runtime_1.jsx)("meta", { httpEquiv: 'expires', content: '-1' }), (0, jsx_runtime_1.jsx)("meta", { httpEquiv: 'X-UA-Compatible', content: 'IE=edge' }), (0, jsx_runtime_1.jsx)("meta", { name: 'fragment', content: '!' }), (0, jsx_runtime_1.jsx)("meta", { name: 'distribution', content: 'global' }), (0, jsx_runtime_1.jsx)("meta", { name: 'viewport', content: 'width=device-width, initial-scale=1, interactive-widget=resizes-content' }), (0, jsx_runtime_1.jsx)("meta", { name: 'rating', content: 'general' }), (0, jsx_runtime_1.jsx)("meta", { name: 'mobile-web-app-capable', content: 'yes' }), (0, jsx_runtime_1.jsx)("meta", { name: 'apple-mobile-web-app-capable', content: 'yes' }), (0, jsx_runtime_1.jsx)("meta", { name: 'msapplication-TileImage', content: 'assets/tile_144.png' }), (0, jsx_runtime_1.jsx)("meta", { name: 'msapplication-config', content: 'images/browserconfig.xml' }), (0, jsx_runtime_1.jsx)("meta", { property: 'og:image', content: 'assets/favicon_512.png' }), (0, jsx_runtime_1.jsx)("meta", { property: 'twitter:image', content: 'assets/favicon_512.png' }), (0, jsx_runtime_1.jsx)("link", { rel: 'manifest', href: 'images/manifest.json' }), (0, jsx_runtime_1.jsx)("link", { rel: 'chrome-webstore-item', href: 'https://chrome.google.com/webstore/detail/nocfbnnmjnndkbipkabodnheejiegccf' }), (0, jsx_runtime_1.jsx)("link", { rel: 'mask-icon', href: 'assets/safari_pinned.svg', color: '#04436a' }), (0, jsx_runtime_1.jsx)("link", { rel: 'apple-touch-icon', sizes: '180x180', href: 'assets/touchicon_180.png' }), (0, jsx_runtime_1.jsx)("link", { rel: 'apple-touch-icon-precomposed', href: 'assets/touchicon_180_pre.png' })] }), document.head), (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)(PageLoading_1.default, {}), children: (0, jsx_runtime_1.jsx)(react_query_1.QueryClientProvider, { client: queryClient_1.queryClient, children: (0, jsx_runtime_1.jsx)(MeteorProvider, { children: (0, jsx_runtime_1.jsx)(AppLayout, {}) }) }) })] }));
exports.default = AppRoot;
