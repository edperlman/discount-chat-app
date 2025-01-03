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
const ModerationConsolePage_1 = __importDefault(require("./ModerationConsolePage"));
const NotAuthorizedPage_1 = __importDefault(require("../../notAuthorized/NotAuthorizedPage"));
const MODERATION_VALID_TABS = ['users', 'messages'];
const isValidTab = (tab) => MODERATION_VALID_TABS.includes(tab);
const ModerationRoute = () => {
    const canViewModerationConsole = (0, ui_contexts_1.usePermission)('view-moderation-console');
    const router = (0, ui_contexts_1.useRouter)();
    const tab = (0, ui_contexts_1.useRouteParameter)('tab');
    (0, react_1.useEffect)(() => {
        if (!isValidTab(tab)) {
            router.navigate({
                pattern: '/admin/moderation/:tab?/:context?/:id?',
                params: { tab: 'messages' },
            }, { replace: true });
        }
    }, [tab, router]);
    if (!canViewModerationConsole) {
        return (0, jsx_runtime_1.jsx)(NotAuthorizedPage_1.default, {});
    }
    const onSelectTab = (tab) => {
        router.navigate({
            pattern: '/admin/moderation/:tab?/:context?/:id?',
            params: { tab },
        }, { replace: true });
    };
    return (0, jsx_runtime_1.jsx)(ModerationConsolePage_1.default, { tab: tab, onSelectTab: onSelectTab });
};
exports.default = ModerationRoute;