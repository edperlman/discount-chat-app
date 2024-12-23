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
const ui_client_1 = require("@rocket.chat/ui-client");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const LayoutWithSidebar_1 = __importDefault(require("./LayoutWithSidebar"));
const LayoutWithSidebarV2_1 = __importDefault(require("./LayoutWithSidebarV2"));
const client_1 = require("../../../../app/models/client");
const useReactiveValue_1 = require("../../../hooks/useReactiveValue");
const AccountSecurityPage = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('../../account/security/AccountSecurityPage'))));
const TwoFactorAuthSetupCheck = ({ children }) => {
    const { isEmbedded: embeddedLayout } = (0, ui_contexts_1.useLayout)();
    const user = (0, ui_contexts_1.useUser)();
    const tfaEnabled = (0, ui_contexts_1.useSetting)('Accounts_TwoFactorAuthentication_Enabled');
    const require2faSetup = (0, useReactiveValue_1.useReactiveValue)((0, react_1.useCallback)(() => {
        var _a, _b, _c, _d, _e;
        // User is already using 2fa
        if (!user || ((_b = (_a = user === null || user === void 0 ? void 0 : user.services) === null || _a === void 0 ? void 0 : _a.totp) === null || _b === void 0 ? void 0 : _b.enabled) || ((_d = (_c = user === null || user === void 0 ? void 0 : user.services) === null || _c === void 0 ? void 0 : _c.email2fa) === null || _d === void 0 ? void 0 : _d.enabled)) {
            return false;
        }
        const mandatoryRole = client_1.Roles.findOne({ _id: { $in: (_e = user.roles) !== null && _e !== void 0 ? _e : [] }, mandatory2fa: true });
        return mandatoryRole !== undefined && tfaEnabled;
    }, [tfaEnabled, user]));
    if (require2faSetup) {
        return ((0, jsx_runtime_1.jsx)("main", { id: 'rocket-chat', className: embeddedLayout ? 'embedded-view' : undefined, children: (0, jsx_runtime_1.jsx)("div", { className: 'main-content content-background-color', children: (0, jsx_runtime_1.jsx)(AccountSecurityPage, {}) }) }));
    }
    return ((0, jsx_runtime_1.jsxs)(ui_client_1.FeaturePreview, { feature: 'newNavigation', children: [(0, jsx_runtime_1.jsx)(ui_client_1.FeaturePreviewOff, { children: (0, jsx_runtime_1.jsx)(LayoutWithSidebar_1.default, { children: children }) }), (0, jsx_runtime_1.jsx)(ui_client_1.FeaturePreviewOn, { children: (0, jsx_runtime_1.jsx)(LayoutWithSidebarV2_1.default, { children: children }) })] }));
};
exports.default = TwoFactorAuthSetupCheck;
