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
const react_aria_1 = require("react-aria");
const react_error_boundary_1 = require("react-error-boundary");
const RoomE2EESetup_1 = __importDefault(require("./E2EESetup/RoomE2EESetup"));
const Header_1 = __importDefault(require("./Header"));
const HeaderV2_1 = require("./HeaderV2");
const MessageHighlightProvider_1 = __importDefault(require("./MessageList/providers/MessageHighlightProvider"));
const RoomBody_1 = __importDefault(require("./body/RoomBody"));
const RoomBodyV2_1 = __importDefault(require("./body/RoomBodyV2"));
const RoomContext_1 = require("./contexts/RoomContext");
const RoomToolboxContext_1 = require("./contexts/RoomToolboxContext");
const useAppsContextualBar_1 = require("./hooks/useAppsContextualBar");
const RoomLayout_1 = __importDefault(require("./layout/RoomLayout"));
const ChatProvider_1 = __importDefault(require("./providers/ChatProvider"));
const DateListProvider_1 = require("./providers/DateListProvider");
const SelectedMessagesProvider_1 = require("./providers/SelectedMessagesProvider");
const Contextualbar_1 = require("../../components/Contextualbar");
const UiKitContextualBar = (0, react_1.lazy)(() => Promise.resolve().then(() => __importStar(require('./contextualBar/uikit/UiKitContextualBar'))));
const Room = () => {
    var _a;
    const t = (0, ui_contexts_1.useTranslation)();
    const room = (0, RoomContext_1.useRoom)();
    const toolbox = (0, RoomToolboxContext_1.useRoomToolbox)();
    const contextualBarView = (0, useAppsContextualBar_1.useAppsContextualBar)();
    const isE2EEnabled = (0, ui_contexts_1.useSetting)('E2E_Enable');
    const unencryptedMessagesAllowed = (0, ui_contexts_1.useSetting)('E2E_Allow_Unencrypted_Messages');
    const shouldDisplayE2EESetup = (room === null || room === void 0 ? void 0 : room.encrypted) && !unencryptedMessagesAllowed && isE2EEnabled;
    return ((0, jsx_runtime_1.jsx)(ChatProvider_1.default, { children: (0, jsx_runtime_1.jsx)(MessageHighlightProvider_1.default, { children: (0, jsx_runtime_1.jsx)(react_aria_1.FocusScope, { children: (0, jsx_runtime_1.jsx)(DateListProvider_1.DateListProvider, { children: (0, jsx_runtime_1.jsx)(RoomLayout_1.default, { "data-qa-rc-room": room._id, "aria-label": room.t === 'd'
                            ? t('Conversation_with__roomName__', { roomName: room.name })
                            : t('Channel__roomName__', { roomName: room.name }), header: (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)(ui_client_1.FeaturePreview, { feature: 'newNavigation', children: [(0, jsx_runtime_1.jsx)(ui_client_1.FeaturePreviewOn, { children: (0, jsx_runtime_1.jsx)(HeaderV2_1.HeaderV2, { room: room }) }), (0, jsx_runtime_1.jsx)(ui_client_1.FeaturePreviewOff, { children: (0, jsx_runtime_1.jsx)(Header_1.default, { room: room }) })] }) }), body: shouldDisplayE2EESetup ? ((0, jsx_runtime_1.jsx)(RoomE2EESetup_1.default, {})) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)(ui_client_1.FeaturePreview, { feature: 'newNavigation', children: [(0, jsx_runtime_1.jsx)(ui_client_1.FeaturePreviewOn, { children: (0, jsx_runtime_1.jsx)(RoomBodyV2_1.default, {}) }), (0, jsx_runtime_1.jsx)(ui_client_1.FeaturePreviewOff, { children: (0, jsx_runtime_1.jsx)(RoomBody_1.default, {}) })] }) })), aside: (((_a = toolbox.tab) === null || _a === void 0 ? void 0 : _a.tabComponent) && ((0, jsx_runtime_1.jsx)(react_error_boundary_1.ErrorBoundary, { fallback: null, children: (0, jsx_runtime_1.jsx)(SelectedMessagesProvider_1.SelectedMessagesProvider, { children: (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarSkeleton, {}), children: (0, react_1.createElement)(toolbox.tab.tabComponent) }) }) }))) ||
                            (contextualBarView && ((0, jsx_runtime_1.jsx)(react_error_boundary_1.ErrorBoundary, { fallback: null, children: (0, jsx_runtime_1.jsx)(SelectedMessagesProvider_1.SelectedMessagesProvider, { children: (0, jsx_runtime_1.jsx)(react_1.Suspense, { fallback: (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarSkeleton, {}), children: (0, jsx_runtime_1.jsx)(UiKitContextualBar, { initialView: contextualBarView }, contextualBarView.id) }) }) }))) }) }) }) }) }));
};
exports.default = (0, react_1.memo)(Room);
