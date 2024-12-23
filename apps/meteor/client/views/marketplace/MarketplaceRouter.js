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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const MarketplaceSidebar_1 = __importDefault(require("./MarketplaceSidebar"));
const PageSkeleton_1 = __importDefault(require("../../components/PageSkeleton"));
const SidebarPortal_1 = __importDefault(require("../../sidebar/SidebarPortal"));
const NotFoundPage_1 = __importDefault(require("../notFound/NotFoundPage"));
const MarketplaceRouter = ({ children }) => {
    const currentContext = (0, ui_contexts_1.useRouteParameter)('context') || 'all';
    const marketplaceRoute = (0, ui_contexts_1.useRoute)('marketplace');
    const canAccessMarketplace = (0, ui_contexts_1.useAtLeastOnePermission)(['access-marketplace', 'manage-apps']);
    (0, react_1.useEffect)(() => {
        const initialize = () => __awaiter(void 0, void 0, void 0, function* () {
            // The currentContext === 'all' verification is for users who bookmarked
            // the old marketplace
            // TODO: Remove the all verification in the future;
            if (currentContext === 'all') {
                marketplaceRoute.replace({ context: 'explore', page: 'list' });
            }
        });
        initialize();
    }, [currentContext, marketplaceRoute]);
    if (!canAccessMarketplace) {
        return (0, jsx_runtime_1.jsx)(NotFoundPage_1.default, {});
    }
    return children ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)(PageSkeleton_1.default, {}), children: children }), (0, jsx_runtime_1.jsx)(SidebarPortal_1.default, { children: (0, jsx_runtime_1.jsx)(MarketplaceSidebar_1.default, {}) })] })) : ((0, jsx_runtime_1.jsx)(PageSkeleton_1.default, {}));
};
exports.default = MarketplaceRouter;
