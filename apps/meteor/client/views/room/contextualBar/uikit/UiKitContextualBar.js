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
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const fuselage_ui_kit_1 = require("@rocket.chat/fuselage-ui-kit");
const ui_kit_1 = require("@rocket.chat/ui-kit");
const react_1 = __importStar(require("react"));
const client_1 = require("../../../../../app/utils/client");
const Contextualbar_1 = require("../../../../components/Contextualbar");
const preventSyntheticEvent_1 = require("../../../../lib/utils/preventSyntheticEvent");
const useContextualBarContextValue_1 = require("../../../../uikit/hooks/useContextualBarContextValue");
const useUiKitActionManager_1 = require("../../../../uikit/hooks/useUiKitActionManager");
const useUiKitView_1 = require("../../../../uikit/hooks/useUiKitView");
const getButtonStyle_1 = require("../../../modal/uikit/getButtonStyle");
const RoomToolboxContext_1 = require("../../contexts/RoomToolboxContext");
const UiKitContextualBar = ({ initialView }) => {
    const actionManager = (0, useUiKitActionManager_1.useUiKitActionManager)();
    const { view, values, updateValues, state } = (0, useUiKitView_1.useUiKitView)(initialView);
    const contextValue = (0, useContextualBarContextValue_1.useContextualBarContextValue)({ view, values, updateValues });
    const { closeTab } = (0, RoomToolboxContext_1.useRoomToolbox)();
    const handleSubmit = (0, fuselage_hooks_1.useEffectEvent)((e) => {
        (0, preventSyntheticEvent_1.preventSyntheticEvent)(e);
        closeTab();
        void actionManager.emitInteraction(view.appId, {
            type: 'viewSubmit',
            payload: {
                view: Object.assign(Object.assign({}, view), { state }),
            },
            viewId: view.id,
        });
    });
    const handleCancel = (0, fuselage_hooks_1.useEffectEvent)((e) => {
        (0, preventSyntheticEvent_1.preventSyntheticEvent)(e);
        closeTab();
        void actionManager.emitInteraction(view.appId, {
            type: 'viewClosed',
            payload: {
                viewId: view.id,
                view: Object.assign(Object.assign({}, view), { state }),
                isCleared: false,
            },
        });
    });
    const handleClose = (0, fuselage_hooks_1.useEffectEvent)((e) => {
        (0, preventSyntheticEvent_1.preventSyntheticEvent)(e);
        closeTab();
        void actionManager.emitInteraction(view.appId, {
            type: 'viewClosed',
            payload: {
                viewId: view.id,
                view: Object.assign(Object.assign({}, view), { state }),
                isCleared: true,
            },
        });
    });
    return ((0, jsx_runtime_1.jsxs)(fuselage_ui_kit_1.UiKitContext.Provider, { value: contextValue, children: [(0, jsx_runtime_1.jsxs)(fuselage_1.ContextualbarHeader, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Avatar, { url: (0, client_1.getURL)(`/api/apps/${view.appId}/icon`) }), (0, jsx_runtime_1.jsx)(fuselage_1.ContextualbarTitle, { children: fuselage_ui_kit_1.contextualBarParser.text(view.title, ui_kit_1.BlockContext.NONE, 0) }), handleClose && (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarClose, { onClick: handleClose })] }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarScrollableContent, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'form', method: 'post', action: '#', onSubmit: handleSubmit, children: (0, jsx_runtime_1.jsx)(fuselage_ui_kit_1.UiKitComponent, { render: fuselage_ui_kit_1.UiKitContextualBar, blocks: view.blocks }) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.ContextualbarFooter, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { stretch: true, children: [view.close && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { danger: view.close.style === 'danger', onClick: handleCancel, children: fuselage_ui_kit_1.contextualBarParser.text(view.close.text, ui_kit_1.BlockContext.NONE, 0) })), view.submit && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, Object.assign({}, (0, getButtonStyle_1.getButtonStyle)(view.submit), { onClick: handleSubmit, children: fuselage_ui_kit_1.contextualBarParser.text(view.submit.text, ui_kit_1.BlockContext.NONE, 1) })))] }) })] }));
};
exports.default = (0, react_1.memo)(UiKitContextualBar);
