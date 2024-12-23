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
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const PreferencesMessagesSection = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { control } = (0, react_hook_form_1.useFormContext)();
    const alsoSendThreadMessageToChannelOptions = (0, react_1.useMemo)(() => [
        ['default', t('Selected_first_reply_unselected_following_replies')],
        ['always', t('Selected_by_default')],
        ['never', t('Unselected_by_default')],
    ], [t]);
    const sendOnEnterOptions = (0, react_1.useMemo)(() => [
        ['normal', t('Enter_Normal')],
        ['alternative', t('Enter_Alternative')],
        ['desktop', t('Only_On_Desktop')],
    ], [t]);
    const unreadAlertId = (0, fuselage_hooks_1.useUniqueId)();
    const showThreadsInMainChannelId = (0, fuselage_hooks_1.useUniqueId)();
    const alsoSendThreadToChannelId = (0, fuselage_hooks_1.useUniqueId)();
    const useEmojisId = (0, fuselage_hooks_1.useUniqueId)();
    const convertAsciiEmojiId = (0, fuselage_hooks_1.useUniqueId)();
    const autoImageLoadId = (0, fuselage_hooks_1.useUniqueId)();
    const saveMobileBandwidthId = (0, fuselage_hooks_1.useUniqueId)();
    const collapseMediaByDefaultId = (0, fuselage_hooks_1.useUniqueId)();
    const hideFlexTabId = (0, fuselage_hooks_1.useUniqueId)();
    const displayAvatarsId = (0, fuselage_hooks_1.useUniqueId)();
    const sendOnEnterId = (0, fuselage_hooks_1.useUniqueId)();
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Accordion.Item, { title: t('Messages'), children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: unreadAlertId, children: t('Unread_Tray_Icon_Alert') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'unreadAlert', control: control, render: ({ field: { value, onChange, ref } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, { id: unreadAlertId, ref: ref, checked: value, onChange: onChange })) })] }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: showThreadsInMainChannelId, children: t('Always_show_thread_replies_in_main_channel') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'showThreadsInMainChannel', control: control, render: ({ field: { value, onChange, ref } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, { "aria-describedby": `${showThreadsInMainChannelId}-hint`, id: showThreadsInMainChannelId, ref: ref, checked: value, onChange: onChange })) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${showThreadsInMainChannelId}-hint`, children: t('Accounts_Default_User_Preferences_showThreadsInMainChannel_Description') })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: alsoSendThreadToChannelId, children: t('Also_send_thread_message_to_channel_behavior') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'alsoSendThreadToChannel', control: control, render: ({ field: { value, onChange } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.Select, { id: alsoSendThreadToChannelId, "aria-describedby": `${alsoSendThreadToChannelId}-hint`, value: value, onChange: onChange, options: alsoSendThreadMessageToChannelOptions })) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${alsoSendThreadToChannelId}-hint`, children: t('Accounts_Default_User_Preferences_alsoSendThreadToChannel_Description') })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Message_TimeFormat') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldLink, { href: '/account/accessibility-and-appearance', children: t('Go_to_accessibility_and_appearance') })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: useEmojisId, children: t('Use_Emojis') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'useEmojis', control: control, render: ({ field: { value, onChange, ref } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, { id: useEmojisId, ref: ref, checked: value, onChange: onChange })) })] }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: convertAsciiEmojiId, children: t('Convert_Ascii_Emojis') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'convertAsciiEmoji', control: control, render: ({ field: { value, onChange, ref } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, { id: convertAsciiEmojiId, ref: ref, checked: value, onChange: onChange })) })] }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: autoImageLoadId, children: t('Auto_Load_Images') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'autoImageLoad', control: control, render: ({ field: { value, onChange, ref } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, { id: autoImageLoadId, ref: ref, checked: value, onChange: onChange })) })] }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: saveMobileBandwidthId, children: t('Save_Mobile_Bandwidth') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'saveMobileBandwidth', control: control, render: ({ field: { value, onChange, ref } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, { id: saveMobileBandwidthId, ref: ref, checked: value, onChange: onChange })) })] }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: collapseMediaByDefaultId, children: t('Collapse_Embedded_Media_By_Default') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'collapseMediaByDefault', control: control, render: ({ field: { value, onChange, ref } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, { id: collapseMediaByDefaultId, ref: ref, checked: value, onChange: onChange })) })] }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Hide_usernames') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldLink, { href: '/account/accessibility-and-appearance', children: t('Go_to_accessibility_and_appearance') })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Hide_roles') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldLink, { href: '/account/accessibility-and-appearance', children: t('Go_to_accessibility_and_appearance') })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: hideFlexTabId, children: t('Hide_flextab') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'hideFlexTab', control: control, render: ({ field: { value, onChange, ref } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, { id: hideFlexTabId, ref: ref, checked: value, onChange: onChange })) })] }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: displayAvatarsId, children: t('Display_avatars') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'displayAvatars', control: control, render: ({ field: { value, onChange, ref } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, { id: displayAvatarsId, ref: ref, checked: value, onChange: onChange })) })] }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: sendOnEnterId, children: t('Enter_Behaviour') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'sendOnEnter', control: control, render: ({ field: { value, onChange } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.Select, { id: sendOnEnterId, value: value, onChange: onChange, options: sendOnEnterOptions })) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { children: t('Enter_Behaviour_Description') })] })] }) }));
};
exports.default = PreferencesMessagesSection;
