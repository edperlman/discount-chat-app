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
const MessageSearch_1 = __importDefault(require("./components/MessageSearch"));
const MessageSearchForm_1 = __importDefault(require("./components/MessageSearchForm"));
const useMessageSearchProviderQuery_1 = require("./hooks/useMessageSearchProviderQuery");
const Contextualbar_1 = require("../../../../components/Contextualbar");
const RoomToolboxContext_1 = require("../../contexts/RoomToolboxContext");
const MessageSearchTab = () => {
    const providerQuery = (0, useMessageSearchProviderQuery_1.useMessageSearchProviderQuery)();
    const { closeTab } = (0, RoomToolboxContext_1.useRoomToolbox)();
    const [{ searchText, globalSearch }, handleSearch] = (0, react_1.useState)({ searchText: '', globalSearch: false });
    const { t } = (0, react_i18next_1.useTranslation)();
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarHeader, { children: [(0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarIcon, { name: 'magnifier' }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarTitle, { children: t('Search_Messages') }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarClose, { onClick: closeTab })] }), providerQuery.data && ((0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarSection, { children: (0, jsx_runtime_1.jsx)(MessageSearchForm_1.default, { provider: providerQuery.data, onSearch: handleSearch }) })), (0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarContent, { flexShrink: 1, flexGrow: 1, paddingInline: 0, children: [providerQuery.isSuccess && (0, jsx_runtime_1.jsx)(MessageSearch_1.default, { searchText: searchText, globalSearch: globalSearch }), providerQuery.isError && ((0, jsx_runtime_1.jsx)(fuselage_1.Callout, { m: 24, type: 'danger', children: t('Search_current_provider_not_active') }))] })] }));
};
exports.default = MessageSearchTab;
