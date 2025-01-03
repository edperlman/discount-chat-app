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
const css_in_js_1 = require("@rocket.chat/css-in-js");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const useUiKitActionManager_1 = require("../uikit/hooks/useUiKitActionManager");
const ActionManagerBusyState = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const actionManager = (0, useUiKitActionManager_1.useUiKitActionManager)();
    const [busy, setBusy] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (!actionManager) {
            return;
        }
        const handleBusyStateChange = ({ busy }) => setBusy(busy);
        actionManager.on('busy', handleBusyStateChange);
        return () => {
            actionManager.off('busy', handleBusyStateChange);
        };
    }, [actionManager]);
    if (busy) {
        return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { className: (0, css_in_js_1.css) `
					transform: translateX(-50%);
					pointer-events: none;
				`, position: 'absolute', insetInlineStart: '50%', p: 16, bg: 'tint', color: 'default', textAlign: 'center', fontSize: 'p2', elevation: '2', borderRadius: '0 0 4px 4px', zIndex: 99999, children: t('Loading') }));
    }
    return null;
};
exports.default = ActionManagerBusyState;