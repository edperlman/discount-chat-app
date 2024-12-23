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
exports.useSortModeItems = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const OmnichannelSortingDisclaimer_1 = require("../../../../components/Omnichannel/OmnichannelSortingDisclaimer");
const useSortModeItems = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const saveUserPreferences = (0, ui_contexts_1.useEndpoint)('POST', '/v1/users.setPreferences');
    const sidebarSortBy = (0, ui_contexts_1.useUserPreference)('sidebarSortby', 'activity');
    const isOmnichannelEnabled = (0, OmnichannelSortingDisclaimer_1.useOmnichannelSortingDisclaimer)();
    const useHandleChange = (value) => (0, react_1.useCallback)(() => saveUserPreferences({ data: { sidebarSortby: value } }), [value]);
    const setToAlphabetical = useHandleChange('alphabetical');
    const setToActivity = useHandleChange('activity');
    return [
        {
            id: 'activity',
            content: t('Activity'),
            icon: 'clock',
            addon: (0, jsx_runtime_1.jsx)(fuselage_1.RadioButton, { onChange: setToActivity, checked: sidebarSortBy === 'activity' }),
            description: sidebarSortBy === 'activity' && isOmnichannelEnabled && (0, jsx_runtime_1.jsx)(OmnichannelSortingDisclaimer_1.OmnichannelSortingDisclaimer, {}),
        },
        {
            id: 'name',
            content: t('Name'),
            icon: 'sort-az',
            addon: (0, jsx_runtime_1.jsx)(fuselage_1.RadioButton, { onChange: setToAlphabetical, checked: sidebarSortBy === 'alphabetical' }),
            description: sidebarSortBy === 'alphabetical' && isOmnichannelEnabled && (0, jsx_runtime_1.jsx)(OmnichannelSortingDisclaimer_1.OmnichannelSortingDisclaimer, {}),
        },
    ];
};
exports.useSortModeItems = useSortModeItems;
