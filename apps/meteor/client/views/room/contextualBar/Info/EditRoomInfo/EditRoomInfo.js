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
const core_typings_1 = require("@rocket.chat/core-typings");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_client_1 = require("@rocket.chat/ui-client");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const useEditRoomInitialValues_1 = require("./useEditRoomInitialValues");
const useEditRoomPermissions_1 = require("./useEditRoomPermissions");
const MessageTypes_1 = require("../../../../../../app/lib/lib/MessageTypes");
const Contextualbar_1 = require("../../../../../components/Contextualbar");
const RawText_1 = __importDefault(require("../../../../../components/RawText"));
const RoomAvatarEditor_1 = __importDefault(require("../../../../../components/avatar/RoomAvatarEditor"));
const convertTimeUnit_1 = require("../../../../../lib/convertTimeUnit");
const getDirtyFields_1 = require("../../../../../lib/getDirtyFields");
const useArchiveRoom_1 = require("../../../../hooks/roomActions/useArchiveRoom");
const useRetentionPolicy_1 = require("../../../hooks/useRetentionPolicy");
const title = {
    team: 'Edit_team',
    channel: 'Edit_channel',
    discussion: 'Edit_discussion',
};
const getRetentionSetting = (roomType) => {
    switch (roomType) {
        case 'd':
            return 'RetentionPolicy_TTL_DMs';
        case 'p':
            return 'RetentionPolicy_TTL_Groups';
        case 'c':
        default:
            return 'RetentionPolicy_TTL_Channels';
    }
};
const EditRoomInfo = ({ room, onClickClose, onClickBack }) => {
    var _a;
    const query = (0, react_query_1.useQueryClient)();
    const t = (0, ui_contexts_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const isFederated = (0, react_1.useMemo)(() => (0, core_typings_1.isRoomFederated)(room), [room]);
    // eslint-disable-next-line no-nested-ternary
    const roomType = 'prid' in room ? 'discussion' : room.teamMain ? 'team' : 'channel';
    const retentionPolicy = (0, useRetentionPolicy_1.useRetentionPolicy)(room);
    const retentionMaxAgeDefault = (_a = (0, convertTimeUnit_1.msToTimeUnit)(convertTimeUnit_1.TIMEUNIT.days, (0, ui_contexts_1.useSetting)(getRetentionSetting(room.t), 2592000000))) !== null && _a !== void 0 ? _a : 30;
    const defaultValues = (0, useEditRoomInitialValues_1.useEditRoomInitialValues)(room);
    const namesValidation = (0, ui_contexts_1.useSetting)('UTF8_Channel_Names_Validation');
    const allowSpecialNames = (0, ui_contexts_1.useSetting)('UI_Allow_room_names_with_special_chars');
    const checkTeamNameExists = (0, ui_contexts_1.useEndpoint)('GET', '/v1/rooms.nameExists');
    const teamNameRegex = (0, react_1.useMemo)(() => {
        if (allowSpecialNames) {
            return null;
        }
        return new RegExp(`^${namesValidation}$`);
    }, [allowSpecialNames, namesValidation]);
    const { watch, reset, control, handleSubmit, getFieldState, formState: { isDirty, dirtyFields, errors, isSubmitting }, } = (0, react_hook_form_1.useForm)({ mode: 'onBlur', defaultValues });
    const sysMesOptions = (0, react_1.useMemo)(() => MessageTypes_1.MessageTypesValues.map(({ key, i18nLabel }) => [key, t(i18nLabel)]), [t]);
    const { isDirty: isRoomNameDirty } = getFieldState('roomName');
    const { readOnly, archived, joinCodeRequired, hideSysMes, retentionEnabled, retentionOverrideGlobal, roomType: roomTypeP, reactWhenReadOnly, showChannels, showDiscussions, } = watch();
    const { canChangeType, canSetReadOnly, canSetReactWhenReadOnly, canEditRoomRetentionPolicy, canArchiveOrUnarchive, canToggleEncryption, canViewName, canViewTopic, canViewAnnouncement, canViewArchived, canViewDescription, canViewType, canViewReadOnly, canViewHideSysMes, canViewJoinCode, canViewEncrypted, } = (0, useEditRoomPermissions_1.useEditRoomPermissions)(room);
    const changeArchiving = archived !== !!room.archived;
    const saveAction = (0, ui_contexts_1.useEndpoint)('POST', '/v1/rooms.saveRoomSettings');
    const handleArchive = (0, useArchiveRoom_1.useArchiveRoom)(room);
    // TODO: add payload validation
    const handleUpdateRoomData = (0, fuselage_hooks_1.useEffectEvent)((_a) => __awaiter(void 0, void 0, void 0, function* () {
        var { hideSysMes, joinCodeRequired, retentionEnabled, retentionOverrideGlobal, retentionMaxAge, retentionExcludePinned, retentionFilesOnly, retentionIgnoreThreads } = _a, formData = __rest(_a, ["hideSysMes", "joinCodeRequired", "retentionEnabled", "retentionOverrideGlobal", "retentionMaxAge", "retentionExcludePinned", "retentionFilesOnly", "retentionIgnoreThreads"]);
        const data = (0, getDirtyFields_1.getDirtyFields)(formData, dirtyFields);
        delete data.archived;
        delete data.showChannels;
        delete data.showDiscussions;
        const sidepanelItems = [showChannels && 'channels', showDiscussions && 'discussions'].filter(Boolean);
        const sidepanel = sidepanelItems.length > 0 ? { items: sidepanelItems } : null;
        try {
            yield saveAction(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ rid: room._id }, data), (roomType === 'team' ? { sidepanel } : null)), ((data.joinCode || 'joinCodeRequired' in data) && { joinCode: joinCodeRequired ? data.joinCode : '' })), ((data.systemMessages || !hideSysMes) && {
                systemMessages: hideSysMes && data.systemMessages,
            })), { retentionEnabled,
                retentionOverrideGlobal }), (retentionEnabled &&
                retentionOverrideGlobal && {
                retentionMaxAge,
                retentionExcludePinned,
                retentionFilesOnly,
                retentionIgnoreThreads,
            })));
            yield query.invalidateQueries(['/v1/rooms.info', room._id]);
            dispatchToastMessage({ type: 'success', message: t('Room_updated_successfully') });
            onClickClose();
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    }));
    const handleSave = (0, fuselage_hooks_1.useEffectEvent)((data) => Promise.all([isDirty && handleUpdateRoomData(data), changeArchiving && handleArchive()].filter(Boolean)));
    const validateName = (name) => __awaiter(void 0, void 0, void 0, function* () {
        if (!name || !isRoomNameDirty)
            return;
        if (roomType === 'discussion')
            return;
        if (teamNameRegex && !(teamNameRegex === null || teamNameRegex === void 0 ? void 0 : teamNameRegex.test(name))) {
            return t('Name_cannot_have_special_characters');
        }
        const { exists } = yield checkTeamNameExists({ roomName: name });
        if (exists) {
            return t('Teams_Errors_Already_exists', { name });
        }
    });
    const formId = (0, fuselage_hooks_1.useUniqueId)();
    const roomNameField = (0, fuselage_hooks_1.useUniqueId)();
    const roomDescriptionField = (0, fuselage_hooks_1.useUniqueId)();
    const roomAnnouncementField = (0, fuselage_hooks_1.useUniqueId)();
    const roomTopicField = (0, fuselage_hooks_1.useUniqueId)();
    const roomTypeField = (0, fuselage_hooks_1.useUniqueId)();
    const readOnlyField = (0, fuselage_hooks_1.useUniqueId)();
    const reactWhenReadOnlyField = (0, fuselage_hooks_1.useUniqueId)();
    const archivedField = (0, fuselage_hooks_1.useUniqueId)();
    const joinCodeRequiredField = (0, fuselage_hooks_1.useUniqueId)();
    const hideSysMesField = (0, fuselage_hooks_1.useUniqueId)();
    const encryptedField = (0, fuselage_hooks_1.useUniqueId)();
    const retentionEnabledField = (0, fuselage_hooks_1.useUniqueId)();
    const retentionOverrideGlobalField = (0, fuselage_hooks_1.useUniqueId)();
    const retentionMaxAgeField = (0, fuselage_hooks_1.useUniqueId)();
    const retentionExcludePinnedField = (0, fuselage_hooks_1.useUniqueId)();
    const retentionFilesOnlyField = (0, fuselage_hooks_1.useUniqueId)();
    const retentionIgnoreThreads = (0, fuselage_hooks_1.useUniqueId)();
    const showDiscussionsField = (0, fuselage_hooks_1.useUniqueId)();
    const showChannelsField = (0, fuselage_hooks_1.useUniqueId)();
    const showAdvancedSettings = canViewEncrypted || canViewReadOnly || readOnly || canViewArchived || canViewJoinCode || canViewHideSysMes;
    const showRetentionPolicy = canEditRoomRetentionPolicy && (retentionPolicy === null || retentionPolicy === void 0 ? void 0 : retentionPolicy.enabled);
    const showAccordion = showAdvancedSettings || showRetentionPolicy;
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarHeader, { children: [onClickBack && (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarBack, { onClick: onClickBack }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarTitle, { children: t(`${title[roomType]}`) }), onClickClose && (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarClose, { onClick: onClickClose })] }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarScrollableContent, { p: 24, children: (0, jsx_runtime_1.jsxs)("form", { id: formId, onSubmit: handleSubmit(handleSave), children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', justifyContent: 'center', children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'roomAvatar', render: ({ field: { onChange, value } }) => (0, jsx_runtime_1.jsx)(RoomAvatarEditor_1.default, { room: room, roomAvatar: value, onChangeAvatar: onChange }) }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: roomNameField, required: true, children: t('Name') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'roomName', control: control, rules: {
                                                    required: t('Required_field', { field: t('Name') }),
                                                    validate: (value) => validateName(value),
                                                }, render: ({ field }) => ((0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: roomNameField }, field, { disabled: !canViewName, "aria-invalid": errors.roomName ? 'true' : 'false', "aria-describedby": `${roomNameField}-error`, "aria-required": 'true' }))) }) }), errors.roomName && (0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { id: `${roomNameField}-error`, children: errors.roomName.message })] }), canViewTopic && ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: roomTopicField, children: t('Topic') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'roomTopic', control: control, render: ({ field }) => (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: roomTopicField, "aria-describedby": `${roomTopicField}-hint` }, field)) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${roomTopicField}-hint`, children: t('Displayed_next_to_name') }) })] })), canViewAnnouncement && ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: roomAnnouncementField, children: t('Announcement') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'roomAnnouncement', control: control, render: ({ field }) => ((0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: roomAnnouncementField, "aria-describedby": `${roomAnnouncementField}-hint` }, field, { disabled: isFederated }))) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${roomAnnouncementField}-hint`, children: t('Information_to_keep_top_of_mind') }) })] })), canViewDescription && ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: roomDescriptionField, children: t('Description') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'roomDescription', control: control, render: ({ field }) => (0, jsx_runtime_1.jsx)(fuselage_1.TextAreaInput, Object.assign({ id: roomDescriptionField }, field, { disabled: isFederated, rows: 4 })) }) })] })), canViewType && ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: roomTypeField, children: t('Private') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'roomType', render: ({ field: { name, onBlur, onChange, value, ref } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, { id: roomTypeField, ref: ref, name: name, onBlur: onBlur, disabled: !canChangeType || isFederated, checked: value === 'p', onChange: () => onChange(value === 'p' ? 'c' : 'p'), "aria-describedby": `${roomTypeField}-hint` })) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${roomTypeField}-hint`, children: roomTypeP === 'p' ? t('Only_invited_people') : t('Anyone_can_access') }) })] }))] }), showAccordion && ((0, jsx_runtime_1.jsxs)(fuselage_1.Accordion, { children: [showAdvancedSettings && ((0, jsx_runtime_1.jsxs)(fuselage_1.AccordionItem, { title: t('Advanced_settings'), children: [roomType === 'team' && ((0, jsx_runtime_1.jsxs)(ui_client_1.FeaturePreview, { feature: 'sidepanelNavigation', children: [(0, jsx_runtime_1.jsx)(ui_client_1.FeaturePreviewOff, { children: null }), (0, jsx_runtime_1.jsxs)(ui_client_1.FeaturePreviewOn, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'h5', fontScale: 'h5', color: 'titles-labels', children: t('Navigation') }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: showChannelsField, children: t('Channels') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'showChannels', render: (_a) => {
                                                                                        var _b = _a.field, { value } = _b, field = __rest(_b, ["value"]);
                                                                                        return ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, Object.assign({ id: showChannelsField, checked: value }, field)));
                                                                                    } })] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${showChannelsField}-hint`, children: t('Show_channels_description') }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: showDiscussionsField, children: t('Discussions') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'showDiscussions', render: (_a) => {
                                                                                        var _b = _a.field, { value } = _b, field = __rest(_b, ["value"]);
                                                                                        return ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, Object.assign({ id: showDiscussionsField, checked: value }, field)));
                                                                                    } })] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${showDiscussionsField}-hint`, children: t('Show_discussions_description') }) })] })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Divider, { mb: 24 })] })] })), (0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'h5', fontScale: 'h5', color: 'titles-labels', children: t('Security_and_permissions') }), canViewEncrypted && ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: encryptedField, children: t('Encrypted') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'encrypted', render: (_a) => {
                                                                        var _b = _a.field, { value } = _b, field = __rest(_b, ["value"]);
                                                                        return ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, Object.assign({ id: encryptedField, "aria-describedby": `${encryptedField}-hint` }, field, { disabled: !canToggleEncryption || isFederated, checked: value })));
                                                                    } })] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${encryptedField}-hint`, children: t('Encrypted_field_hint') }) })] })), canViewReadOnly && ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: readOnlyField, children: t('Read_only') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'readOnly', render: (_a) => {
                                                                        var _b = _a.field, { value } = _b, field = __rest(_b, ["value"]);
                                                                        return ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, Object.assign({ id: readOnlyField }, field, { checked: value, disabled: !canSetReadOnly || isFederated, "aria-describedby": `${readOnlyField}-hint` })));
                                                                    } })] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${readOnlyField}-hint`, children: readOnly ? t('Read_only_field_hint_enabled', { roomType }) : t('Read_only_field_hint_disabled') })] })), readOnly && ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: reactWhenReadOnlyField, children: t('React_when_read_only') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'reactWhenReadOnly', render: (_a) => {
                                                                        var _b = _a.field, { value } = _b, field = __rest(_b, ["value"]);
                                                                        return ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, Object.assign({ id: reactWhenReadOnlyField }, field, { disabled: !canSetReactWhenReadOnly, checked: value, "aria-describedby": `${reactWhenReadOnlyField}-hint` })));
                                                                    } })] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${reactWhenReadOnlyField}-hint`, children: reactWhenReadOnly ? t('Anyone_can_react_to_messages') : t('Only_authorized_users_can_react_to_messages') }) })] })), canViewArchived && ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: archivedField, children: t('Room_archivation_state_true') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'archived', render: (_a) => {
                                                                        var _b = _a.field, { value } = _b, field = __rest(_b, ["value"]);
                                                                        return ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, Object.assign({ id: archivedField, "aria-describedby": `${archivedField}-hint` }, field, { disabled: !canArchiveOrUnarchive, checked: value })));
                                                                    } })] }), archived && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${archivedField}-hint`, children: t('New_messages_cannot_be_sent') }) }))] })), canViewJoinCode && ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: joinCodeRequiredField, children: t('Password_to_access') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'joinCodeRequired', render: (_a) => {
                                                                        var _b = _a.field, { value } = _b, field = __rest(_b, ["value"]);
                                                                        return ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, Object.assign({ id: joinCodeRequiredField }, field, { disabled: isFederated, checked: value })));
                                                                    } })] }), joinCodeRequired && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'joinCode', control: control, render: ({ field }) => ((0, jsx_runtime_1.jsx)(fuselage_1.PasswordInput, Object.assign({}, field, { placeholder: t('Reset_password'), disabled: !joinCodeRequired }))) }) }))] })), canViewHideSysMes && ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: hideSysMesField, children: t('Hide_System_Messages') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'hideSysMes', render: (_a) => {
                                                                        var _b = _a.field, { value } = _b, field = __rest(_b, ["value"]);
                                                                        return ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, Object.assign({ id: hideSysMesField }, field, { checked: value, disabled: isFederated })));
                                                                    } })] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'systemMessages', render: ({ field }) => ((0, jsx_runtime_1.jsx)(fuselage_1.MultiSelect, Object.assign({}, field, { options: sysMesOptions, disabled: !hideSysMes || isFederated, placeholder: t('Select_messages_to_hide') }))) }) })] }))] })] })), showRetentionPolicy && ((0, jsx_runtime_1.jsx)(fuselage_1.AccordionItem, { title: t('Prune'), children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: retentionEnabledField, children: t('RetentionPolicyRoom_Enabled') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'retentionEnabled', render: (_a) => {
                                                                var _b = _a.field, { value } = _b, field = __rest(_b, ["value"]);
                                                                return ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, Object.assign({ id: retentionEnabledField }, field, { checked: value })));
                                                            } })] }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: retentionOverrideGlobalField, children: t('RetentionPolicyRoom_OverrideGlobal') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'retentionOverrideGlobal', render: (_a) => {
                                                                var _b = _a.field, { value } = _b, field = __rest(_b, ["value"]);
                                                                return ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, Object.assign({ id: retentionOverrideGlobalField }, field, { disabled: !retentionEnabled, checked: value })));
                                                            } })] }) }), retentionOverrideGlobal && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Callout, { type: 'danger', children: (0, jsx_runtime_1.jsx)(RawText_1.default, { children: t('RetentionPolicyRoom_ReadTheDocs') }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: retentionMaxAgeField, children: t('RetentionPolicyRoom_MaxAge', { max: retentionMaxAgeDefault }) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'retentionMaxAge', render: (_a) => {
                                                                        var _b = _a.field, { onChange } = _b, field = __rest(_b, ["onChange"]);
                                                                        return ((0, jsx_runtime_1.jsx)(fuselage_1.NumberInput, Object.assign({ id: retentionMaxAgeField }, field, { onChange: (e) => onChange(Number(e.currentTarget.value)) })));
                                                                    } }) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: retentionExcludePinnedField, children: t('RetentionPolicyRoom_ExcludePinned') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'retentionExcludePinned', render: (_a) => {
                                                                        var _b = _a.field, { value } = _b, field = __rest(_b, ["value"]);
                                                                        return ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, Object.assign({ id: retentionExcludePinnedField }, field, { checked: value })));
                                                                    } })] }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: retentionFilesOnlyField, children: t('RetentionPolicyRoom_FilesOnly') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'retentionFilesOnly', render: (_a) => {
                                                                        var _b = _a.field, { value } = _b, field = __rest(_b, ["value"]);
                                                                        return ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, Object.assign({ id: retentionFilesOnlyField }, field, { checked: value })));
                                                                    } })] }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: retentionIgnoreThreads, children: t('RetentionPolicy_DoNotPruneThreads') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'retentionIgnoreThreads', render: (_a) => {
                                                                        var _b = _a.field, { value } = _b, field = __rest(_b, ["value"]);
                                                                        return ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, Object.assign({ id: retentionIgnoreThreads }, field, { checked: value })));
                                                                    } })] }) })] }))] }) }))] }))] }) }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarFooter, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { stretch: true, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { type: 'reset', disabled: !isDirty || isSubmitting, onClick: () => reset(defaultValues), children: t('Reset') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { form: formId, type: 'submit', primary: true, loading: isSubmitting, disabled: !isDirty, children: t('Save') })] }) })] }));
};
exports.default = EditRoomInfo;
