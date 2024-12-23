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
const useEncryptedRoomDescription_1 = require("./hooks/useEncryptedRoomDescription");
const UserAutoCompleteMultipleFederated_1 = __importDefault(require("../../components/UserAutoCompleteMultiple/UserAutoCompleteMultipleFederated"));
const useHasLicenseModule_1 = require("../../hooks/useHasLicenseModule");
const goToRoomById_1 = require("../../lib/utils/goToRoomById");
const getFederationHintKey = (licenseModule, featureToggle) => {
    if (licenseModule === 'loading' || !licenseModule) {
        return 'error-this-is-a-premium-feature';
    }
    if (!featureToggle) {
        return 'Federation_Matrix_Federated_Description_disabled';
    }
    return 'Federation_Matrix_Federated_Description';
};
const CreateChannelModal = ({ teamId = '', onClose, reload }) => {
    var _a, _b;
    const t = (0, ui_contexts_1.useTranslation)();
    const canSetReadOnly = (0, ui_contexts_1.usePermissionWithScopedRoles)('set-readonly', ['owner']);
    const e2eEnabled = (0, ui_contexts_1.useSetting)('E2E_Enable');
    const namesValidation = (0, ui_contexts_1.useSetting)('UTF8_Channel_Names_Validation');
    const allowSpecialNames = (0, ui_contexts_1.useSetting)('UI_Allow_room_names_with_special_chars');
    const federationEnabled = (0, ui_contexts_1.useSetting)('Federation_Matrix_enabled', false);
    const e2eEnabledForPrivateByDefault = (0, ui_contexts_1.useSetting)('E2E_Enabled_Default_PrivateRooms') && e2eEnabled;
    const canCreateChannel = (0, ui_contexts_1.usePermission)('create-c');
    const canCreatePrivateChannel = (0, ui_contexts_1.usePermission)('create-p');
    const getEncryptedHint = (0, useEncryptedRoomDescription_1.useEncryptedRoomDescription)('channel');
    const channelNameRegex = (0, react_1.useMemo)(() => new RegExp(`^${namesValidation}$`), [namesValidation]);
    const federatedModule = (0, useHasLicenseModule_1.useHasLicenseModule)('federation');
    const canUseFederation = federatedModule !== 'loading' && federatedModule && federationEnabled;
    const channelNameExists = (0, ui_contexts_1.useEndpoint)('GET', '/v1/rooms.nameExists');
    const createChannel = (0, ui_contexts_1.useEndpoint)('POST', '/v1/channels.create');
    const createPrivateChannel = (0, ui_contexts_1.useEndpoint)('POST', '/v1/groups.create');
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const canOnlyCreateOneType = (0, react_1.useMemo)(() => {
        if (!canCreateChannel && canCreatePrivateChannel) {
            return 'p';
        }
        if (canCreateChannel && !canCreatePrivateChannel) {
            return 'c';
        }
        return false;
    }, [canCreateChannel, canCreatePrivateChannel]);
    const { register, formState: { errors }, handleSubmit, control, setValue, watch, } = (0, react_hook_form_1.useForm)({
        mode: 'onBlur',
        defaultValues: {
            members: [],
            name: '',
            topic: '',
            isPrivate: canOnlyCreateOneType ? canOnlyCreateOneType === 'p' : true,
            readOnly: false,
            encrypted: (_a = e2eEnabledForPrivateByDefault) !== null && _a !== void 0 ? _a : false,
            broadcast: false,
            federated: false,
        },
    });
    const { isPrivate, broadcast, readOnly, federated, encrypted } = watch();
    (0, react_1.useEffect)(() => {
        if (!isPrivate) {
            setValue('encrypted', false);
        }
        if (broadcast) {
            setValue('encrypted', false);
        }
        if (federated) {
            // if room is federated, it cannot be encrypted or broadcast or readOnly
            setValue('encrypted', false);
            setValue('broadcast', false);
            setValue('readOnly', false);
        }
        setValue('readOnly', broadcast);
    }, [federated, setValue, broadcast, isPrivate]);
    const validateChannelName = (name) => __awaiter(void 0, void 0, void 0, function* () {
        if (!name) {
            return;
        }
        if (!allowSpecialNames && !channelNameRegex.test(name)) {
            return t('Name_cannot_have_special_characters');
        }
        const { exists } = yield channelNameExists({ roomName: name });
        if (exists) {
            return t('Channel_already_exist', name);
        }
    });
    const handleCreateChannel = (_a) => __awaiter(void 0, [_a], void 0, function* ({ name, members, readOnly, topic, broadcast, encrypted, federated }) {
        let roomData;
        const params = {
            name,
            members,
            readOnly,
            extraData: Object.assign(Object.assign({ topic,
                broadcast,
                encrypted }, (federated && { federated })), (teamId && { teamId })),
        };
        try {
            if (isPrivate) {
                roomData = yield createPrivateChannel(params);
                !teamId && (0, goToRoomById_1.goToRoomById)(roomData.group._id);
            }
            else {
                roomData = yield createChannel(params);
                !teamId && (0, goToRoomById_1.goToRoomById)(roomData.channel._id);
            }
            dispatchToastMessage({ type: 'success', message: t('Room_has_been_created') });
            reload === null || reload === void 0 ? void 0 : reload();
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
        finally {
            onClose();
        }
    });
    const e2eDisabled = (0, react_1.useMemo)(() => !isPrivate || broadcast || Boolean(!e2eEnabled) || Boolean(e2eEnabledForPrivateByDefault), [e2eEnabled, e2eEnabledForPrivateByDefault, broadcast, isPrivate]);
    const createChannelFormId = (0, fuselage_hooks_1.useUniqueId)();
    const nameId = (0, fuselage_hooks_1.useUniqueId)();
    const topicId = (0, fuselage_hooks_1.useUniqueId)();
    const privateId = (0, fuselage_hooks_1.useUniqueId)();
    const federatedId = (0, fuselage_hooks_1.useUniqueId)();
    const readOnlyId = (0, fuselage_hooks_1.useUniqueId)();
    const encryptedId = (0, fuselage_hooks_1.useUniqueId)();
    const broadcastId = (0, fuselage_hooks_1.useUniqueId)();
    const addMembersId = (0, fuselage_hooks_1.useUniqueId)();
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Modal, { "data-qa": 'create-channel-modal', "aria-labelledby": `${createChannelFormId}-title`, wrapperFunction: (props) => ((0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ is: 'form', id: createChannelFormId, onSubmit: handleSubmit(handleCreateChannel) }, props))), children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Header, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Modal.Title, { id: `${createChannelFormId}-title`, children: t('Create_channel') }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Close, { tabIndex: -1, title: t('Close'), onClick: onClose })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Content, { mbe: 2, children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { mbe: 24, children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { required: true, htmlFor: nameId, children: t('Name') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: nameId, "data-qa-type": 'channel-name-input' }, register('name', {
                                            required: t('Required_field', { field: t('Name') }),
                                            validate: (value) => validateChannelName(value),
                                        }), { error: (_b = errors.name) === null || _b === void 0 ? void 0 : _b.message, addon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: isPrivate ? 'hashtag-lock' : 'hashtag', size: 'x20' }), "aria-invalid": errors.name ? 'true' : 'false', "aria-describedby": `${nameId}-error ${nameId}-hint`, "aria-required": 'true' })) }), errors.name && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${nameId}-error`, children: errors.name.message })), !allowSpecialNames && (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${nameId}-hint`, children: t('No_spaces') })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: topicId, children: t('Topic') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: topicId, "aria-describedby": `${topicId}-hint` }, register('topic'), { "data-qa-type": 'channel-topic-input' })) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${topicId}-hint`, children: t('Displayed_next_to_name') })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: addMembersId, children: t('Members') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'members', render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsx)(UserAutoCompleteMultipleFederated_1.default, { id: addMembersId, value: value, onChange: onChange, placeholder: t('Add_people') })) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: privateId, children: t('Private') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'isPrivate', render: ({ field: { onChange, value, ref } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, { id: privateId, "aria-describedby": `${privateId}-hint`, ref: ref, checked: value, disabled: !!canOnlyCreateOneType, onChange: onChange })) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${privateId}-hint`, children: isPrivate ? t('People_can_only_join_by_being_invited') : t('Anyone_can_access') })] })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Accordion, { children: (0, jsx_runtime_1.jsx)(fuselage_1.AccordionItem, { title: t('Advanced_settings'), children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'h5', fontScale: 'h5', color: 'titles-labels', children: t('Security_and_permissions') }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: federatedId, children: t('Federation_Matrix_Federated') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'federated', render: ({ field: { onChange, value, ref } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, { "aria-describedby": `${federatedId}-hint`, id: federatedId, ref: ref, checked: value, disabled: !canUseFederation, onChange: onChange })) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${federatedId}-hint`, children: t(getFederationHintKey(federatedModule, federationEnabled)) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: encryptedId, children: t('Encrypted') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'encrypted', render: ({ field: { onChange, value, ref } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, { id: encryptedId, ref: ref, checked: value, disabled: e2eDisabled || federated, onChange: onChange, "aria-describedby": `${encryptedId}-hint`, "aria-labelledby": 'Encrypted_channel_Label' })) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldDescription, { id: `${encryptedId}-hint`, children: getEncryptedHint({ isPrivate, broadcast, encrypted }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: readOnlyId, children: t('Read_only') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'readOnly', render: ({ field: { onChange, value, ref } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, { id: readOnlyId, "aria-describedby": `${readOnlyId}-hint`, ref: ref, checked: value, disabled: !canSetReadOnly || broadcast || federated, onChange: onChange })) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${readOnlyId}-hint`, children: readOnly ? t('Read_only_field_hint_enabled', { roomType: 'channel' }) : t('Anyone_can_send_new_messages') })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: broadcastId, children: t('Broadcast') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'broadcast', render: ({ field: { onChange, value, ref } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, { "aria-describedby": `${broadcastId}-hint`, id: broadcastId, ref: ref, checked: value, disabled: !!federated, onChange: onChange })) })] }), broadcast && (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${broadcastId}-hint`, children: t('Broadcast_hint_enabled', { roomType: 'channel' }) })] })] }) }) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Footer, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Modal.FooterControllers, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: onClose, children: t('Cancel') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { type: 'submit', primary: true, "data-qa-type": 'create-channel-confirm-button', children: t('Create') })] }) })] }));
};
exports.default = CreateChannelModal;
