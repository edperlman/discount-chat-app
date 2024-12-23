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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const useClipboardWithToast_1 = __importDefault(require("../../../../hooks/useClipboardWithToast"));
const useHighlightedCode_1 = require("../../../../hooks/useHighlightedCode");
const useExampleIncomingData_1 = require("../hooks/useExampleIncomingData");
const IncomingWebhookForm = ({ webhookData }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const absoluteUrl = (0, ui_contexts_1.useAbsoluteUrl)();
    const { control, watch, formState: { errors }, } = (0, react_hook_form_1.useFormContext)();
    const { alias, emoji, avatar } = watch();
    const url = absoluteUrl(`hooks/${webhookData === null || webhookData === void 0 ? void 0 : webhookData._id}/${webhookData === null || webhookData === void 0 ? void 0 : webhookData.token}`);
    const additionalFields = (0, react_1.useMemo)(() => (Object.assign(Object.assign(Object.assign({}, (alias && { alias })), (emoji && { emoji })), (avatar && { avatar }))), [alias, avatar, emoji]);
    const [exampleData, curlData] = (0, useExampleIncomingData_1.useExampleData)({
        additionalFields,
        url,
    });
    const { copy: copyWebhookUrl } = (0, useClipboardWithToast_1.default)(url);
    const { copy: copyToken } = (0, useClipboardWithToast_1.default)(`${webhookData === null || webhookData === void 0 ? void 0 : webhookData._id}/${webhookData === null || webhookData === void 0 ? void 0 : webhookData.token}`);
    const { copy: copyCurlData } = (0, useClipboardWithToast_1.default)(curlData);
    const scriptEngineOptions = (0, react_1.useMemo)(() => [['isolated-vm', t('Script_Engine_isolated_vm')]], [t]);
    const hilightedExampleJson = (0, useHighlightedCode_1.useHighlightedCode)('json', JSON.stringify(exampleData, null, 2));
    const enabledField = (0, fuselage_hooks_1.useUniqueId)();
    const nameField = (0, fuselage_hooks_1.useUniqueId)();
    const channelField = (0, fuselage_hooks_1.useUniqueId)();
    const usernameField = (0, fuselage_hooks_1.useUniqueId)();
    const aliasField = (0, fuselage_hooks_1.useUniqueId)();
    const avatarField = (0, fuselage_hooks_1.useUniqueId)();
    const emojiField = (0, fuselage_hooks_1.useUniqueId)();
    const overrideDestinationChannelEnabledField = (0, fuselage_hooks_1.useUniqueId)();
    const scriptEnabledField = (0, fuselage_hooks_1.useUniqueId)();
    const scriptEngineField = (0, fuselage_hooks_1.useUniqueId)();
    const scriptField = (0, fuselage_hooks_1.useUniqueId)();
    const webhookUrlField = (0, fuselage_hooks_1.useUniqueId)();
    const tokenField = (0, fuselage_hooks_1.useUniqueId)();
    const curlField = (0, fuselage_hooks_1.useUniqueId)();
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { maxWidth: 'x600', alignSelf: 'center', w: 'full', children: (0, jsx_runtime_1.jsxs)(fuselage_1.Accordion, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.AccordionItem, { defaultExpanded: Boolean(webhookData === null || webhookData === void 0 ? void 0 : webhookData._id), title: t('Instructions'), children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: webhookUrlField, children: t('Webhook_URL') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, { id: webhookUrlField, value: (webhookData === null || webhookData === void 0 ? void 0 : webhookData._id) ? url : t('Will_be_available_here_after_saving'), readOnly: true, addon: (webhookData === null || webhookData === void 0 ? void 0 : webhookData._id) ? (0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { mini: true, onClick: () => copyWebhookUrl(), title: t('Copy'), icon: 'copy' }) : undefined, "aria-describedby": `${webhookUrlField}-hint` }) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${webhookUrlField}-hint`, children: t('Send_your_JSON_payloads_to_this_URL') })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: tokenField, children: t('Token') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, { id: tokenField, value: (webhookData === null || webhookData === void 0 ? void 0 : webhookData._id) ? `${webhookData === null || webhookData === void 0 ? void 0 : webhookData._id}/${webhookData === null || webhookData === void 0 ? void 0 : webhookData.token}` : t('Will_be_available_here_after_saving'), readOnly: true, addon: (webhookData === null || webhookData === void 0 ? void 0 : webhookData._id) ? (0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { mini: true, onClick: () => copyToken(), title: t('Copy'), icon: 'copy' }) : undefined }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Example_payload') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'p2', withRichContent: true, flexGrow: 1, children: (0, jsx_runtime_1.jsx)("pre", { children: (0, jsx_runtime_1.jsx)("code", { dangerouslySetInnerHTML: { __html: hilightedExampleJson } }) }) }) })] }), (webhookData === null || webhookData === void 0 ? void 0 : webhookData._id) && ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: curlField, children: "Curl" }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, { id: curlField, value: curlData, readOnly: true, addon: (webhookData === null || webhookData === void 0 ? void 0 : webhookData._id) ? (0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { mini: true, onClick: () => copyCurlData(), title: t('Copy'), icon: 'copy' }) : undefined }) })] }))] }) }), (0, jsx_runtime_1.jsx)(fuselage_1.AccordionItem, { title: t('Settings'), defaultExpanded: true, children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: enabledField, children: t('Enabled') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'enabled', control: control, render: (_a) => {
                                                var _b = _a.field, { value } = _b, field = __rest(_b, ["value"]);
                                                return (0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, Object.assign({ id: enabledField }, field, { checked: value }));
                                            } })] }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: nameField, children: t('Name') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'name', control: control, render: ({ field }) => (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: nameField }, field, { "aria-describedby": `${nameField}-hint` })) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${nameField}-hint`, children: t('You_should_name_it_to_easily_manage_your_integrations') })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: channelField, required: true, children: t('Post_to_Channel') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'channel', control: control, rules: { required: t('Required_field', { field: t('Post_to_Channel') }) }, render: ({ field }) => ((0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: channelField }, field, { addon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'at', size: 'x20' }), "aria-describedby": `${channelField}-hint-1 ${channelField}-hint-2 ${channelField}-error`, "aria-required": true, "aria-invalid": Boolean(errors === null || errors === void 0 ? void 0 : errors.channel) }))) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${channelField}-hint-1`, children: t('Messages_that_are_sent_to_the_Incoming_WebHook_will_be_posted_here') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${channelField}-hint-2`, dangerouslySetInnerHTML: {
                                            __html: t('Start_with_s_for_user_or_s_for_channel_Eg_s_or_s', {
                                                postProcess: 'sprintf',
                                                sprintf: ['@', '#', '@john', '#general'],
                                            }),
                                        } }), (errors === null || errors === void 0 ? void 0 : errors.channel) && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${channelField}-error`, children: errors === null || errors === void 0 ? void 0 : errors.channel.message }))] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: usernameField, required: true, children: t('Post_as') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'username', control: control, rules: { required: t('Required_field', { field: t('Post_to_Channel') }) }, render: ({ field }) => ((0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: usernameField }, field, { addon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'user', size: 'x20' }), "aria-describedby": `${usernameField}-hint-1 ${usernameField}-hint-2 ${usernameField}-error`, "aria-required": true, "aria-invalid": Boolean(errors === null || errors === void 0 ? void 0 : errors.username) }))) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${usernameField}-hint-1`, children: t('Choose_the_username_that_this_integration_will_post_as') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${usernameField}-hint-2`, children: t('Should_exists_a_user_with_this_username') }), (errors === null || errors === void 0 ? void 0 : errors.username) && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${usernameField}-error`, children: errors.username.message }))] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: aliasField, children: t('Alias') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'alias', control: control, render: ({ field }) => ((0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: aliasField }, field, { "aria-describedby": `${aliasField}-hint`, addon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'edit', size: 'x20' }) }))) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${aliasField}-hint`, children: t('Choose_the_alias_that_will_appear_before_the_username_in_messages') })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: avatarField, children: t('Avatar_URL') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'avatar', control: control, render: ({ field }) => ((0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: avatarField }, field, { "aria-describedby": `${avatarField}-hint-1 ${avatarField}-hint-2`, addon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'user-rounded', size: 'x20', alignSelf: 'center' }) }))) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${avatarField}-hint-1`, children: t('You_can_change_a_different_avatar_too') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${avatarField}-hint-2`, children: t('Should_be_a_URL_of_an_image') })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: emojiField, children: t('Emoji') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'emoji', control: control, render: ({ field }) => ((0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: emojiField }, field, { "aria-describedby": `${emojiField}-hint-1 ${emojiField}-hint-2`, addon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'emoji', size: 'x20', alignSelf: 'center' }) }))) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${emojiField}-hint-1`, children: t('You_can_use_an_emoji_as_avatar') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${emojiField}-hint-2`, dangerouslySetInnerHTML: { __html: t('Example_s', { postProcess: 'sprintf', sprintf: [':ghost:'] }) } })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: overrideDestinationChannelEnabledField, children: t('Override_Destination_Channel') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'overrideDestinationChannelEnabled', control: control, render: (_a) => {
                                                var _b = _a.field, { value } = _b, field = __rest(_b, ["value"]);
                                                return ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, Object.assign({ id: overrideDestinationChannelEnabledField }, field, { checked: value })));
                                            } })] }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: scriptEnabledField, children: t('Script_Enabled') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'scriptEnabled', control: control, render: (_a) => {
                                                var _b = _a.field, { value } = _b, field = __rest(_b, ["value"]);
                                                return (0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, Object.assign({ id: scriptEnabledField }, field, { checked: value }));
                                            } })] }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: scriptEngineField, children: t('Script_Engine') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'scriptEngine', control: control, render: ({ field }) => ((0, jsx_runtime_1.jsx)(fuselage_1.Select, Object.assign({ id: scriptEngineField, "aria-describedby": `${scriptEngineField}-hint` }, field, { options: scriptEngineOptions }))) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${scriptEngineField}-hint`, children: t('Script_Engine_Description') })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: scriptField, children: t('Script') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'script', control: control, render: ({ field }) => ((0, jsx_runtime_1.jsx)(fuselage_1.TextAreaInput, Object.assign({ id: scriptField }, field, { rows: 10, addon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'code', size: 'x20', alignSelf: 'center' }) }))) }) })] })] }) })] }) }));
};
exports.default = IncomingWebhookForm;
