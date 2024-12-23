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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const outgoingEvents_1 = require("../../../../../app/integrations/lib/outgoingEvents");
const useHighlightedCode_1 = require("../../../../hooks/useHighlightedCode");
const useExampleIncomingData_1 = require("../hooks/useExampleIncomingData");
const OutgoingWebhookForm = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { control, watch, formState: { errors }, } = (0, react_hook_form_1.useFormContext)();
    const { event, alias, emoji, avatar } = watch();
    const retryDelayOptions = (0, react_1.useMemo)(() => [
        ['powers-of-ten', t('powers-of-ten')],
        ['powers-of-two', t('powers-of-two')],
        ['increments-of-two', t('increments-of-two')],
    ], [t]);
    const eventOptions = (0, react_1.useMemo)(() => Object.entries(outgoingEvents_1.outgoingEvents).map(([key, val]) => [key, t(val.label)]), [t]);
    const scriptEngineOptions = (0, react_1.useMemo)(() => [['isolated-vm', t('Script_Engine_isolated_vm')]], [t]);
    const showChannel = (0, react_1.useMemo)(() => outgoingEvents_1.outgoingEvents[event].use.channel, [event]);
    const showTriggerWords = (0, react_1.useMemo)(() => outgoingEvents_1.outgoingEvents[event].use.triggerWords, [event]);
    const showTargetRoom = (0, react_1.useMemo)(() => outgoingEvents_1.outgoingEvents[event].use.targetRoom, [event]);
    const additionalFields = (0, react_1.useMemo)(() => (Object.assign(Object.assign(Object.assign({}, (alias && { alias })), (emoji && { emoji })), (avatar && { avatar }))), [alias, avatar, emoji]);
    const [exampleData] = (0, useExampleIncomingData_1.useExampleData)({
        additionalFields,
        url: '',
    });
    const hilightedExampleJson = (0, useHighlightedCode_1.useHighlightedCode)('json', JSON.stringify(exampleData, null, 2));
    const eventField = (0, fuselage_hooks_1.useUniqueId)();
    const enabledField = (0, fuselage_hooks_1.useUniqueId)();
    const nameField = (0, fuselage_hooks_1.useUniqueId)();
    const channelField = (0, fuselage_hooks_1.useUniqueId)();
    const triggerWordsField = (0, fuselage_hooks_1.useUniqueId)();
    const targetRoomField = (0, fuselage_hooks_1.useUniqueId)();
    const urlsField = (0, fuselage_hooks_1.useUniqueId)();
    const impersonateUserField = (0, fuselage_hooks_1.useUniqueId)();
    const usernameField = (0, fuselage_hooks_1.useUniqueId)();
    const aliasField = (0, fuselage_hooks_1.useUniqueId)();
    const avatarField = (0, fuselage_hooks_1.useUniqueId)();
    const emojiField = (0, fuselage_hooks_1.useUniqueId)();
    const tokenField = (0, fuselage_hooks_1.useUniqueId)();
    const scriptEnabledField = (0, fuselage_hooks_1.useUniqueId)();
    const scriptEngineField = (0, fuselage_hooks_1.useUniqueId)();
    const scriptField = (0, fuselage_hooks_1.useUniqueId)();
    const retryFailedCallsField = (0, fuselage_hooks_1.useUniqueId)();
    const retryCountField = (0, fuselage_hooks_1.useUniqueId)();
    const retryDelayField = (0, fuselage_hooks_1.useUniqueId)();
    const triggerWordAnywhereField = (0, fuselage_hooks_1.useUniqueId)();
    const runOnEditsField = (0, fuselage_hooks_1.useUniqueId)();
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { maxWidth: 'x600', alignSelf: 'center', w: 'full', children: (0, jsx_runtime_1.jsxs)(fuselage_1.Accordion, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.AccordionItem, { defaultExpanded: true, title: t('Settings'), children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: eventField, children: t('Event_Trigger') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'event', control: control, render: ({ field }) => ((0, jsx_runtime_1.jsx)(fuselage_1.Select, Object.assign({ id: eventField }, field, { options: eventOptions, "aria-description": `${eventField}-hint` }))) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${eventField}-hint`, children: t('Event_Trigger_Description') })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: enabledField, children: t('Enabled') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'enabled', control: control, render: (_a) => {
                                                var _b = _a.field, { value } = _b, field = __rest(_b, ["value"]);
                                                return (0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, Object.assign({ id: enabledField }, field, { checked: value }));
                                            } })] }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: nameField, children: t('Name') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'name', control: control, render: ({ field }) => (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: nameField }, field, { "aria-describedby": `${nameField}-hint` })) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${nameField}-hint`, children: t('You_should_name_it_to_easily_manage_your_integrations') })] }), showChannel && ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: channelField, children: t('Channel') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'channel', control: control, render: ({ field }) => ((0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: channelField }, field, { addon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'at', size: 'x20' }), "aria-describedby": `${channelField}-hint-1 ${channelField}-hint-2 ${channelField}-hint-3` }))) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${channelField}-hint-1`, children: t('Channel_to_listen_on') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${channelField}-hint-2`, dangerouslySetInnerHTML: {
                                            __html: t('Start_with_s_for_user_or_s_for_channel_Eg_s_or_s', {
                                                postProcess: 'sprintf',
                                                sprintf: ['@', '#', '@john', '#general'],
                                            }),
                                        } }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${channelField}-hint-3`, dangerouslySetInnerHTML: { __html: t('Integrations_for_all_channels') } })] })), showTriggerWords && ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: triggerWordsField, children: t('Trigger_Words') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'triggerWords', control: control, render: ({ field }) => ((0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: triggerWordsField }, field, { "aria-describedby": `${triggerWordsField}-hint-1 ${triggerWordsField}-hint-2` }))) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${triggerWordsField}-hint-1`, children: t('When_a_line_starts_with_one_of_there_words_post_to_the_URLs_below') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${triggerWordsField}-hint-2`, children: t('Separate_multiple_words_with_commas') })] })), showTargetRoom && ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: targetRoomField, children: t('TargetRoom') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'targetRoom', control: control, render: ({ field }) => ((0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: targetRoomField }, field, { "aria-describedby": `${targetRoomField}-hint-1 ${targetRoomField}-hint-2` }))) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${targetRoomField}-hint-1`, children: t('TargetRoom_Description') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${targetRoomField}-hint-2`, dangerouslySetInnerHTML: {
                                            __html: t('Start_with_s_for_user_or_s_for_channel_Eg_s_or_s', {
                                                postProcess: 'sprintf',
                                                sprintf: ['@', '#', '@john', '#general'],
                                            }),
                                        } })] })), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: urlsField, required: true, children: t('URLs') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'urls', control: control, rules: { required: t('Required_field', { field: t('URLs') }) }, render: ({ field }) => ((0, jsx_runtime_1.jsx)(fuselage_1.TextAreaInput, Object.assign({ id: urlsField }, field, { rows: 10, addon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'permalink', size: 'x20' }), "aria-describedby": `${urlsField}-error`, "aria-required": true, "aria-invalid": Boolean(errors === null || errors === void 0 ? void 0 : errors.urls) }))) }) }), (errors === null || errors === void 0 ? void 0 : errors.urls) && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${urlsField}-error`, children: errors === null || errors === void 0 ? void 0 : errors.urls.message }))] }), (0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: impersonateUserField, children: t('Impersonate_user') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'impersonateUser', control: control, render: (_a) => {
                                                var _b = _a.field, { value } = _b, field = __rest(_b, ["value"]);
                                                return (0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, Object.assign({ id: impersonateUserField }, field, { checked: value }));
                                            } })] }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: usernameField, required: true, children: t('Post_as') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'username', control: control, rules: { required: t('Required_field', { field: t('Post_as') }) }, render: ({ field }) => ((0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: usernameField }, field, { addon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'user', size: 'x20' }), "aria-describedby": `${usernameField}-hint-1 ${usernameField}-hint-2 ${usernameField}-error`, "aria-required": true, "aria-invalid": Boolean(errors === null || errors === void 0 ? void 0 : errors.username) }))) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${usernameField}-hint-1`, children: t('Choose_the_username_that_this_integration_will_post_as') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${usernameField}-hint-2`, children: t('Should_exists_a_user_with_this_username') }), (errors === null || errors === void 0 ? void 0 : errors.username) && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${usernameField}-error`, children: errors === null || errors === void 0 ? void 0 : errors.username.message }))] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: aliasField, children: t('Alias') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'alias', control: control, render: ({ field }) => ((0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: aliasField }, field, { addon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'edit', size: 'x20' }), "aria-describedby": `${aliasField}-hint` }))) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${aliasField}-hint`, children: t('Choose_the_alias_that_will_appear_before_the_username_in_messages') })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: avatarField, children: t('Avatar_URL') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'avatar', control: control, render: ({ field }) => ((0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: avatarField }, field, { addon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'user-rounded', size: 'x20', alignSelf: 'center', "aria-describedby": `${avatarField}-hint-1 ${avatarField}-hint-2` }) }))) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${avatarField}-hint-1`, children: t('You_can_change_a_different_avatar_too') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${avatarField}-hint-2`, children: t('Should_be_a_URL_of_an_image') })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: emojiField, children: t('Emoji') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'emoji', control: control, render: ({ field }) => ((0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: emojiField }, field, { addon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'emoji', size: 'x20', alignSelf: 'center', "aria-describedby": `${emojiField}-hint-1 ${emojiField}-hint-2` }) }))) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${emojiField}-hint-1`, children: t('You_can_use_an_emoji_as_avatar') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${emojiField}-hint-2`, dangerouslySetInnerHTML: { __html: t('Example_s', { postProcess: 'sprintf', sprintf: [':ghost:'] }) } })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: tokenField, required: true, children: t('Token') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'token', control: control, rules: { required: t('Required_field', { field: t('Token') }) }, render: ({ field }) => ((0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: tokenField }, field, { addon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'key', size: 'x20' }), "aria-describedby": `${tokenField}-error`, "aria-invalid": Boolean(errors === null || errors === void 0 ? void 0 : errors.token), "aria-required": true }))) }) }), (errors === null || errors === void 0 ? void 0 : errors.token) && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${tokenField}-error`, children: errors === null || errors === void 0 ? void 0 : errors.token.message }))] }), (0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: scriptEnabledField, children: t('Script_Enabled') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'scriptEnabled', control: control, render: (_a) => {
                                                var _b = _a.field, { value } = _b, field = __rest(_b, ["value"]);
                                                return (0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, Object.assign({ id: scriptEnabledField }, field, { checked: value }));
                                            } })] }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: scriptEngineField, children: t('Script_Engine') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'scriptEngine', control: control, render: ({ field }) => ((0, jsx_runtime_1.jsx)(fuselage_1.Select, Object.assign({ id: scriptEngineField }, field, { options: scriptEngineOptions, "aria-describedby": `${scriptEngineField}-hint` }))) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${scriptEngineField}-hint`, children: t('Script_Engine_Description') })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: scriptField, children: t('Script') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'script', control: control, render: ({ field }) => ((0, jsx_runtime_1.jsx)(fuselage_1.TextAreaInput, Object.assign({ id: scriptField, rows: 10 }, field, { addon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'code', size: 'x20', alignSelf: 'center' }) }))) }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Responding') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { children: t('Response_description_pre') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'p2', withRichContent: true, flexGrow: 1, children: (0, jsx_runtime_1.jsx)("pre", { children: (0, jsx_runtime_1.jsx)("code", { dangerouslySetInnerHTML: { __html: hilightedExampleJson } }) }) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { children: t('Response_description_post') })] })] }) }), (0, jsx_runtime_1.jsx)(fuselage_1.AccordionItem, { title: t('Integration_Advanced_Settings'), children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: retryFailedCallsField, children: t('Integration_Retry_Failed_Url_Calls') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'retryFailedCalls', control: control, render: (_a) => {
                                                    var _b = _a.field, { value } = _b, field = __rest(_b, ["value"]);
                                                    return ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, Object.assign({ id: retryFailedCallsField }, field, { checked: value, "aria-describedby": `${retryFailedCallsField}-hint` })));
                                                } })] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${retryFailedCallsField}-hint`, children: t('Integration_Retry_Failed_Url_Calls_Description') })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: retryCountField, children: t('Retry_Count') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'retryCount', control: control, render: ({ field }) => (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: retryCountField }, field, { "aria-describedby": `${retryCountField}-hint` })) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${retryCountField}-hint`, children: t('Integration_Retry_Count_Description') })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: retryDelayField, children: t('Integration_Retry_Delay') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'retryDelay', control: control, render: ({ field }) => ((0, jsx_runtime_1.jsx)(fuselage_1.Select, Object.assign({ id: retryDelayField }, field, { options: retryDelayOptions, "aria-describedby": `${retryDelayField}-hint` }))) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${retryDelayField}-hint`, dangerouslySetInnerHTML: { __html: t('Integration_Retry_Delay_Description') } })] }), event === 'sendMessage' && ((0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: triggerWordAnywhereField, children: t('Integration_Word_Trigger_Placement') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'triggerWordAnywhere', control: control, render: (_a) => {
                                                            var _b = _a.field, { value } = _b, field = __rest(_b, ["value"]);
                                                            return ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, Object.assign({ id: triggerWordAnywhereField }, field, { checked: value, "aria-describedby": `${triggerWordAnywhereField}-hint` })));
                                                        } })] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${triggerWordAnywhereField}-hint`, children: t('Integration_Word_Trigger_Placement_Description') })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: runOnEditsField, children: t('Integration_Run_When_Message_Is_Edited') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'runOnEdits', control: control, render: (_a) => {
                                                            var _b = _a.field, { value } = _b, field = __rest(_b, ["value"]);
                                                            return ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, Object.assign({ id: runOnEditsField }, field, { checked: value, "aria-describedby": `${runOnEditsField}-hint` })));
                                                        } })] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${runOnEditsField}-hint`, children: t('Integration_Run_When_Message_Is_Edited_Description') })] })] }))] }) })] }) }));
};
exports.default = OutgoingWebhookForm;
