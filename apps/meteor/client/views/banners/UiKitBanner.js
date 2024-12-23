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
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const fuselage_ui_kit_1 = require("@rocket.chat/fuselage-ui-kit");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const MarkdownText_1 = __importDefault(require("../../components/MarkdownText"));
const useBannerContextValue_1 = require("../../uikit/hooks/useBannerContextValue");
const useUiKitActionManager_1 = require("../../uikit/hooks/useUiKitActionManager");
const useUiKitView_1 = require("../../uikit/hooks/useUiKitView");
// TODO: move this to fuselage-ui-kit itself
fuselage_ui_kit_1.bannerParser.mrkdwn = ({ text }) => (0, jsx_runtime_1.jsx)(MarkdownText_1.default, { variant: 'inline', content: text });
const UiKitBanner = ({ initialView }) => {
    const { view, values, state } = (0, useUiKitView_1.useUiKitView)(initialView);
    const actionManager = (0, useUiKitActionManager_1.useUiKitActionManager)();
    const contextValue = (0, useBannerContextValue_1.useBannerContextValue)({ view, values });
    const icon = (0, react_1.useMemo)(() => {
        if (view.icon) {
            return (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: view.icon, size: 'x20' });
        }
        return null;
    }, [view.icon]);
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const handleClose = (0, fuselage_hooks_1.useMutableCallback)(() => {
        void actionManager
            .emitInteraction(view.appId, {
            type: 'viewClosed',
            payload: {
                viewId: view.viewId,
                view: Object.assign(Object.assign({}, view), { id: view.viewId, state }),
                isCleared: true,
            },
        })
            .catch((error) => {
            dispatchToastMessage({ type: 'error', message: error });
        });
    });
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Banner, { icon: icon, inline: view.inline, title: view.title, variant: view.variant, closeable: true, onClose: handleClose, children: (0, jsx_runtime_1.jsx)(fuselage_ui_kit_1.UiKitContext.Provider, { value: contextValue, children: (0, jsx_runtime_1.jsx)(fuselage_ui_kit_1.UiKitComponent, { render: fuselage_ui_kit_1.UiKitBanner, blocks: view.blocks }) }) }));
};
exports.default = UiKitBanner;
