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
const ui_client_1 = require("@rocket.chat/ui-client");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const useEncryptedRoomDescription_1 = require("./hooks/useEncryptedRoomDescription");
const UserAutoCompleteMultiple_1 = __importDefault(require("../../components/UserAutoCompleteMultiple"));
const goToRoomById_1 = require("../../lib/utils/goToRoomById");
const CreateTeamModal = ({ onClose }) => {
    var _a, _b;
    const t = (0, ui_contexts_1.useTranslation)();
    const e2eEnabled = (0, ui_contexts_1.useSetting)('E2E_Enable');
    const e2eEnabledForPrivateByDefault = (0, ui_contexts_1.useSetting)('E2E_Enabled_Default_PrivateRooms');
    const namesValidation = (0, ui_contexts_1.useSetting)('UTF8_Channel_Names_Validation');
    const allowSpecialNames = (0, ui_contexts_1.useSetting)('UI_Allow_room_names_with_special_chars');
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const canCreateTeam = (0, ui_contexts_1.usePermission)('create-team');
    const canSetReadOnly = (0, ui_contexts_1.usePermissionWithScopedRoles)('set-readonly', ['owner']);
    const checkTeamNameExists = (0, ui_contexts_1.useEndpoint)('GET', '/v1/rooms.nameExists');
    const createTeamAction = (0, ui_contexts_1.useEndpoint)('POST', '/v1/teams.create');
    const teamNameRegex = (0, react_1.useMemo)(() => {
        if (allowSpecialNames) {
            return null;
        }
        return new RegExp(`^${namesValidation}$`);
    }, [allowSpecialNames, namesValidation]);
    const validateTeamName = (name) => __awaiter(void 0, void 0, void 0, function* () {
        if (!name) {
            return;
        }
        if (teamNameRegex && !(teamNameRegex === null || teamNameRegex === void 0 ? void 0 : teamNameRegex.test(name))) {
            return t('Name_cannot_have_special_characters');
        }
        const { exists } = yield checkTeamNameExists({ roomName: name });
        if (exists) {
            return t('Teams_Errors_Already_exists', { name });
        }
    });
    const { register, control, handleSubmit, setValue, watch, formState: { errors, isSubmitting }, } = (0, react_hook_form_1.useForm)({
        defaultValues: {
            isPrivate: true,
            readOnly: false,
            encrypted: (_a = e2eEnabledForPrivateByDefault) !== null && _a !== void 0 ? _a : false,
            broadcast: false,
            members: [],
            showChannels: true,
            showDiscussions: true,
        },
    });
    const { isPrivate, broadcast, readOnly, encrypted } = watch();
    (0, react_1.useEffect)(() => {
        if (!isPrivate) {
            setValue('encrypted', false);
        }
        if (broadcast) {
            setValue('encrypted', false);
        }
        setValue('readOnly', broadcast);
    }, [watch, setValue, broadcast, isPrivate]);
    const canChangeReadOnly = !broadcast;
    const canChangeEncrypted = isPrivate && !broadcast && e2eEnabled && !e2eEnabledForPrivateByDefault;
    const getEncryptedHint = (0, useEncryptedRoomDescription_1.useEncryptedRoomDescription)('team');
    const handleCreateTeam = (_a) => __awaiter(void 0, [_a], void 0, function* ({ name, members, isPrivate, readOnly, topic, broadcast, encrypted, showChannels, showDiscussions, }) {
        const sidepanelItem = [showChannels && 'channels', showDiscussions && 'discussions'].filter(Boolean);
        const params = Object.assign({ name,
            members, type: isPrivate ? 1 : 0, room: {
                readOnly,
                extraData: {
                    topic,
                    broadcast,
                    encrypted,
                },
            } }, ((showChannels || showDiscussions) && { sidepanel: { items: sidepanelItem } }));
        try {
            const { team } = yield createTeamAction(params);
            dispatchToastMessage({ type: 'success', message: t('Team_has_been_created') });
            (0, goToRoomById_1.goToRoomById)(team.roomId);
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
        finally {
            onClose();
        }
    });
    const createTeamFormId = (0, fuselage_hooks_1.useUniqueId)();
    const nameId = (0, fuselage_hooks_1.useUniqueId)();
    const topicId = (0, fuselage_hooks_1.useUniqueId)();
    const privateId = (0, fuselage_hooks_1.useUniqueId)();
    const readOnlyId = (0, fuselage_hooks_1.useUniqueId)();
    const encryptedId = (0, fuselage_hooks_1.useUniqueId)();
    const broadcastId = (0, fuselage_hooks_1.useUniqueId)();
    const addMembersId = (0, fuselage_hooks_1.useUniqueId)();
    const showChannelsId = (0, fuselage_hooks_1.useUniqueId)();
    const showDiscussionsId = (0, fuselage_hooks_1.useUniqueId)();
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Modal, { "aria-labelledby": `${createTeamFormId}-title`, wrapperFunction: (props) => ((0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ is: 'form', id: createTeamFormId, onSubmit: handleSubmit(handleCreateTeam) }, props))), children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Header, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Modal.Title, { id: `${createTeamFormId}-title`, children: t('Teams_New_Title') }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Close, { title: t('Close'), onClick: onClose, tabIndex: -1 })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Content, { mbe: 2, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { fontScale: 'p2', mbe: 16, children: t('Teams_new_description') }), (0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { mbe: 24, children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { required: true, htmlFor: nameId, children: t('Teams_New_Name_Label') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: nameId, "aria-invalid": errors.name ? 'true' : 'false' }, register('name', {
                                            required: t('Required_field', { field: t('Name') }),
                                            validate: (value) => validateTeamName(value),
                                        }), { addon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { size: 'x20', name: isPrivate ? 'team-lock' : 'team' }), error: (_b = errors.name) === null || _b === void 0 ? void 0 : _b.message, "aria-describedby": `${nameId}-error ${nameId}-hint`, "aria-required": 'true' })) }), (errors === null || errors === void 0 ? void 0 : errors.name) && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${nameId}-error`, children: errors.name.message })), !allowSpecialNames && (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${nameId}-hint`, children: t('No_spaces') })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: topicId, children: t('Topic') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: topicId, "aria-describedby": `${topicId}-hint` }, register('topic'))) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${topicId}-hint`, children: t('Displayed_next_to_name') }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: addMembersId, children: t('Teams_New_Add_members_Label') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'members', render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsx)(UserAutoCompleteMultiple_1.default, { id: addMembersId, value: value, onChange: onChange, placeholder: t('Add_people') })) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: privateId, children: t('Teams_New_Private_Label') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'isPrivate', render: ({ field: { onChange, value, ref } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, { id: privateId, "aria-describedby": `${privateId}-hint`, onChange: onChange, checked: value, ref: ref })) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldDescription, { id: `${privateId}-hint`, children: isPrivate ? t('People_can_only_join_by_being_invited') : t('Anyone_can_access') })] })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Accordion, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.AccordionItem, { title: t('Advanced_settings'), children: [(0, jsx_runtime_1.jsxs)(ui_client_1.FeaturePreview, { feature: 'sidepanelNavigation', children: [(0, jsx_runtime_1.jsx)(ui_client_1.FeaturePreviewOff, { children: null }), (0, jsx_runtime_1.jsxs)(ui_client_1.FeaturePreviewOn, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'h5', fontScale: 'h5', color: 'titles-labels', children: t('Navigation') }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: showChannelsId, children: t('Channels') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'showChannels', render: ({ field: { onChange, value, ref } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, { "aria-describedby": `${showChannelsId}-hint`, id: showChannelsId, onChange: onChange, checked: value, ref: ref })) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldDescription, { id: `${showChannelsId}-hint`, children: t('Show_channels_description') })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: showDiscussionsId, children: t('Discussions') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'showDiscussions', render: ({ field: { onChange, value, ref } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, { "aria-describedby": `${showDiscussionsId}-hint`, id: showDiscussionsId, onChange: onChange, checked: value, ref: ref })) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldDescription, { id: `${showDiscussionsId}-hint`, children: t('Show_discussions_description') })] })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Divider, { mb: 36 })] })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'h5', fontScale: 'h5', color: 'titles-labels', children: t('Security_and_permissions') }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: encryptedId, children: t('Teams_New_Encrypted_Label') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'encrypted', render: ({ field: { onChange, value, ref } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, { id: encryptedId, disabled: !canSetReadOnly || !canChangeEncrypted, onChange: onChange, "aria-describedby": `${encryptedId}-hint`, checked: value, ref: ref })) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldDescription, { id: `${encryptedId}-hint`, children: getEncryptedHint({ isPrivate, broadcast, encrypted }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: readOnlyId, children: t('Teams_New_Read_only_Label') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'readOnly', render: ({ field: { onChange, value, ref } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, { id: readOnlyId, "aria-describedby": `${readOnlyId}-hint`, disabled: !canChangeReadOnly, onChange: onChange, checked: value, ref: ref })) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldDescription, { id: `${readOnlyId}-hint`, children: readOnly ? t('Read_only_field_hint_enabled', { roomType: 'team' }) : t('Anyone_can_send_new_messages') })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: broadcastId, children: t('Teams_New_Broadcast_Label') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'broadcast', render: ({ field: { onChange, value, ref } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, { "aria-describedby": `${broadcastId}-hint`, id: broadcastId, onChange: onChange, checked: value, ref: ref })) })] }), broadcast && (0, jsx_runtime_1.jsx)(fuselage_1.FieldDescription, { id: `${broadcastId}-hint`, children: t('Teams_New_Broadcast_Description') })] })] })] }) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Footer, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Modal.FooterControllers, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: onClose, children: t('Cancel') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { disabled: !canCreateTeam, loading: isSubmitting, type: 'submit', primary: true, children: t('Create') })] }) })] }));
};
exports.default = (0, react_1.memo)(CreateTeamModal);
