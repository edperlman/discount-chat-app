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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionExternalServiceUrl = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const hooks_1 = require("../hooks");
const ActionExternalServiceUrl = (_a) => {
    var { control, trigger, index, disabled } = _a, props = __rest(_a, ["control", "trigger", "index", "disabled"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const serviceUrlFieldId = (0, fuselage_hooks_1.useUniqueId)();
    const serviceUrlFieldName = `actions.${index}.params.serviceUrl`;
    const serviceTimeoutFieldName = `actions.${index}.params.serviceTimeout`;
    const serviceTimeoutValue = (0, react_hook_form_1.useWatch)({ control, name: serviceTimeoutFieldName });
    const [serviceUrlError] = (0, hooks_1.useFieldError)({ control, name: serviceUrlFieldName });
    const [isSuccessMessageVisible, setSuccessMessageVisible] = (0, fuselage_hooks_1.useSafely)((0, react_1.useState)(false));
    const webhookTestEndpoint = (0, ui_contexts_1.useEndpoint)('POST', '/v1/livechat/triggers/external-service/test');
    const showSuccessMesssage = () => {
        setSuccessMessageVisible(true);
        setTimeout(() => setSuccessMessageVisible(false), 3000);
    };
    const webhookTest = (0, react_query_1.useMutation)({
        mutationFn: webhookTestEndpoint,
        onSuccess: showSuccessMesssage,
    });
    const testExternalService = (serviceUrl) => __awaiter(void 0, void 0, void 0, function* () {
        if (!serviceUrl) {
            return true;
        }
        try {
            yield webhookTest.mutateAsync({
                webhookUrl: serviceUrl,
                timeout: serviceTimeoutValue || 10000,
                fallbackMessage: '',
                extraData: [],
            });
            return true;
        }
        catch (e) {
            return t(e.error);
        }
    });
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, Object.assign({}, props, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { required: true, htmlFor: serviceUrlFieldId, children: t('External_service_url') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: serviceUrlFieldName, control: control, defaultValue: '', rules: {
                        required: t('Required_field', { field: t('External_service_url') }),
                        validate: testExternalService,
                        deps: serviceTimeoutFieldName,
                    }, render: ({ field }) => {
                        return (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({}, field, { disabled: webhookTest.isLoading || disabled, error: serviceUrlError === null || serviceUrlError === void 0 ? void 0 : serviceUrlError.message }));
                    } }) }), serviceUrlError && (0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { children: serviceUrlError.message }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { children: t('External_service_test_hint') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { loading: webhookTest.isLoading, disabled: disabled || isSuccessMessageVisible, onClick: () => trigger(serviceUrlFieldName), children: isSuccessMessageVisible ? ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { is: 'span', color: 'status-font-on-success', children: [(0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'success-circle', size: 'x20', verticalAlign: 'middle' }), " ", t('Success'), "!"] })) : (t('Send_Test')) })] })));
};
exports.ActionExternalServiceUrl = ActionExternalServiceUrl;
