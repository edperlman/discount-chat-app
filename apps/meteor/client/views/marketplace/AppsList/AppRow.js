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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_avatar_1 = require("@rocket.chat/ui-avatar");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const semver_1 = __importDefault(require("semver"));
const AppStatus_1 = __importDefault(require("../AppDetailsPage/tabs/AppStatus/AppStatus"));
const AppMenu_1 = __importDefault(require("../AppMenu"));
const BundleChips_1 = __importDefault(require("../BundleChips"));
const AddonChip_1 = __importDefault(require("./AddonChip"));
// TODO: org props
const AppRow = (_a) => {
    var { className } = _a, props = __rest(_a, ["className"]);
    const { name, id, shortDescription, iconFileData, marketplaceVersion, iconFileContent, installed, bundledIn, version } = props;
    const router = (0, ui_contexts_1.useRouter)();
    const context = (0, ui_contexts_1.useRouteParameter)('context');
    const handleNavigateToAppInfo = () => {
        if (!context) {
            return;
        }
        router.navigate({
            name: 'marketplace',
            params: {
                context,
                page: 'info',
                version: marketplaceVersion || version,
                id,
                tab: 'details',
            },
        });
    };
    const handleKeyDown = (e) => {
        if (!['Enter', 'Space'].includes(e.nativeEvent.code)) {
            return;
        }
        handleNavigateToAppInfo();
    };
    const preventClickPropagation = (e) => {
        e.stopPropagation();
    };
    const canUpdate = installed && version && marketplaceVersion && semver_1.default.lt(version, marketplaceVersion);
    return ((0, jsx_runtime_1.jsx)("div", { role: 'listitem', className: className, children: (0, jsx_runtime_1.jsxs)(fuselage_1.Card, { "data-qa-type": 'app-row', horizontal: true, clickable: true, role: 'link', "aria-labelledby": `${id}-title`, "aria-describedby": `${id}-description`, onClick: handleNavigateToAppInfo, onKeyDown: handleKeyDown, tabIndex: 0, children: [(0, jsx_runtime_1.jsxs)(fuselage_1.CardRow, { children: [(0, jsx_runtime_1.jsx)(ui_avatar_1.AppAvatar, { size: 'x40', iconFileContent: iconFileContent, iconFileData: iconFileData }), (0, jsx_runtime_1.jsxs)(fuselage_1.CardCol, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.CardHeader, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.CardTitle, { variant: 'h5', id: `${id}-title`, children: name }), Boolean(bundledIn === null || bundledIn === void 0 ? void 0 : bundledIn.length) && (0, jsx_runtime_1.jsx)(BundleChips_1.default, { bundledIn: bundledIn }), (0, jsx_runtime_1.jsx)(AddonChip_1.default, { app: props })] }), shortDescription && (0, jsx_runtime_1.jsx)(fuselage_1.CardBody, { id: `${id}-description`, children: shortDescription })] })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.CardControls, { onClick: preventClickPropagation, children: [canUpdate && (0, jsx_runtime_1.jsx)(fuselage_1.Badge, { small: true, variant: 'primary' }), (0, jsx_runtime_1.jsx)(AppStatus_1.default, { app: props, isAppDetailsPage: false, installed: installed }), (0, jsx_runtime_1.jsx)(AppMenu_1.default, { app: props, isAppDetailsPage: false })] })] }) }, id));
};
exports.default = (0, react_1.memo)(AppRow);
