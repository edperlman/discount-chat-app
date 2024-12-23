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
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const useRemoveWebDAVAccountIntegrationMutation_1 = require("./hooks/useRemoveWebDAVAccountIntegrationMutation");
const Page_1 = require("../../../components/Page");
const useWebDAVAccountIntegrationsQuery_1 = require("../../../hooks/webdav/useWebDAVAccountIntegrationsQuery");
const getWebdavServerName_1 = require("../../../lib/getWebdavServerName");
const AccountIntegrationsPage = () => {
    const { data: webdavAccountIntegrations } = (0, useWebDAVAccountIntegrationsQuery_1.useWebDAVAccountIntegrationsQuery)();
    const { handleSubmit, control, formState: { errors }, } = (0, react_hook_form_1.useForm)();
    const options = (0, react_1.useMemo)(() => { var _a; return (_a = webdavAccountIntegrations === null || webdavAccountIntegrations === void 0 ? void 0 : webdavAccountIntegrations.map((_a) => {
        var { _id } = _a, current = __rest(_a, ["_id"]);
        return [_id, (0, getWebdavServerName_1.getWebdavServerName)(current)];
    })) !== null && _a !== void 0 ? _a : []; }, [webdavAccountIntegrations]);
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const removeMutation = (0, useRemoveWebDAVAccountIntegrationMutation_1.useRemoveWebDAVAccountIntegrationMutation)({
        onSuccess: () => {
            dispatchToastMessage({ type: 'success', message: t('Webdav_account_removed') });
        },
        onError: (error) => {
            dispatchToastMessage({ type: 'error', message: error });
        },
    });
    const handleSubmitForm = (0, fuselage_hooks_1.useEffectEvent)(({ accountSelected }) => {
        removeMutation.mutate({ accountSelected });
    });
    const accountSelectedId = (0, fuselage_hooks_1.useUniqueId)();
    return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: t('Integrations') }), (0, jsx_runtime_1.jsx)(Page_1.PageScrollableContentWithShadow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'form', maxWidth: 'x600', w: 'full', alignSelf: 'center', onSubmit: handleSubmit(handleSubmitForm), children: (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('WebDAV_Accounts') }), (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'accountSelected', rules: { required: t('Required_field', { field: t('WebDAV_Accounts') }) }, render: ({ field }) => (0, jsx_runtime_1.jsx)(fuselage_1.SelectLegacy, Object.assign({}, field, { options: options, placeholder: t('Select_an_option') })) }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { type: 'submit', danger: true, children: t('Remove') })] }), (errors === null || errors === void 0 ? void 0 : errors.accountSelected) && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${accountSelectedId}-error`, children: errors.accountSelected.message }))] }) }) })] }));
};
exports.default = AccountIntegrationsPage;
