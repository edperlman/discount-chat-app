"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const fuselage_ui_kit_1 = require("@rocket.chat/fuselage-ui-kit");
const gazzodown_1 = require("@rocket.chat/gazzodown");
const react_1 = __importDefault(require("react"));
const ModalBlock_1 = __importDefault(require("./ModalBlock"));
const detectEmoji_1 = require("../../../lib/utils/detectEmoji");
const preventSyntheticEvent_1 = require("../../../lib/utils/preventSyntheticEvent");
const useModalContextValue_1 = require("../../../uikit/hooks/useModalContextValue");
const useUiKitActionManager_1 = require("../../../uikit/hooks/useUiKitActionManager");
const useUiKitView_1 = require("../../../uikit/hooks/useUiKitView");
const UiKitModal = ({ initialView }) => {
    const actionManager = (0, useUiKitActionManager_1.useUiKitActionManager)();
    const { view, errors, values, updateValues, state } = (0, useUiKitView_1.useUiKitView)(initialView);
    const contextValue = (0, useModalContextValue_1.useModalContextValue)({ view, errors, values, updateValues });
    const handleSubmit = (0, fuselage_hooks_1.useEffectEvent)((e) => {
        (0, preventSyntheticEvent_1.preventSyntheticEvent)(e);
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
        void actionManager.emitInteraction(view.appId, {
            type: 'viewClosed',
            payload: {
                viewId: view.id,
                view: Object.assign(Object.assign({}, view), { state }),
                isCleared: false,
            },
        });
    });
    const handleClose = (0, fuselage_hooks_1.useEffectEvent)(() => {
        void actionManager.emitInteraction(view.appId, {
            type: 'viewClosed',
            payload: {
                viewId: view.id,
                view: Object.assign(Object.assign({}, view), { state }),
                isCleared: true,
            },
        });
    });
    return ((0, jsx_runtime_1.jsx)(fuselage_ui_kit_1.UiKitContext.Provider, { value: contextValue, children: (0, jsx_runtime_1.jsx)(gazzodown_1.MarkupInteractionContext.Provider, { value: {
                detectEmoji: detectEmoji_1.detectEmoji,
            }, children: (0, jsx_runtime_1.jsx)(ModalBlock_1.default, { view: view, errors: errors, appId: view.appId, onSubmit: handleSubmit, onCancel: handleCancel, onClose: handleClose }) }) }));
};
exports.default = UiKitModal;
