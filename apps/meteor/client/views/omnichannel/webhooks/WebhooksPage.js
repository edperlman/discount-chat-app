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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_client_1 = require("@rocket.chat/ui-client");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const Page_1 = require("../../../components/Page");
const reduceSendOptions = (options) => Object.entries(options).reduce((acc, [key, val]) => {
    if (val) {
        acc = [...acc, key];
    }
    return acc;
}, []);
const INTEGRATION_URL = 'https://docs.rocket.chat/use-rocket.chat/omnichannel/webhooks';
const getInitialValues = ({ Livechat_webhookUrl, Livechat_secret_token, Livechat_webhook_on_start, Livechat_webhook_on_close, Livechat_webhook_on_chat_taken, Livechat_webhook_on_chat_queued, Livechat_webhook_on_forward, Livechat_webhook_on_offline_msg, Livechat_webhook_on_visitor_message, Livechat_webhook_on_agent_message, Livechat_http_timeout, }) => {
    const mappedSendOptions = reduceSendOptions({
        Livechat_webhook_on_start,
        Livechat_webhook_on_close,
        Livechat_webhook_on_chat_taken,
        Livechat_webhook_on_chat_queued,
        Livechat_webhook_on_forward,
        Livechat_webhook_on_offline_msg,
        Livechat_webhook_on_visitor_message,
        Livechat_webhook_on_agent_message,
    });
    return {
        Livechat_webhookUrl,
        Livechat_secret_token,
        Livechat_http_timeout,
        sendOn: mappedSendOptions,
    };
};
const WebhooksPage = ({ settings }) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const defaultValues = getInitialValues(settings);
    const { control, reset, formState: { isDirty, isSubmitting }, handleSubmit, } = (0, react_hook_form_1.useForm)({
        defaultValues,
    });
    const save = (0, ui_contexts_1.useEndpoint)('POST', '/v1/omnichannel/integrations');
    const test = (0, ui_contexts_1.useEndpoint)('POST', '/v1/livechat/webhook.test');
    const livechatWebhookUrl = (0, react_hook_form_1.useWatch)({ name: 'Livechat_webhookUrl', control });
    const canTest = !(livechatWebhookUrl && !isDirty);
    const sendOptions = (0, react_1.useMemo)(() => [
        ['Livechat_webhook_on_start', t('Chat_start')],
        ['Livechat_webhook_on_close', t('Chat_close')],
        ['Livechat_webhook_on_chat_taken', t('Chat_taken')],
        ['Livechat_webhook_on_chat_queued', t('Chat_queued')],
        ['Livechat_webhook_on_forward', t('Forwarding')],
        ['Livechat_webhook_on_offline_msg', t('Offline_messages')],
        ['Livechat_webhook_on_visitor_message', t('Visitor_message')],
        ['Livechat_webhook_on_agent_message', t('Agent_messages')],
    ], [t]);
    const handleSave = (0, fuselage_hooks_1.useMutableCallback)((values) => __awaiter(void 0, void 0, void 0, function* () {
        const { sendOn, Livechat_webhookUrl, Livechat_secret_token, Livechat_http_timeout } = values;
        try {
            yield save({
                LivechatWebhookUrl: Livechat_webhookUrl,
                LivechatSecretToken: Livechat_secret_token,
                LivechatHttpTimeout: Livechat_http_timeout,
                LivechatWebhookOnStart: sendOn.includes('Livechat_webhook_on_start'),
                LivechatWebhookOnClose: sendOn.includes('Livechat_webhook_on_close'),
                LivechatWebhookOnChatTaken: sendOn.includes('Livechat_webhook_on_chat_taken'),
                LivechatWebhookOnChatQueued: sendOn.includes('Livechat_webhook_on_chat_queued'),
                LivechatWebhookOnForward: sendOn.includes('Livechat_webhook_on_forward'),
                LivechatWebhookOnOfflineMsg: sendOn.includes('Livechat_webhook_on_offline_msg'),
                LivechatWebhookOnVisitorMessage: sendOn.includes('Livechat_webhook_on_visitor_message'),
                LivechatWebhookOnAgentMessage: sendOn.includes('Livechat_webhook_on_agent_message'),
            });
            reset(values);
            dispatchToastMessage({ type: 'success', message: t('Saved') });
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    }));
    const testWebhook = (0, react_query_1.useMutation)({
        mutationFn: () => test(),
        onSuccess: () => dispatchToastMessage({ type: 'success', message: t('It_works') }),
        onError: (error) => dispatchToastMessage({ type: 'error', message: error }),
    });
    return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Webhooks'), children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: () => reset(), disabled: !isDirty || isSubmitting, children: t('Reset') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: () => testWebhook.mutateAsync(), disabled: canTest || testWebhook.isLoading, title: canTest ? t('Webhook_URL_not_set') : '', children: testWebhook.isLoading ? t('Sending') : t('Send_Test') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, onClick: handleSubmit(handleSave), loading: isSubmitting, disabled: !isDirty, children: t('Save') })] }) }), (0, jsx_runtime_1.jsx)(Page_1.PageScrollableContentWithShadow, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { maxWidth: 'x600', w: 'full', alignSelf: 'center', children: [(0, jsx_runtime_1.jsx)("p", { children: t('You_can_use_webhooks_to_easily_integrate_livechat_with_your_CRM') }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)(ui_client_1.ExternalLink, { to: INTEGRATION_URL, children: t('Click_here') }), " ", t('to_see_more_details_on_how_to_integrate')] }), (0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { style: { marginTop: '1.5rem' }, children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Webhook_URL') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'Livechat_webhookUrl', render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.TextInput, { onChange: onChange, value: value, placeholder: 'https://yourdomain.com/webhook/entrypoint' })) }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Secret_token') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'Livechat_secret_token', render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.TextInput, { onChange: onChange, value: value, placeholder: t('Secret_token') })) }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Send_request_on') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { w: 'full', display: 'flex', alignItems: 'stretch', justifyContent: 'stretch', children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'sendOn', render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.MultiSelect, { w: 'full', value: value, onChange: onChange, options: sendOptions, placeholder: t('Select_an_option') })) }) }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Http_timeout') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'Livechat_http_timeout', render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.NumberInput, { onChange: onChange, value: value, placeholder: t('Http_timeout_value') })) }) })] })] })] }) })] }));
};
exports.default = WebhooksPage;
