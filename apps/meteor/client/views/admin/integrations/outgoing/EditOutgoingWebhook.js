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
const OutgoingWebhookForm_1 = __importDefault(require("./OutgoingWebhookForm"));
const GenericModal_1 = __importDefault(require("../../../../components/GenericModal"));
const Page_1 = require("../../../../components/Page");
const triggerWords_1 = require("../helpers/triggerWords");
const useCreateIntegration_1 = require("../hooks/useCreateIntegration");
const useDeleteIntegration_1 = require("../hooks/useDeleteIntegration");
const useUpdateIntegration_1 = require("../hooks/useUpdateIntegration");
const getInitialValue = (webhookData, defaultToken) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
    return ({
        enabled: (_a = webhookData === null || webhookData === void 0 ? void 0 : webhookData.enabled) !== null && _a !== void 0 ? _a : true,
        impersonateUser: (_b = webhookData === null || webhookData === void 0 ? void 0 : webhookData.impersonateUser) !== null && _b !== void 0 ? _b : false,
        event: (_c = webhookData === null || webhookData === void 0 ? void 0 : webhookData.event) !== null && _c !== void 0 ? _c : 'sendMessage',
        urls: (_e = (_d = webhookData === null || webhookData === void 0 ? void 0 : webhookData.urls) === null || _d === void 0 ? void 0 : _d.join('\n')) !== null && _e !== void 0 ? _e : '',
        token: (_f = webhookData === null || webhookData === void 0 ? void 0 : webhookData.token) !== null && _f !== void 0 ? _f : defaultToken,
        triggerWords: (_g = (0, triggerWords_1.triggerWordsToString)(webhookData === null || webhookData === void 0 ? void 0 : webhookData.triggerWords)) !== null && _g !== void 0 ? _g : '',
        targetRoom: (_h = webhookData === null || webhookData === void 0 ? void 0 : webhookData.targetRoom) !== null && _h !== void 0 ? _h : '',
        channel: (_j = webhookData === null || webhookData === void 0 ? void 0 : webhookData.channel.join(', ')) !== null && _j !== void 0 ? _j : '',
        username: (_k = webhookData === null || webhookData === void 0 ? void 0 : webhookData.username) !== null && _k !== void 0 ? _k : '',
        name: (_l = webhookData === null || webhookData === void 0 ? void 0 : webhookData.name) !== null && _l !== void 0 ? _l : '',
        alias: (_m = webhookData === null || webhookData === void 0 ? void 0 : webhookData.alias) !== null && _m !== void 0 ? _m : '',
        avatar: (_o = webhookData === null || webhookData === void 0 ? void 0 : webhookData.avatar) !== null && _o !== void 0 ? _o : '',
        emoji: (_p = webhookData === null || webhookData === void 0 ? void 0 : webhookData.emoji) !== null && _p !== void 0 ? _p : '',
        scriptEnabled: (_q = webhookData === null || webhookData === void 0 ? void 0 : webhookData.scriptEnabled) !== null && _q !== void 0 ? _q : false,
        scriptEngine: (_r = webhookData === null || webhookData === void 0 ? void 0 : webhookData.scriptEngine) !== null && _r !== void 0 ? _r : 'isolated-vm',
        script: (_s = webhookData === null || webhookData === void 0 ? void 0 : webhookData.script) !== null && _s !== void 0 ? _s : '',
        retryFailedCalls: (_t = webhookData === null || webhookData === void 0 ? void 0 : webhookData.retryFailedCalls) !== null && _t !== void 0 ? _t : true,
        retryCount: (_u = webhookData === null || webhookData === void 0 ? void 0 : webhookData.retryCount) !== null && _u !== void 0 ? _u : 6,
        retryDelay: (_v = webhookData === null || webhookData === void 0 ? void 0 : webhookData.retryDelay) !== null && _v !== void 0 ? _v : 'powers-of-ten',
        triggerWordAnywhere: (_w = webhookData === null || webhookData === void 0 ? void 0 : webhookData.triggerWordAnywhere) !== null && _w !== void 0 ? _w : false,
        runOnEdits: (_x = webhookData === null || webhookData === void 0 ? void 0 : webhookData.runOnEdits) !== null && _x !== void 0 ? _x : true,
    });
};
const OUTGOING_TYPE = 'webhook-outgoing';
const EditOutgoingWebhook = ({ webhookData }) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const router = (0, ui_contexts_1.useRouter)();
    const tab = (0, ui_contexts_1.useRouteParameter)('type');
    const defaultToken = (0, fuselage_hooks_1.useUniqueId)();
    const methods = (0, react_hook_form_1.useForm)({ mode: 'onBlur', values: getInitialValue(webhookData, defaultToken) });
    const { reset, handleSubmit, formState: { isDirty }, watch, } = methods;
    const deleteIntegration = (0, useDeleteIntegration_1.useDeleteIntegration)(OUTGOING_TYPE);
    const createIntegration = (0, useCreateIntegration_1.useCreateIntegration)(OUTGOING_TYPE);
    const updateIntegration = (0, useUpdateIntegration_1.useUpdateIntegration)(OUTGOING_TYPE);
    const handleDeleteIntegration = (0, react_1.useCallback)(() => {
        const onDelete = () => __awaiter(void 0, void 0, void 0, function* () {
            deleteIntegration.mutate({ type: OUTGOING_TYPE, integrationId: webhookData === null || webhookData === void 0 ? void 0 : webhookData._id });
        });
        setModal((0, jsx_runtime_1.jsx)(GenericModal_1.default, { variant: 'danger', onConfirm: onDelete, onCancel: () => setModal(null), confirmText: t('Delete'), children: t('Integration_Delete_Warning') }));
    }, [webhookData === null || webhookData === void 0 ? void 0 : webhookData._id, deleteIntegration, setModal, t]);
    const { urls, triggerWords } = watch();
    const handleSave = (0, react_1.useCallback)((_a) => __awaiter(void 0, void 0, void 0, function* () {
        var formValues = __rest(_a, []);
        if (webhookData === null || webhookData === void 0 ? void 0 : webhookData._id) {
            return updateIntegration.mutate(Object.assign(Object.assign({ type: OUTGOING_TYPE, integrationId: webhookData === null || webhookData === void 0 ? void 0 : webhookData._id }, formValues), { triggerWords: (0, triggerWords_1.triggerWordsToArray)(triggerWords), urls: urls.split('\n') }));
        }
        return createIntegration.mutate(Object.assign(Object.assign({ type: OUTGOING_TYPE }, formValues), { triggerWords: (0, triggerWords_1.triggerWordsToArray)(triggerWords), urls: urls.split('\n') }));
    }), [webhookData === null || webhookData === void 0 ? void 0 : webhookData._id, createIntegration, updateIntegration, triggerWords, urls]);
    const formId = (0, fuselage_hooks_1.useUniqueId)();
    return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { flexDirection: 'column', children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Integration_Outgoing_WebHook'), onClickBack: () => router.navigate('/admin/integrations/webhook-outgoing'), children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { children: [(webhookData === null || webhookData === void 0 ? void 0 : webhookData._id) && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: () => router.navigate(`/admin/integrations/history/outgoing/${webhookData._id}`), children: t('History') })), (webhookData === null || webhookData === void 0 ? void 0 : webhookData._id) && ((0, jsx_runtime_1.jsx)(fuselage_1.Button, { danger: true, onClick: handleDeleteIntegration, children: t('Delete') }))] }) }), !(webhookData === null || webhookData === void 0 ? void 0 : webhookData._id) && ((0, jsx_runtime_1.jsxs)(fuselage_1.Tabs, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.TabsItem, { selected: tab === 'incoming', onClick: () => router.navigate('/admin/integrations/new/incoming'), children: t('Incoming') }), (0, jsx_runtime_1.jsx)(fuselage_1.TabsItem, { selected: tab === 'outgoing', onClick: () => router.navigate('/admin/integrations/new/outgoing'), children: t('Outgoing') })] })), (0, jsx_runtime_1.jsx)(Page_1.PageScrollableContentWithShadow, { is: 'form', id: formId, onSubmit: handleSubmit(handleSave), children: (0, jsx_runtime_1.jsx)(react_hook_form_1.FormProvider, Object.assign({}, methods, { children: (0, jsx_runtime_1.jsx)(OutgoingWebhookForm_1.default, {}) })) }), (0, jsx_runtime_1.jsx)(Page_1.PageFooter, { isDirty: isDirty, children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { type: 'reset', onClick: () => reset(), children: t('Cancel') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { form: formId, primary: true, type: 'submit', children: t('Save') })] }) })] }));
};
exports.default = EditOutgoingWebhook;
