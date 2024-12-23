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
const react_i18next_1 = require("react-i18next");
const DeviceManagementAdminTable_1 = __importDefault(require("./DeviceManagementAdminTable"));
const DeviceManagementInfo_1 = __importDefault(require("./DeviceManagementInfo"));
const Contextualbar_1 = require("../../../components/Contextualbar");
const Page_1 = require("../../../components/Page");
const DeviceManagementAdminPage = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const context = (0, ui_contexts_1.useRouteParameter)('context');
    const deviceId = (0, ui_contexts_1.useRouteParameter)('id');
    const reloadRef = (0, react_1.useRef)(() => null);
    return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { flexDirection: 'row', children: [(0, jsx_runtime_1.jsxs)(Page_1.Page, { children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Device_Management') }), (0, jsx_runtime_1.jsx)(Page_1.PageContent, { children: (0, jsx_runtime_1.jsx)(DeviceManagementAdminTable_1.default, { reloadRef: reloadRef }) })] }), context === 'info' && deviceId && ((0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarDialog, { children: (0, jsx_runtime_1.jsx)(DeviceManagementInfo_1.default, { deviceId: deviceId, onReload: reloadRef.current }) }))] }));
};
exports.default = DeviceManagementAdminPage;
