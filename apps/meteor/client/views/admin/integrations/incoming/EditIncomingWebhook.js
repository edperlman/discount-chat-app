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
const IncomingWebhookForm_1 = __importDefault(require("./IncomingWebhookForm"));
const GenericModal_1 = __importDefault(require("../../../../components/GenericModal"));
const Page_1 = require("../../../../components/Page");
const useCreateIntegration_1 = require("../hooks/useCreateIntegration");
const useDeleteIntegration_1 = require("../hooks/useDeleteIntegration");
const useUpdateIntegration_1 = require("../hooks/useUpdateIntegration");
const getInitialValue = (webhookData) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    return ({
        enabled: (_a = webhookData === null || webhookData === void 0 ? void 0 : webhookData.enabled) !== null && _a !== void 0 ? _a : true,
        channel: (_b = webhookData === null || webhookData === void 0 ? void 0 : webhookData.channel.join(', ')) !== null && _b !== void 0 ? _b : '',
        username: (_c = webhookData === null || webhookData === void 0 ? void 0 : webhookData.username) !== null && _c !== void 0 ? _c : '',
        name: (_d = webhookData === null || webhookData === void 0 ? void 0 : webhookData.name) !== null && _d !== void 0 ? _d : '',
        alias: (_e = webhookData === null || webhookData === void 0 ? void 0 : webhookData.alias) !== null && _e !== void 0 ? _e : '',
        avatar: (_f = webhookData === null || webhookData === void 0 ? void 0 : webhookData.avatar) !== null && _f !== void 0 ? _f : '',
        emoji: (_g = webhookData === null || webhookData === void 0 ? void 0 : webhookData.emoji) !== null && _g !== void 0 ? _g : '',
        scriptEnabled: (_h = webhookData === null || webhookData === void 0 ? void 0 : webhookData.scriptEnabled) !== null && _h !== void 0 ? _h : false,
        scriptEngine: (_j = webhookData === null || webhookData === void 0 ? void 0 : webhookData.scriptEngine) !== null && _j !== void 0 ? _j : 'isolated-vm',
        overrideDestinationChannelEnabled: (_k = webhookData === null || webhookData === void 0 ? void 0 : webhookData.overrideDestinationChannelEnabled) !== null && _k !== void 0 ? _k : false,
        script: (_l = webhookData === null || webhookData === void 0 ? void 0 : webhookData.script) !== null && _l !== void 0 ? _l : '',
    });
};
const INCOMING_TYPE = 'webhook-incoming';
const EditIncomingWebhook = ({ webhookData }) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const router = (0, ui_contexts_1.useRouter)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const tab = (0, ui_contexts_1.useRouteParameter)('type');
    const deleteIntegration = (0, useDeleteIntegration_1.useDeleteIntegration)(INCOMING_TYPE);
    const updateIntegration = (0, useUpdateIntegration_1.useUpdateIntegration)(INCOMING_TYPE);
    const createIntegration = (0, useCreateIntegration_1.useCreateIntegration)(INCOMING_TYPE);
    const methods = (0, react_hook_form_1.useForm)({ mode: 'onBlur', values: getInitialValue(webhookData) });
    const { reset, handleSubmit, formState: { isDirty }, } = methods;
    const handleDeleteIntegration = (0, react_1.useCallback)(() => {
        const onDelete = () => __awaiter(void 0, void 0, void 0, function* () {
            if (!(webhookData === null || webhookData === void 0 ? void 0 : webhookData._id)) {
                return;
            }
            deleteIntegration.mutate({ integrationId: webhookData._id, type: INCOMING_TYPE });
        });
        setModal((0, jsx_runtime_1.jsx)(GenericModal_1.default, { variant: 'danger', onConfirm: onDelete, onCancel: () => setModal(null), confirmText: t('Delete'), children: t('Integration_Delete_Warning') }));
    }, [webhookData === null || webhookData === void 0 ? void 0 : webhookData._id, deleteIntegration, setModal, t]);
    const handleSave = (0, react_1.useCallback)((formValues) => __awaiter(void 0, void 0, void 0, function* () {
        if (webhookData === null || webhookData === void 0 ? void 0 : webhookData._id) {
            return updateIntegration.mutate(Object.assign({ integrationId: webhookData === null || webhookData === void 0 ? void 0 : webhookData._id, type: INCOMING_TYPE }, formValues));
        }
        return createIntegration.mutate(Object.assign({ type: INCOMING_TYPE }, formValues));
    }), [webhookData === null || webhookData === void 0 ? void 0 : webhookData._id, updateIntegration, createIntegration]);
    const formId = (0, fuselage_hooks_1.useUniqueId)();
    return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { flexDirection: 'column', children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Integration_Incoming_WebHook'), onClickBack: () => router.navigate('/admin/integrations/webhook-incoming'), children: (0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, { children: (webhookData === null || webhookData === void 0 ? void 0 : webhookData._id) && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { danger: true, onClick: handleDeleteIntegration, children: t('Delete') })) }) }), !(webhookData === null || webhookData === void 0 ? void 0 : webhookData._id) && ((0, jsx_runtime_1.jsxs)(fuselage_1.Tabs, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.TabsItem, { selected: tab === 'incoming', onClick: () => router.navigate('/admin/integrations/new/incoming'), children: t('Incoming') }), (0, jsx_runtime_1.jsx)(fuselage_1.TabsItem, { selected: tab === 'outgoing', onClick: () => router.navigate('/admin/integrations/new/outgoing'), children: t('Outgoing') })] })), (0, jsx_runtime_1.jsx)(Page_1.PageScrollableContentWithShadow, { id: formId, is: 'form', onSubmit: handleSubmit(handleSave), children: (0, jsx_runtime_1.jsx)(react_hook_form_1.FormProvider, Object.assign({}, methods, { children: (0, jsx_runtime_1.jsx)(IncomingWebhookForm_1.default, { webhookData: webhookData }) })) }), (0, jsx_runtime_1.jsx)(Page_1.PageFooter, { isDirty: isDirty, children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { type: 'reset', onClick: () => reset(), children: t('Cancel') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { form: formId, primary: true, type: 'submit', children: t('Save') })] }) })] }));
};
exports.default = EditIncomingWebhook;
