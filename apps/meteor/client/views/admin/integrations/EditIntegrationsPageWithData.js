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
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const EditIncomingWebhook_1 = __importDefault(require("./incoming/EditIncomingWebhook"));
const EditOutgoingWebhook_1 = __importDefault(require("./outgoing/EditOutgoingWebhook"));
const EditIntegrationsPageWithData = ({ integrationId }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const params = (0, react_1.useMemo)(() => ({ integrationId }), [integrationId]);
    const getIntegrations = (0, ui_contexts_1.useEndpoint)('GET', '/v1/integrations.get');
    const { data, isLoading, isError } = (0, react_query_1.useQuery)(['integrations', params], () => __awaiter(void 0, void 0, void 0, function* () { return getIntegrations(params); }));
    if (isLoading) {
        return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { w: 'full', p: 24, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { mbe: 4 }), (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { mbe: 8 }), (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { mbe: 4 }), (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { mbe: 8 }), (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { mbe: 4 }), (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { mbe: 8 })] }));
    }
    if (isError) {
        return (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbs: 16, children: t('Oops_page_not_found') });
    }
    if ((data === null || data === void 0 ? void 0 : data.integration.type) === 'webhook-outgoing') {
        return (0, jsx_runtime_1.jsx)(EditOutgoingWebhook_1.default, { webhookData: data === null || data === void 0 ? void 0 : data.integration });
    }
    return (0, jsx_runtime_1.jsx)(EditIncomingWebhook_1.default, { webhookData: data === null || data === void 0 ? void 0 : data.integration });
};
exports.default = EditIntegrationsPageWithData;
