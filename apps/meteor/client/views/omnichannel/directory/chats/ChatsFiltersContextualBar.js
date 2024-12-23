"use strict";
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
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const date_fns_1 = require("date-fns");
const react_1 = __importDefault(require("react"));
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const AutoCompleteAgent_1 = __importDefault(require("../../../../components/AutoCompleteAgent"));
const AutoCompleteDepartment_1 = __importDefault(require("../../../../components/AutoCompleteDepartment"));
const Contextualbar_1 = require("../../../../components/Contextualbar");
const additionalForms_1 = require("../../additionalForms");
const ChatsContext_1 = require("../contexts/ChatsContext");
const ChatsFiltersContextualBar = ({ onClose }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const canViewLivechatRooms = (0, ui_contexts_1.usePermission)('view-livechat-rooms');
    const canViewCustomFields = (0, ui_contexts_1.usePermission)('view-livechat-room-customfields');
    const allCustomFields = (0, ui_contexts_1.useEndpoint)('GET', '/v1/livechat/custom-fields');
    const { data } = (0, react_query_1.useQuery)(['livechat/custom-fields'], () => __awaiter(void 0, void 0, void 0, function* () { return allCustomFields(); }));
    const contactCustomFields = data === null || data === void 0 ? void 0 : data.customFields.filter((customField) => customField.scope !== 'visitor');
    const { filtersQuery, setFiltersQuery, resetFiltersQuery, hasAppliedFilters } = (0, ChatsContext_1.useChatsContext)();
    const queryClient = (0, react_query_1.useQueryClient)();
    const { handleSubmit, control, reset } = (0, react_hook_form_1.useForm)({
        values: filtersQuery,
    });
    const statusOptions = [
        ['all', t('All')],
        ['closed', t('Closed')],
        ['opened', t('Room_Status_Open')],
        ['onhold', t('On_Hold_Chats')],
        ['queued', t('Queued')],
    ];
    const handleSubmitFilters = (data) => {
        setFiltersQuery(({ guest }) => (Object.assign(Object.assign({}, data), { guest })));
        queryClient.invalidateQueries(['current-chats']);
    };
    const handleResetFilters = () => {
        resetFiltersQuery();
        reset();
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarHeader, { children: [(0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarIcon, { name: 'customize' }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarTitle, { children: t('Filters') }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarClose, { onClick: onClose })] }), (0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarScrollableContent, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('From') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'from', control: control, render: ({ field }) => (0, jsx_runtime_1.jsx)(fuselage_1.InputBox, Object.assign({ type: 'date', placeholder: t('From'), max: (0, date_fns_1.format)(new Date(), 'yyyy-MM-dd') }, field)) }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('To') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'to', control: control, render: ({ field }) => (0, jsx_runtime_1.jsx)(fuselage_1.InputBox, Object.assign({ type: 'date', placeholder: t('To'), max: (0, date_fns_1.format)(new Date(), 'yyyy-MM-dd') }, field)) }) })] }), canViewLivechatRooms && ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Served_By') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'servedBy', control: control, render: ({ field: { value, onChange } }) => (0, jsx_runtime_1.jsx)(AutoCompleteAgent_1.default, { haveAll: true, value: value, onChange: onChange }) }) })] })), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Status') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'status', control: control, render: ({ field }) => (0, jsx_runtime_1.jsx)(fuselage_1.Select, Object.assign({}, field, { options: statusOptions, placeholder: t('Select_an_option') })) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Department') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'department', control: control, render: ({ field: { value, onChange } }) => ((0, jsx_runtime_1.jsx)(AutoCompleteDepartment_1.default, { haveAll: true, showArchived: true, value: value, onChange: onChange, onlyMyDepartments: true })) }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Tags') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'tags', control: control, render: ({ field: { value, onChange } }) => (0, jsx_runtime_1.jsx)(additionalForms_1.CurrentChatTags, { value: value, handler: onChange, viewAll: true }) }) })] }), canViewCustomFields &&
                        (contactCustomFields === null || contactCustomFields === void 0 ? void 0 : contactCustomFields.map((customField) => {
                            if (customField.type === 'select') {
                                return ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: customField.label }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: customField._id, control: control, render: ({ field }) => ((0, jsx_runtime_1.jsx)(fuselage_1.Select, Object.assign({}, field, { value: field.value, options: (customField.options || '').split(',').map((item) => [item, item]) }))) }) })] }, customField._id));
                            }
                            return ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: customField.label }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: customField._id, control: control, render: ({ field }) => (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({}, field, { value: field.value })) }) })] }, customField._id));
                        }))] }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarFooter, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { stretch: true, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { disabled: !hasAppliedFilters, onClick: handleResetFilters, children: t('Clear_filters') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: handleSubmit(handleSubmitFilters), primary: true, children: t('Apply') })] }) })] }));
};
exports.default = ChatsFiltersContextualBar;
