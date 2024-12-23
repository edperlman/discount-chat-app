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
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const KonchatNotification_1 = require("../../../../app/ui/client/lib/KonchatNotification");
const notificationOptionsLabelMap = {
    all: 'All_messages',
    mentions: 'Mentions',
    nothing: 'Nothing',
};
const emailNotificationOptionsLabelMap = {
    mentions: 'Email_Notification_Mode_All',
    nothing: 'Email_Notification_Mode_Disabled',
};
// TODO: Test Notification Button not working
const PreferencesNotificationsSection = () => {
    const { t, i18n } = (0, react_i18next_1.useTranslation)();
    const [notificationsPermission, setNotificationsPermission] = (0, react_1.useState)();
    const defaultDesktopNotifications = (0, ui_contexts_1.useSetting)('Accounts_Default_User_Preferences_desktopNotifications');
    const defaultMobileNotifications = (0, ui_contexts_1.useSetting)('Accounts_Default_User_Preferences_pushNotifications');
    const canChangeEmailNotification = (0, ui_contexts_1.useSetting)('Accounts_AllowEmailNotifications');
    const loginEmailEnabled = (0, ui_contexts_1.useSetting)('Device_Management_Enable_Login_Emails');
    const allowLoginEmailPreference = (0, ui_contexts_1.useSetting)('Device_Management_Allow_Login_Email_preference');
    const showNewLoginEmailPreference = loginEmailEnabled && allowLoginEmailPreference;
    const showCalendarPreference = (0, ui_contexts_1.useSetting)('Outlook_Calendar_Enabled');
    const showMobileRinging = (0, ui_contexts_1.useSetting)('VideoConf_Mobile_Ringing');
    const userEmailNotificationMode = (0, ui_contexts_1.useUserPreference)('emailNotificationMode');
    (0, react_1.useEffect)(() => setNotificationsPermission(window.Notification && Notification.permission), []);
    const onSendNotification = (0, react_1.useCallback)(() => {
        KonchatNotification_1.KonchatNotification.notify({
            payload: { sender: { _id: 'rocket.cat', username: 'rocket.cat' }, rid: 'GENERAL' },
            title: t('Desktop_Notification_Test'),
            text: t('This_is_a_desktop_notification'),
        });
    }, [t]);
    const onAskNotificationPermission = (0, react_1.useCallback)(() => {
        window.Notification && Notification.requestPermission().then((val) => setNotificationsPermission(val));
    }, []);
    const notificationOptions = (0, react_1.useMemo)(() => Object.entries(notificationOptionsLabelMap).map(([key, val]) => i18n.exists(val) && [key, t(val)]), [i18n, t]);
    const desktopNotificationOptions = (0, react_1.useMemo)(() => {
        const optionsCp = notificationOptions.slice();
        optionsCp.unshift(['default', `${t('Default')} (${t(notificationOptionsLabelMap[defaultDesktopNotifications])})`]);
        return optionsCp;
    }, [defaultDesktopNotifications, notificationOptions, t]);
    const mobileNotificationOptions = (0, react_1.useMemo)(() => {
        const optionsCp = notificationOptions.slice();
        optionsCp.unshift(['default', `${t('Default')} (${t(notificationOptionsLabelMap[defaultMobileNotifications])})`]);
        return optionsCp;
    }, [defaultMobileNotifications, notificationOptions, t]);
    const emailNotificationOptions = (0, react_1.useMemo)(() => {
        const options = Object.entries(emailNotificationOptionsLabelMap).map(([key, val]) => i18n.exists(val) && [key, t(val)]);
        options.unshift(['default', `${t('Default')} (${t(emailNotificationOptionsLabelMap[userEmailNotificationMode])})`]);
        return options;
    }, [i18n, t, userEmailNotificationMode]);
    const { control } = (0, react_hook_form_1.useFormContext)();
    const notificationRequireId = (0, fuselage_hooks_1.useUniqueId)();
    const desktopNotificationsId = (0, fuselage_hooks_1.useUniqueId)();
    const pushNotificationsId = (0, fuselage_hooks_1.useUniqueId)();
    const emailNotificationModeId = (0, fuselage_hooks_1.useUniqueId)();
    const receiveLoginDetectionEmailId = (0, fuselage_hooks_1.useUniqueId)();
    const notifyCalendarEventsId = (0, fuselage_hooks_1.useUniqueId)();
    const enableMobileRingingId = (0, fuselage_hooks_1.useUniqueId)();
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Accordion.Item, { title: t('Notifications'), children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Desktop_Notifications') }), (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [notificationsPermission === 'denied' && t('Desktop_Notifications_Disabled'), notificationsPermission === 'granted' && ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, onClick: onSendNotification, children: t('Test_Desktop_Notifications') }) })), notificationsPermission !== 'denied' && notificationsPermission !== 'granted' && ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, onClick: onAskNotificationPermission, children: t('Enable_Desktop_Notifications') }) }))] })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: notificationRequireId, children: t('Notification_RequireInteraction') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'desktopNotificationRequireInteraction', control: control, render: ({ field: { ref, value, onChange } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, { "aria-describedby": `${notificationRequireId}-hint`, id: notificationRequireId, ref: ref, checked: value, onChange: onChange })) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${notificationRequireId}-hint`, children: t('Only_works_with_chrome_version_greater_50') })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: desktopNotificationsId, children: t('Notification_Desktop_Default_For') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'desktopNotifications', control: control, render: ({ field: { value, onChange } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.Select, { id: desktopNotificationsId, value: value, onChange: onChange, options: desktopNotificationOptions })) }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: pushNotificationsId, children: t('Notification_Push_Default_For') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'pushNotifications', control: control, render: ({ field: { value, onChange } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.Select, { id: pushNotificationsId, value: value, onChange: onChange, options: mobileNotificationOptions })) }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: emailNotificationModeId, children: t('Email_Notification_Mode') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'emailNotificationMode', control: control, render: ({ field: { value, onChange } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.Select, { "aria-describedby": `${emailNotificationModeId}-hint`, id: emailNotificationModeId, disabled: !canChangeEmailNotification, value: value, onChange: onChange, options: emailNotificationOptions })) }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.FieldHint, { id: `${emailNotificationModeId}-hint`, children: [canChangeEmailNotification && t('You_need_to_verifiy_your_email_address_to_get_notications'), !canChangeEmailNotification && t('Email_Notifications_Change_Disabled')] })] }), showNewLoginEmailPreference && ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: receiveLoginDetectionEmailId, children: t('Receive_Login_Detection_Emails') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'receiveLoginDetectionEmail', control: control, render: ({ field: { ref, value, onChange } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, { "aria-describedby": `${receiveLoginDetectionEmailId}-hint`, id: receiveLoginDetectionEmailId, ref: ref, checked: value, onChange: onChange })) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${receiveLoginDetectionEmailId}-hint`, children: t('Receive_Login_Detection_Emails_Description') })] })), showCalendarPreference && ((0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: notifyCalendarEventsId, children: t('Notify_Calendar_Events') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'notifyCalendarEvents', control: control, render: ({ field: { ref, value, onChange } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, { id: notifyCalendarEventsId, ref: ref, checked: value, onChange: onChange })) })] }) })), showMobileRinging && ((0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: enableMobileRingingId, children: t('VideoConf_Mobile_Ringing') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'enableMobileRinging', control: control, render: ({ field: { ref, value, onChange } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, { id: enableMobileRingingId, ref: ref, checked: value, onChange: onChange })) })] }) }))] }) }));
};
exports.default = PreferencesNotificationsSection;
