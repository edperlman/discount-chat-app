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
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importDefault(require("react"));
const react_hook_form_1 = require("react-hook-form");
const UsersInRoleTable_1 = __importDefault(require("./UsersInRoleTable"));
const Page_1 = require("../../../../components/Page");
const RoomAutoComplete_1 = __importDefault(require("../../../../components/RoomAutoComplete"));
const UserAutoCompleteMultiple_1 = __importDefault(require("../../../../components/UserAutoCompleteMultiple"));
const UsersInRolePage = ({ role }) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const queryClient = (0, react_query_1.useQueryClient)();
    const { control, handleSubmit, formState: { errors, isDirty }, watch, } = (0, react_hook_form_1.useForm)({ defaultValues: { users: [] } });
    const { _id, name, description } = role;
    const router = (0, ui_contexts_1.useRouter)();
    const addUserToRoleEndpoint = (0, ui_contexts_1.useEndpoint)('POST', '/v1/roles.addUserToRole');
    const { rid } = watch();
    const roomFieldId = (0, fuselage_hooks_1.useUniqueId)();
    const usersFieldId = (0, fuselage_hooks_1.useUniqueId)();
    const handleAdd = (0, fuselage_hooks_1.useEffectEvent)((_a) => __awaiter(void 0, [_a], void 0, function* ({ users, rid }) {
        try {
            yield Promise.all(users.map((user) => __awaiter(void 0, void 0, void 0, function* () {
                if (user) {
                    yield addUserToRoleEndpoint({ roleName: _id, username: user, roomId: rid });
                }
            })));
            dispatchToastMessage({ type: 'success', message: t('Users_added') });
            queryClient.invalidateQueries(['getUsersInRole']);
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    }));
    return ((0, jsx_runtime_1.jsxs)(Page_1.Page, { children: [(0, jsx_runtime_1.jsx)(Page_1.PageHeader, { title: `${t('Users_in_role')} "${description || name}"`, children: (0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, { children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: () => router.navigate(`/admin/permissions/edit/${_id}`), children: t('Back') }) }) }), (0, jsx_runtime_1.jsxs)(Page_1.PageContent, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', flexDirection: 'column', w: 'full', mi: 'neg-x4', children: (0, jsx_runtime_1.jsxs)(fuselage_1.Margins, { inline: 4, children: [role.scope !== 'Users' && ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { mbe: 4, children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: roomFieldId, children: t('Choose_a_room') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'rid', rules: { required: t('Required_field', { field: t('Room') }) }, render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsx)(RoomAutoComplete_1.default, { id: roomFieldId, "aria-required": 'true', "aria-invalid": Boolean(errors.rid), "aria-describedby": `${roomFieldId}-error`, scope: 'admin', value: value, onChange: onChange, placeholder: t('Room') })) }) }), errors.rid && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${roomFieldId}-error`, children: errors.rid.message }))] })), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: usersFieldId, children: t('Add_users') }), (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'users', rules: { required: t('Required_field', { field: t('Users') }) }, render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsx)(UserAutoCompleteMultiple_1.default, { id: usersFieldId, "aria-required": 'true', "aria-invalid": Boolean(errors.users), "aria-describedby": `${usersFieldId}-error`, value: value, placeholder: t('Users'), onChange: onChange })) }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { mis: 8, primary: true, onClick: handleSubmit(handleAdd), disabled: !isDirty, children: t('Add') })] }), errors.users && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${usersFieldId}-error`, children: errors.users.message }) }))] })] }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Margins, { blockStart: 8, children: [(role.scope === 'Users' || rid) && (0, jsx_runtime_1.jsx)(UsersInRoleTable_1.default, { rid: rid, roleId: _id, roleName: name, description: description }), role.scope !== 'Users' && !rid && (0, jsx_runtime_1.jsx)(fuselage_1.Callout, { type: 'info', children: t('Select_a_room') })] })] })] }));
};
exports.default = UsersInRolePage;
