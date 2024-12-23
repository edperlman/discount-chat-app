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
exports.useViewModeItems = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const useViewModeItems = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const saveUserPreferences = (0, ui_contexts_1.useEndpoint)('POST', '/v1/users.setPreferences');
    const useHandleChange = (value) => (0, react_1.useCallback)(() => saveUserPreferences({ data: { sidebarViewMode: value } }), [value]);
    const sidebarViewMode = (0, ui_contexts_1.useUserPreference)('sidebarViewMode', 'extended');
    const sidebarDisplayAvatar = (0, ui_contexts_1.useUserPreference)('sidebarDisplayAvatar', false);
    const setToExtended = useHandleChange('extended');
    const setToMedium = useHandleChange('medium');
    const setToCondensed = useHandleChange('condensed');
    const handleChangeSidebarDisplayAvatar = (0, react_1.useCallback)(() => saveUserPreferences({ data: { sidebarDisplayAvatar: !sidebarDisplayAvatar } }), [saveUserPreferences, sidebarDisplayAvatar]);
    return [
        {
            id: 'extended',
            content: t('Extended'),
            icon: 'extended-view',
            addon: (0, jsx_runtime_1.jsx)(fuselage_1.RadioButton, { onChange: setToExtended, checked: sidebarViewMode === 'extended' }),
        },
        {
            id: 'medium',
            content: t('Medium'),
            icon: 'medium-view',
            addon: (0, jsx_runtime_1.jsx)(fuselage_1.RadioButton, { onChange: setToMedium, checked: sidebarViewMode === 'medium' }),
        },
        {
            id: 'condensed',
            content: t('Condensed'),
            icon: 'condensed-view',
            addon: (0, jsx_runtime_1.jsx)(fuselage_1.RadioButton, { onChange: setToCondensed, checked: sidebarViewMode === 'condensed' }),
        },
        {
            id: 'avatars',
            content: t('Avatars'),
            icon: 'user-rounded',
            addon: (0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, { onChange: handleChangeSidebarDisplayAvatar, checked: sidebarDisplayAvatar }),
        },
    ];
};
exports.useViewModeItems = useViewModeItems;
