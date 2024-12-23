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
const AppDetailsPage_1 = __importDefault(require("./AppDetailsPage"));
const AppInstallPage_1 = __importDefault(require("./AppInstallPage"));
const AppsPage_1 = __importDefault(require("./AppsPage"));
const BannerEnterpriseTrialEnded_1 = __importDefault(require("./components/BannerEnterpriseTrialEnded"));
const PageSkeleton_1 = __importDefault(require("../../components/PageSkeleton"));
const AppsProvider_1 = __importDefault(require("../../providers/AppsProvider"));
const NotAuthorizedPage_1 = __importDefault(require("../notAuthorized/NotAuthorizedPage"));
const AppsRoute = () => {
    const [isLoading, setLoading] = (0, react_1.useState)(true);
    const marketplaceRoute = (0, ui_contexts_1.useRoute)('marketplace');
    const context = (0, ui_contexts_1.useRouteParameter)('context') || 'explore';
    const id = (0, ui_contexts_1.useRouteParameter)('id');
    const page = (0, ui_contexts_1.useRouteParameter)('page');
    const isAdminUser = (0, ui_contexts_1.usePermission)('manage-apps');
    const canAccessMarketplace = (0, ui_contexts_1.usePermission)('access-marketplace');
    if (!page)
        marketplaceRoute.push({ context, page: 'list' });
    (0, react_1.useEffect)(() => {
        let mounted = true;
        const initialize = () => __awaiter(void 0, void 0, void 0, function* () {
            if (!mounted) {
                return;
            }
            setLoading(false);
        });
        initialize();
        return () => {
            mounted = false;
        };
    }, [marketplaceRoute, context]);
    if ((context === 'explore' || context === 'installed' || context === 'private' || context === 'premium') &&
        !canAccessMarketplace &&
        !isAdminUser) {
        return (0, jsx_runtime_1.jsx)(NotAuthorizedPage_1.default, {});
    }
    if ((context === 'requested' || page === 'install') && !isAdminUser)
        return (0, jsx_runtime_1.jsx)(NotAuthorizedPage_1.default, {});
    if (isLoading) {
        return (0, jsx_runtime_1.jsx)(PageSkeleton_1.default, {});
    }
    return ((0, jsx_runtime_1.jsxs)(AppsProvider_1.default, { children: [(0, jsx_runtime_1.jsx)(BannerEnterpriseTrialEnded_1.default, {}), (page === 'list' && (0, jsx_runtime_1.jsx)(AppsPage_1.default, {})) ||
                (id && page === 'info' && (0, jsx_runtime_1.jsx)(AppDetailsPage_1.default, { id: id })) ||
                (page === 'install' && (0, jsx_runtime_1.jsx)(AppInstallPage_1.default, {}))] }));
};
exports.default = AppsRoute;
