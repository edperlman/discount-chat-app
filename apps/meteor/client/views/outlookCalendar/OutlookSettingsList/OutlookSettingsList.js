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
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const OutlookSettingItem_1 = __importDefault(require("./OutlookSettingItem"));
const Contextualbar_1 = require("../../../components/Contextualbar");
const useOutlookAuthentication_1 = require("../hooks/useOutlookAuthentication");
const OutlookSettingsList = ({ onClose, changeRoute }) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const saveUserPreferences = (0, ui_contexts_1.useEndpoint)('POST', '/v1/users.setPreferences');
    const notifyCalendarEvents = (0, ui_contexts_1.useUserPreference)('notifyCalendarEvents');
    const { authEnabled } = (0, useOutlookAuthentication_1.useOutlookAuthentication)();
    const handleDisableAuth = (0, useOutlookAuthentication_1.useOutlookAuthenticationMutationLogout)();
    const handleNotifyCalendarEvents = (0, react_1.useCallback)((value) => {
        try {
            saveUserPreferences({ data: { notifyCalendarEvents: value } });
            dispatchToastMessage({ type: 'success', message: t('Preferences_saved') });
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    }, [saveUserPreferences, dispatchToastMessage, t]);
    const calendarSettings = [
        {
            id: 'notification',
            title: t('Event_notifications'),
            subTitle: t('Event_notifications_description'),
            enabled: notifyCalendarEvents,
            handleEnable: handleNotifyCalendarEvents,
        },
        {
            id: 'authentication',
            title: t('Outlook_authentication'),
            subTitle: t('Outlook_authentication_description'),
            enabled: authEnabled,
            handleEnable: () => handleDisableAuth.mutate(undefined, {
                onSuccess: changeRoute,
            }),
        },
    ];
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarHeader, { children: [(0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarIcon, { name: 'calendar' }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarTitle, { children: t('Outlook_calendar_settings') }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarClose, { onClick: onClose })] }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarContent, { paddingInline: 0, color: 'default', children: calendarSettings.map((setting, index) => {
                    if (setting.id === 'authentication' && !setting.enabled) {
                        return;
                    }
                    return (0, jsx_runtime_1.jsx)(OutlookSettingItem_1.default, Object.assign({}, setting), index);
                }) }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarFooter, { children: (0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, { stretch: true, children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: changeRoute, children: t('Back_to_calendar') }) }) })] }));
};
exports.default = OutlookSettingsList;
