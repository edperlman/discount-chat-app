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
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const emailValidator_1 = require("../../../../lib/emailValidator");
const AutoCompleteDepartment_1 = __importDefault(require("../../../components/AutoCompleteDepartment"));
const Page_1 = require("../../../components/Page");
const useRecordList_1 = require("../../../hooks/lists/useRecordList");
const useHasLicenseModule_1 = require("../../../hooks/useHasLicenseModule");
const useRoomsList_1 = require("../../../hooks/useRoomsList");
const asyncState_1 = require("../../../lib/asyncState");
const additionalForms_1 = require("../additionalForms");
const DepartmentAgentsTable_1 = __importDefault(require("./DepartmentAgentsTable/DepartmentAgentsTable"));
const DepartmentTags_1 = __importDefault(require("./DepartmentTags"));
function withDefault(key, defaultValue) {
    return key || defaultValue;
}
const getInitialValues = ({ department, agents, allowedToForwardData }) => {
    var _a, _b;
    return ({
        name: withDefault(department === null || department === void 0 ? void 0 : department.name, ''),
        email: withDefault(department === null || department === void 0 ? void 0 : department.email, ''),
        description: withDefault(department === null || department === void 0 ? void 0 : department.description, ''),
        enabled: !!(department === null || department === void 0 ? void 0 : department.enabled),
        maxNumberSimultaneousChat: department === null || department === void 0 ? void 0 : department.maxNumberSimultaneousChat,
        showOnRegistration: !!(department === null || department === void 0 ? void 0 : department.showOnRegistration),
        showOnOfflineForm: !!(department === null || department === void 0 ? void 0 : department.showOnOfflineForm),
        abandonedRoomsCloseCustomMessage: withDefault(department === null || department === void 0 ? void 0 : department.abandonedRoomsCloseCustomMessage, ''),
        requestTagBeforeClosingChat: !!(department === null || department === void 0 ? void 0 : department.requestTagBeforeClosingChat),
        offlineMessageChannelName: withDefault(department === null || department === void 0 ? void 0 : department.offlineMessageChannelName, ''),
        visitorInactivityTimeoutInSeconds: department === null || department === void 0 ? void 0 : department.visitorInactivityTimeoutInSeconds,
        waitingQueueMessage: withDefault(department === null || department === void 0 ? void 0 : department.waitingQueueMessage, ''),
        departmentsAllowedToForward: ((_a = allowedToForwardData === null || allowedToForwardData === void 0 ? void 0 : allowedToForwardData.departments) === null || _a === void 0 ? void 0 : _a.map((dep) => ({ label: dep.name, value: dep._id }))) || [],
        fallbackForwardDepartment: withDefault(department === null || department === void 0 ? void 0 : department.fallbackForwardDepartment, ''),
        chatClosingTags: (_b = department === null || department === void 0 ? void 0 : department.chatClosingTags) !== null && _b !== void 0 ? _b : [],
        agentList: agents || [],
        allowReceiveForwardOffline: withDefault(department === null || department === void 0 ? void 0 : department.allowReceiveForwardOffline, false),
    });
};
function EditDepartment({ data, id, title, allowedToForwardData }) {
    var _a, _b, _c, _d, _e;
    const t = (0, ui_contexts_1.useTranslation)();
    const router = (0, ui_contexts_1.useRouter)();
    const queryClient = (0, react_query_1.useQueryClient)();
    const { department, agents = [] } = data || {};
    const hasLicense = (0, useHasLicenseModule_1.useHasLicenseModule)('livechat-enterprise');
    const initialValues = getInitialValues({ department, agents, allowedToForwardData });
    const { register, control, handleSubmit, watch, formState: { errors, isValid, isDirty, isSubmitting }, } = (0, react_hook_form_1.useForm)({ mode: 'onChange', defaultValues: initialValues });
    const requestTagBeforeClosingChat = watch('requestTagBeforeClosingChat');
    const [fallbackFilter, setFallbackFilter] = (0, react_1.useState)('');
    const debouncedFallbackFilter = (0, fuselage_hooks_1.useDebouncedValue)(fallbackFilter, 500);
    const { itemsList: RoomsList, loadMoreItems: loadMoreRooms } = (0, useRoomsList_1.useRoomsList)((0, react_1.useMemo)(() => ({ text: debouncedFallbackFilter }), [debouncedFallbackFilter]));
    const { phase: roomsPhase, items: roomsItems, itemCount: roomsTotal } = (0, useRecordList_1.useRecordList)(RoomsList);
    const saveDepartmentInfo = (0, ui_contexts_1.useMethod)('livechat:saveDepartment');
    const saveDepartmentAgentsInfoOnEdit = (0, ui_contexts_1.useEndpoint)('POST', `/v1/livechat/department/:_id/agents`, { _id: id || '' });
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const handleSave = (0, fuselage_hooks_1.useMutableCallback)((data) => __awaiter(this, void 0, void 0, function* () {
        const { agentList, enabled, name, description, showOnRegistration, showOnOfflineForm, email, chatClosingTags, offlineMessageChannelName, maxNumberSimultaneousChat, visitorInactivityTimeoutInSeconds, abandonedRoomsCloseCustomMessage, waitingQueueMessage, departmentsAllowedToForward, fallbackForwardDepartment, allowReceiveForwardOffline, } = data;
        const payload = {
            enabled,
            name,
            description,
            showOnRegistration,
            showOnOfflineForm,
            requestTagBeforeClosingChat,
            email,
            chatClosingTags,
            offlineMessageChannelName,
            maxNumberSimultaneousChat,
            visitorInactivityTimeoutInSeconds,
            abandonedRoomsCloseCustomMessage,
            waitingQueueMessage,
            departmentsAllowedToForward: departmentsAllowedToForward === null || departmentsAllowedToForward === void 0 ? void 0 : departmentsAllowedToForward.map((dep) => dep.value),
            fallbackForwardDepartment,
            allowReceiveForwardOffline,
        };
        try {
            if (id) {
                const { agentList: initialAgentList } = initialValues;
                const agentListPayload = {
                    upsert: agentList.filter((agent) => !initialAgentList.some((initialAgent) => initialAgent._id === agent._id && agent.count === initialAgent.count && agent.order === initialAgent.order)),
                    remove: initialAgentList.filter((initialAgent) => !agentList.some((agent) => initialAgent._id === agent._id)),
                };
                yield saveDepartmentInfo(id, payload, []);
                if (agentListPayload.upsert.length > 0 || agentListPayload.remove.length > 0) {
                    yield saveDepartmentAgentsInfoOnEdit(agentListPayload);
                }
            }
            else {
                yield saveDepartmentInfo(id !== null && id !== void 0 ? id : null, payload, agentList);
            }
            queryClient.invalidateQueries(['/v1/livechat/department/:_id', id]);
            dispatchToastMessage({ type: 'success', message: t('Saved') });
            router.navigate('/omnichannel/departments');
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    }));
    const isFormValid = isValid && isDirty;
    const formId = (0, fuselage_hooks_1.useUniqueId)();
    const enabledField = (0, fuselage_hooks_1.useUniqueId)();
    const nameField = (0, fuselage_hooks_1.useUniqueId)();
    const descriptionField = (0, fuselage_hooks_1.useUniqueId)();
    const showOnRegistrationField = (0, fuselage_hooks_1.useUniqueId)();
    const emailField = (0, fuselage_hooks_1.useUniqueId)();
    const showOnOfflineFormField = (0, fuselage_hooks_1.useUniqueId)();
    const offlineMessageChannelNameField = (0, fuselage_hooks_1.useUniqueId)();
    const fallbackForwardDepartmentField = (0, fuselage_hooks_1.useUniqueId)();
    const requestTagBeforeClosingChatField = (0, fuselage_hooks_1.useUniqueId)();
    const chatClosingTagsField = (0, fuselage_hooks_1.useUniqueId)();
    const allowReceiveForwardOffline = (0, fuselage_hooks_1.useUniqueId)();
    return ((0, jsx_runtime_1.jsx)(Page_1.Page, { flexDirection: 'row', children: (0, jsx_runtime_1.jsxs)(Page_1.Page, { children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: title, onClickBack: () => router.navigate('/omnichannel/departments'), children: (0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { type: 'submit', form: formId, primary: true, disabled: !isFormValid, loading: isSubmitting, children: t('Save') }) }) }), (0, jsx_runtime_1.jsx)(Page_1.PageScrollableContentWithShadow, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { w: 'full', alignSelf: 'center', maxWidth: 'x600', id: formId, is: 'form', autoComplete: 'off', onSubmit: handleSubmit(handleSave), children: [(0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: enabledField, children: t('Enabled') }), (0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, Object.assign({ id: enabledField }, register('enabled')))] }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: nameField, required: true, children: t('Name') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: nameField, "data-qa": 'DepartmentEditTextInput-Name', flexGrow: 1, error: (_a = errors.name) === null || _a === void 0 ? void 0 : _a.message, placeholder: t('Name') }, register('name', { required: t('Required_field', { field: t('Name') }) }))) }), errors.name && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${nameField}-error`, children: (_b = errors.name) === null || _b === void 0 ? void 0 : _b.message }))] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: descriptionField, children: t('Description') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextAreaInput, Object.assign({ id: descriptionField, "data-qa": 'DepartmentEditTextInput-Description', placeholder: t('Description') }, register('description'))) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Field, { "data-qa": 'DepartmentEditToggle-ShowOnRegistrationPage', children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: showOnRegistrationField, children: t('Show_on_registration_page') }), (0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, Object.assign({ id: showOnRegistrationField }, register('showOnRegistration')))] }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: emailField, required: true, children: t('Email') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: emailField, "data-qa": 'DepartmentEditTextInput-Email', error: (_c = errors.email) === null || _c === void 0 ? void 0 : _c.message, addon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'mail', size: 'x20' }), placeholder: t('Email') }, register('email', {
                                            required: t('Required_field', { field: t('Email') }),
                                            validate: (email) => (0, emailValidator_1.validateEmail)(email) || t('error-invalid-email-address'),
                                        }), { "aria-describedby": `${emailField}-error` })) }), errors.email && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${emailField}-error`, children: (_d = errors.email) === null || _d === void 0 ? void 0 : _d.message }))] }), (0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: showOnOfflineFormField, children: t('Show_on_offline_page') }), (0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, Object.assign({ id: showOnOfflineFormField }, register('showOnOfflineForm')))] }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: offlineMessageChannelNameField, children: t('Livechat_DepartmentOfflineMessageToChannel') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'offlineMessageChannelName', render: ({ field: { value, onChange } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.PaginatedSelectFiltered, { id: offlineMessageChannelNameField, "data-qa": 'DepartmentSelect-LivechatDepartmentOfflineMessageToChannel', value: value, onChange: onChange, flexShrink: 0, filter: fallbackFilter, setFilter: setFallbackFilter, options: roomsItems, placeholder: t('Channel_name'), endReached: roomsPhase === asyncState_1.AsyncStatePhase.LOADING ? () => undefined : (start) => loadMoreRooms(start, Math.min(50, roomsTotal)), "aria-busy": fallbackFilter !== debouncedFallbackFilter })) }) })] }), hasLicense && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'maxNumberSimultaneousChat', render: ({ field }) => ((0, jsx_runtime_1.jsx)(additionalForms_1.EeNumberInput, Object.assign({}, field, { label: t('Max_number_of_chats_per_agent'), placeholder: t('Max_number_of_chats_per_agent_description') }))) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'visitorInactivityTimeoutInSeconds', render: ({ field }) => ((0, jsx_runtime_1.jsx)(additionalForms_1.EeNumberInput, Object.assign({}, field, { label: t('How_long_to_wait_to_consider_visitor_abandonment_in_seconds'), placeholder: t('Number_in_seconds') }))) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'abandonedRoomsCloseCustomMessage', render: ({ field }) => ((0, jsx_runtime_1.jsx)(additionalForms_1.EeTextInput, Object.assign({}, field, { label: t('Livechat_abandoned_rooms_closed_custom_message'), placeholder: t('Enter_a_custom_message') }))) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'waitingQueueMessage', render: ({ field }) => ((0, jsx_runtime_1.jsx)(additionalForms_1.EeTextAreaInput, Object.assign({}, field, { label: t('Waiting_queue_message'), placeholder: t('Waiting_queue_message') }))) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'departmentsAllowedToForward', render: ({ field: { value, onChange } }) => ((0, jsx_runtime_1.jsx)(additionalForms_1.DepartmentForwarding, { departmentId: id !== null && id !== void 0 ? id : '', value: value, handler: onChange, label: 'List_of_departments_for_forward' })) }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: fallbackForwardDepartmentField, children: t('Fallback_forward_department') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'fallbackForwardDepartment', render: ({ field: { value, onChange } }) => ((0, jsx_runtime_1.jsx)(AutoCompleteDepartment_1.default, { id: fallbackForwardDepartmentField, haveNone: true, excludeDepartmentId: department === null || department === void 0 ? void 0 : department._id, value: value, onChange: onChange, onlyMyDepartments: true, showArchived: true, withTitle: false, renderItem: (_a) => {
                                                        var { label } = _a, props = __rest(_a, ["label"]);
                                                        return ((0, jsx_runtime_1.jsx)(fuselage_1.Option, Object.assign({}, props, { label: (0, jsx_runtime_1.jsx)("span", { style: { whiteSpace: 'normal' }, children: label }) })));
                                                    } })) })] })] })), (0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: requestTagBeforeClosingChatField, children: t('Request_tag_before_closing_chat') }), (0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, Object.assign({ id: requestTagBeforeClosingChatField }, register('requestTagBeforeClosingChat')))] }) }), requestTagBeforeClosingChat && ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: chatClosingTagsField, required: true, children: t('Conversation_closing_tags') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'chatClosingTags', rules: { required: t('Required_field', 'tags') }, render: ({ field: { value, onChange } }) => {
                                            var _a;
                                            return ((0, jsx_runtime_1.jsx)(DepartmentTags_1.default, { id: chatClosingTagsField, value: value, onChange: onChange, error: (_a = errors.chatClosingTags) === null || _a === void 0 ? void 0 : _a.message, "aria-describedby": `${chatClosingTagsField}-hint ${chatClosingTagsField}-error` }));
                                        } }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${chatClosingTagsField}-hint`, children: t('Conversation_closing_tags_description') }), errors.chatClosingTags && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${chatClosingTagsField}-error`, children: (_e = errors.chatClosingTags) === null || _e === void 0 ? void 0 : _e.message }))] })), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: allowReceiveForwardOffline, children: t('Accept_receive_inquiry_no_online_agents') }), (0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, Object.assign({ id: allowReceiveForwardOffline }, register('allowReceiveForwardOffline')))] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${allowReceiveForwardOffline}-hint`, children: t('Accept_receive_inquiry_no_online_agents_Hint') }) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsx)(additionalForms_1.DepartmentBusinessHours, { bhId: department === null || department === void 0 ? void 0 : department.businessHourId }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Divider, { mb: 16 }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { mb: 4, children: t('Agents') }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', height: '50vh', children: (0, jsx_runtime_1.jsx)(DepartmentAgentsTable_1.default, { control: control, register: register }) })] })] }) })] }) }));
}
exports.default = EditDepartment;
