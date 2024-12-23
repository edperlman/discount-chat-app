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
const EditIntegrationsPage_1 = __importDefault(require("./EditIntegrationsPage"));
const EditIntegrationsPageWithData_1 = __importDefault(require("./EditIntegrationsPageWithData"));
const IntegrationsPage_1 = __importDefault(require("./IntegrationsPage"));
const NotAuthorizedPage_1 = __importDefault(require("../../notAuthorized/NotAuthorizedPage"));
const OutgoingWebhookHistoryPage_1 = __importDefault(require("./outgoing/history/OutgoingWebhookHistoryPage"));
const IntegrationsRoute = () => {
    const context = (0, ui_contexts_1.useRouteParameter)('context');
    const integrationId = (0, ui_contexts_1.useRouteParameter)('id');
    const canViewIntegrationsPage = (0, ui_contexts_1.useAtLeastOnePermission)((0, react_1.useMemo)(() => [
        'manage-incoming-integrations',
        'manage-outgoing-integrations',
        'manage-own-incoming-integrations',
        'manage-own-outgoing-integrations',
    ], []));
    if (!canViewIntegrationsPage) {
        return (0, jsx_runtime_1.jsx)(NotAuthorizedPage_1.default, {});
    }
    if (context === 'new') {
        return (0, jsx_runtime_1.jsx)(EditIntegrationsPage_1.default, {});
    }
    if (context === 'edit' && integrationId) {
        return (0, jsx_runtime_1.jsx)(EditIntegrationsPageWithData_1.default, { integrationId: integrationId });
    }
    if (context === 'history') {
        return (0, jsx_runtime_1.jsx)(OutgoingWebhookHistoryPage_1.default, {});
    }
    return (0, jsx_runtime_1.jsx)(IntegrationsPage_1.default, {});
};
exports.default = IntegrationsRoute;
