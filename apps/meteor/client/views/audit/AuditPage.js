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
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const AuditForm_1 = __importDefault(require("./components/AuditForm"));
const AuditResult_1 = __importDefault(require("./components/AuditResult"));
const useAuditMutation_1 = require("./hooks/useAuditMutation");
const useAuditTab_1 = require("./hooks/useAuditTab");
const Page_1 = require("../../components/Page");
const MessageListSkeleton_1 = __importDefault(require("../../components/message/list/MessageListSkeleton"));
const errorHandling_1 = require("../../lib/errorHandling");
const AuditPage = () => {
    const [type, setType] = (0, useAuditTab_1.useAuditTab)();
    const [selectedRoom, setSelectedRoom] = (0, react_1.useState)();
    const auditMutation = (0, useAuditMutation_1.useAuditMutation)(type);
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { background: 'room', children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Message_auditing') }), (0, jsx_runtime_1.jsxs)(fuselage_1.Tabs, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Tabs.Item, { selected: type === '', onClick: () => setType(''), children: t('Rooms') }), (0, jsx_runtime_1.jsx)(fuselage_1.Tabs.Item, { selected: type === 'u', onClick: () => setType('u'), children: t('Users') }), (0, jsx_runtime_1.jsx)(fuselage_1.Tabs.Item, { selected: type === 'd', onClick: () => setType('d'), children: t('Direct_Messages') }), (0, jsx_runtime_1.jsx)(fuselage_1.Tabs.Item, { selected: type === 'l', onClick: () => setType('l'), children: t('Omnichannel') })] }), (0, jsx_runtime_1.jsx)(Page_1.PageScrollableContentWithShadow, { mb: -4, children: (0, jsx_runtime_1.jsxs)(fuselage_1.Margins, { block: 4, children: [(0, jsx_runtime_1.jsx)(AuditForm_1.default, { type: type, setSelectedRoom: setSelectedRoom, onSubmit: auditMutation.mutate }, type), (selectedRoom === null || selectedRoom === void 0 ? void 0 : selectedRoom.encrypted) && type === '' ? ((0, jsx_runtime_1.jsxs)(fuselage_1.Callout, { type: 'warning', icon: 'circle-exclamation', marginBlock: 'x16', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'p2b', children: t('Encrypted_content_cannot_be_searched_and_audited') }), t('Encrypted_content_cannot_be_searched_and_audited_subtitle')] })) : null, auditMutation.isLoading && (0, jsx_runtime_1.jsx)(MessageListSkeleton_1.default, { messageCount: 5 }), auditMutation.isError && ((0, jsx_runtime_1.jsxs)(fuselage_1.States, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.StatesIcon, { name: 'circle-exclamation', variation: 'danger' }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesTitle, { children: t('Error') }), (0, jsx_runtime_1.jsx)(fuselage_1.StatesSubtitle, { children: (0, errorHandling_1.getErrorMessage)(auditMutation.error) })] })), auditMutation.isSuccess && (0, jsx_runtime_1.jsx)(AuditResult_1.default, { messages: auditMutation.data })] }) })] }));
};
exports.default = AuditPage;
