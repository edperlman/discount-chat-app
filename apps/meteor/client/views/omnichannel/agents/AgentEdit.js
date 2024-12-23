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
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const getUserEmailAddress_1 = require("../../../../lib/getUserEmailAddress");
const Contextualbar_1 = require("../../../components/Contextualbar");
const UserInfo_1 = require("../../../components/UserInfo");
const additionalForms_1 = require("../additionalForms");
const AgentEdit = ({ agentData, userDepartments, availableDepartments }) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const router = (0, ui_contexts_1.useRouter)();
    const queryClient = (0, react_query_1.useQueryClient)();
    const voipEnabled = (0, ui_contexts_1.useSetting)('VoIP_Enabled');
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const { name, username, livechat, statusLivechat } = agentData;
    const email = (0, getUserEmailAddress_1.getUserEmailAddress)(agentData);
    const departments = (0, react_1.useMemo)(() => {
        const pending = userDepartments
            .filter(({ departmentId }) => !availableDepartments.find((dep) => dep._id === departmentId))
            .map((dep) => ({
            _id: dep.departmentId,
            name: dep.departmentName,
        }));
        return [...availableDepartments, ...pending];
    }, [availableDepartments, userDepartments]);
    const departmentsOptions = (0, react_1.useMemo)(() => {
        const archivedDepartment = (name, archived) => (archived ? `${name} [${t('Archived')}]` : name);
        return (departments.map(({ _id, name, archived }) => name ? [_id, archivedDepartment(name, archived)] : [_id, archivedDepartment(_id, archived)]) || []);
    }, [departments, t]);
    const statusOptions = (0, react_1.useMemo)(() => [
        ['available', t('Available')],
        ['not-available', t('Not_Available')],
    ], [t]);
    const initialDepartmentValue = (0, react_1.useMemo)(() => userDepartments.map(({ departmentId }) => departmentId) || [], [userDepartments]);
    const methods = (0, react_hook_form_1.useForm)({
        values: {
            name,
            username,
            email,
            departments: initialDepartmentValue,
            status: statusLivechat,
            maxNumberSimultaneousChat: (livechat === null || livechat === void 0 ? void 0 : livechat.maxNumberSimultaneousChat) || 0,
            voipExtension: '',
        },
    });
    const { control, handleSubmit, reset, formState: { isDirty }, } = methods;
    const saveAgentInfo = (0, ui_contexts_1.useMethod)('livechat:saveAgentInfo');
    const saveAgentStatus = (0, ui_contexts_1.useEndpoint)('POST', '/v1/livechat/agent.status');
    const handleSave = (0, fuselage_hooks_1.useMutableCallback)((_a) => __awaiter(void 0, void 0, void 0, function* () {
        var { status, departments } = _a, data = __rest(_a, ["status", "departments"]);
        try {
            yield saveAgentStatus({ agentId: agentData._id, status });
            yield saveAgentInfo(agentData._id, data, departments);
            dispatchToastMessage({ type: 'success', message: t('Success') });
            router.navigate('/omnichannel/agents');
            queryClient.invalidateQueries(['livechat-agents']);
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    }));
    const formId = (0, fuselage_hooks_1.useUniqueId)();
    const nameField = (0, fuselage_hooks_1.useUniqueId)();
    const usernameField = (0, fuselage_hooks_1.useUniqueId)();
    const emailField = (0, fuselage_hooks_1.useUniqueId)();
    const departmentsField = (0, fuselage_hooks_1.useUniqueId)();
    const statusField = (0, fuselage_hooks_1.useUniqueId)();
    const voipExtensionField = (0, fuselage_hooks_1.useUniqueId)();
    return ((0, jsx_runtime_1.jsxs)(Contextualbar_1.Contextualbar, { "data-qa-id": 'agent-edit-contextual-bar', children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarHeader, { children: [(0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarTitle, { children: t('Edit_User') }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarClose, { onClick: () => router.navigate('/omnichannel/agents') })] }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarScrollableContent, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.FormProvider, Object.assign({}, methods, { children: (0, jsx_runtime_1.jsxs)("form", { id: formId, onSubmit: handleSubmit(handleSave), children: [username && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', alignItems: 'center', children: (0, jsx_runtime_1.jsx)(UserInfo_1.UserInfoAvatar, { "data-qa-id": 'agent-edit-avatar', username: username }) })), (0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: nameField, children: t('Name') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'name', control: control, render: ({ field }) => (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: nameField, "data-qa-id": 'agent-edit-name' }, field, { readOnly: true })) }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: usernameField, children: t('Username') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'username', control: control, render: ({ field }) => ((0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: usernameField, "data-qa-id": 'agent-edit-username' }, field, { readOnly: true, addon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'at', size: 'x20' }) }))) }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: emailField, children: t('Email') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'email', control: control, render: ({ field }) => ((0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: emailField, "data-qa-id": 'agent-edit-email' }, field, { readOnly: true, addon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'mail', size: 'x20' }) }))) }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: departmentsField, children: t('Departments') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'departments', control: control, render: ({ field }) => ((0, jsx_runtime_1.jsx)(fuselage_1.MultiSelect, Object.assign({ id: departmentsField, "data-qa-id": 'agent-edit-departments', options: departmentsOptions }, field, { placeholder: t('Select_an_option'), renderItem: (_a) => {
                                                            var { label } = _a, props = __rest(_a, ["label"]);
                                                            return ((0, jsx_runtime_1.jsx)(fuselage_1.CheckOption, Object.assign({}, props, { label: (0, jsx_runtime_1.jsx)("span", { style: { whiteSpace: 'normal' }, children: label }) })));
                                                        } }))) }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: statusField, children: t('Status') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'status', control: control, render: ({ field }) => ((0, jsx_runtime_1.jsx)(fuselage_1.Select, Object.assign({ id: statusField, "data-qa-id": 'agent-edit-status' }, field, { options: statusOptions, placeholder: t('Select_an_option') }))) }) })] }), additionalForms_1.MaxChatsPerAgent && (0, jsx_runtime_1.jsx)(additionalForms_1.MaxChatsPerAgent, {}), voipEnabled && ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: voipExtensionField, children: t('VoIP_Extension') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'voipExtension', control: control, render: ({ field }) => (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: voipExtensionField }, field, { "data-qa-id": 'agent-edit-voip-extension' })) }) })] }))] })] }) })) }), (0, jsx_runtime_1.jsx)(fuselage_1.ContextualbarFooter, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { stretch: true, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { "data-qa-id": 'agent-edit-reset', type: 'reset', disabled: !isDirty, onClick: () => reset(), children: t('Reset') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { form: formId, primary: true, type: 'submit', "data-qa-id": 'agent-edit-save', disabled: !isDirty, children: t('Save') })] }) })] }));
};
exports.default = AgentEdit;
