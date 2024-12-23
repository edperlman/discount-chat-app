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
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const ui_voip_1 = require("@rocket.chat/ui-voip");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const NavBarItemVoipDialer = (props) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { sidebar } = (0, ui_contexts_1.useLayout)();
    const { clientError, isEnabled, isReady, isRegistered } = (0, ui_voip_1.useVoipState)();
    const { open: isDialerOpen, openDialer, closeDialer } = (0, ui_voip_1.useVoipDialer)();
    const handleToggleDialer = (0, fuselage_hooks_1.useEffectEvent)(() => {
        sidebar.toggle();
        isDialerOpen ? closeDialer() : openDialer();
    });
    const title = (0, react_1.useMemo)(() => {
        if (!isReady && !clientError) {
            return t('Loading');
        }
        if (!isRegistered || clientError) {
            return t('Voice_calling_disabled');
        }
        return t('New_Call');
    }, [clientError, isReady, isRegistered, t]);
    return isEnabled ? ((0, jsx_runtime_1.jsx)(fuselage_1.NavBarItem, Object.assign({}, props, { title: title, icon: 'phone', onClick: handleToggleDialer, pressed: isDialerOpen, disabled: !isReady || !isRegistered }))) : null;
};
exports.default = NavBarItemVoipDialer;
