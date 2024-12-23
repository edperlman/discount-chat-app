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
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const useEditAdminRoomPermissions_1 = require("./useEditAdminRoomPermissions");
const Contextualbar_1 = require("../../../components/Contextualbar");
const RoomAvatarEditor_1 = __importDefault(require("../../../components/avatar/RoomAvatarEditor"));
const getDirtyFields_1 = require("../../../lib/getDirtyFields");
const roomCoordinator_1 = require("../../../lib/rooms/roomCoordinator");
const useArchiveRoom_1 = require("../../hooks/roomActions/useArchiveRoom");
const useDeleteRoom_1 = require("../../hooks/roomActions/useDeleteRoom");
const getInitialValues = (room) => {
    var _a, _b, _c, _d;
    return ({
        roomName: room.t === 'd' ? (_a = room.usernames) === null || _a === void 0 ? void 0 : _a.join(' x ') : roomCoordinator_1.roomCoordinator.getRoomName(room.t, room),
        roomType: room.t,
        readOnly: !!room.ro,
        archived: !!room.archived,
        isDefault: !!room.default,
        favorite: !!room.favorite,
        featured: !!room.featured,
        reactWhenReadOnly: !!room.reactWhenReadOnly,
        roomTopic: (_b = room.topic) !== null && _b !== void 0 ? _b : '',
        roomDescription: (_c = room.description) !== null && _c !== void 0 ? _c : '',
        roomAnnouncement: (_d = room.announcement) !== null && _d !== void 0 ? _d : '',
        roomAvatar: undefined,
    });
};
const EditRoom = ({ room, onChange, onDelete }) => {
    var _a;
    const { t } = (0, react_i18next_1.useTranslation)();
    const router = (0, ui_contexts_1.useRouter)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const { control, watch, reset, handleSubmit, formState: { isDirty, errors, dirtyFields }, } = (0, react_hook_form_1.useForm)({ values: getInitialValues(room) });
    const { canViewName, canViewTopic, canViewAnnouncement, canViewArchived, canViewDescription, canViewType, canViewReadOnly, canViewReactWhenReadOnly, } = (0, useEditAdminRoomPermissions_1.useEditAdminRoomPermissions)(room);
    const { roomType, readOnly, archived, isDefault } = watch();
    const changeArchiving = archived !== !!room.archived;
    const { handleDelete, canDeleteRoom, isDeleting } = (0, useDeleteRoom_1.useDeleteRoom)(room, { reload: onDelete });
    const saveAction = (0, ui_contexts_1.useEndpoint)('POST', '/v1/rooms.saveRoomSettings');
    const handleArchive = (0, useArchiveRoom_1.useArchiveRoom)(room);
    const handleUpdateRoomData = (0, fuselage_hooks_1.useEffectEvent)((_a) => __awaiter(void 0, void 0, void 0, function* () {
        var { isDefault, favorite } = _a, formData = __rest(_a, ["isDefault", "favorite"]);
        const data = (0, getDirtyFields_1.getDirtyFields)(formData, dirtyFields);
        delete data.archived;
        delete data.favorite;
        try {
            yield saveAction(Object.assign({ rid: room._id, default: isDefault, favorite: { defaultValue: isDefault, favorite } }, data));
            dispatchToastMessage({ type: 'success', message: t('Room_updated_successfully') });
            onChange();
            router.navigate('/admin/rooms');
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    }));
    const handleSave = (0, fuselage_hooks_1.useEffectEvent)((data) => Promise.all([isDirty && handleUpdateRoomData(data), changeArchiving && handleArchive()].filter(Boolean)));
    const formId = (0, fuselage_hooks_1.useUniqueId)();
    const roomNameField = (0, fuselage_hooks_1.useUniqueId)();
    const ownerField = (0, fuselage_hooks_1.useUniqueId)();
    const roomDescription = (0, fuselage_hooks_1.useUniqueId)();
    const roomAnnouncement = (0, fuselage_hooks_1.useUniqueId)();
    const roomTopicField = (0, fuselage_hooks_1.useUniqueId)();
    const roomTypeField = (0, fuselage_hooks_1.useUniqueId)();
    const readOnlyField = (0, fuselage_hooks_1.useUniqueId)();
    const reactWhenReadOnly = (0, fuselage_hooks_1.useUniqueId)();
    const archivedField = (0, fuselage_hooks_1.useUniqueId)();
    const isDefaultField = (0, fuselage_hooks_1.useUniqueId)();
    const favoriteField = (0, fuselage_hooks_1.useUniqueId)();
    const featuredField = (0, fuselage_hooks_1.useUniqueId)();
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarScrollableContent, { id: formId, is: 'form', onSubmit: handleSubmit(handleSave), children: [room.t !== 'd' && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { pbe: 24, display: 'flex', justifyContent: 'center', children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'roomAvatar', control: control, render: ({ field: { value, onChange } }) => ((0, jsx_runtime_1.jsx)(RoomAvatarEditor_1.default, { disabled: (0, core_typings_1.isRoomFederated)(room), roomAvatar: value, room: room, onChangeAvatar: onChange })) }) })), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: roomNameField, required: true, children: t('Name') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'roomName', rules: { required: t('Required_field', { field: t('Name') }) }, control: control, render: ({ field }) => ((0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: roomNameField }, field, { disabled: isDeleting || !canViewName, "aria-required": true, "aria-invalid": Boolean(errors === null || errors === void 0 ? void 0 : errors.roomName), "aria-describedby": `${roomNameField}-error` }))) }) }), (errors === null || errors === void 0 ? void 0 : errors.roomName) && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${roomNameField}-error`, children: errors.roomName.message }))] }), room.t !== 'd' && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [room.u && ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: ownerField, children: t('Owner') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, { id: ownerField, name: 'roomOwner', readOnly: true, value: (_a = room.u) === null || _a === void 0 ? void 0 : _a.username }) })] })), canViewDescription && ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: roomDescription, children: t('Description') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'roomDescription', control: control, render: ({ field }) => ((0, jsx_runtime_1.jsx)(fuselage_1.TextAreaInput, Object.assign({ id: roomDescription }, field, { rows: 4, disabled: isDeleting || (0, core_typings_1.isRoomFederated)(room) }))) }) })] })), canViewAnnouncement && ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: roomAnnouncement, children: t('Announcement') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'roomAnnouncement', control: control, render: ({ field }) => ((0, jsx_runtime_1.jsx)(fuselage_1.TextAreaInput, Object.assign({ id: roomAnnouncement }, field, { rows: 4, disabled: isDeleting || (0, core_typings_1.isRoomFederated)(room) }))) }) })] })), canViewTopic && ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: roomTopicField, children: t('Topic') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'roomTopic', control: control, render: ({ field }) => (0, jsx_runtime_1.jsx)(fuselage_1.TextAreaInput, Object.assign({ id: roomTopicField }, field, { rows: 4, disabled: isDeleting })) }) })] })), canViewType && ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: roomTypeField, children: t('Private') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'roomType', control: control, render: (_a) => {
                                                    var _b = _a.field, { value, onChange } = _b, field = __rest(_b, ["value", "onChange"]);
                                                    return ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, Object.assign({}, field, { id: roomTypeField, disabled: isDeleting || (0, core_typings_1.isRoomFederated)(room), checked: roomType === 'p', onChange: () => onChange(value === 'p' ? 'c' : 'p'), "aria-describedby": `${roomTypeField}-hint` })));
                                                } })] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${roomTypeField}-hint`, children: t('Just_invited_people_can_access_this_channel') })] })), canViewReadOnly && ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: readOnlyField, children: t('Read_only') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'readOnly', control: control, render: (_a) => {
                                                    var _b = _a.field, { value } = _b, field = __rest(_b, ["value"]);
                                                    return ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, Object.assign({ id: readOnlyField }, field, { disabled: isDeleting || (0, core_typings_1.isRoomFederated)(room), checked: value, "aria-describedby": `${readOnlyField}-hint` })));
                                                } })] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${readOnlyField}-hint`, children: t('Only_authorized_users_can_write_new_messages') })] })), canViewReactWhenReadOnly && readOnly && ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: reactWhenReadOnly, children: t('React_when_read_only') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'reactWhenReadOnly', control: control, render: (_a) => {
                                                    var _b = _a.field, { value } = _b, field = __rest(_b, ["value"]);
                                                    return ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, Object.assign({ id: reactWhenReadOnly }, field, { checked: value || (0, core_typings_1.isRoomFederated)(room), "aria-describedby": `${reactWhenReadOnly}-hint` })));
                                                } })] }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${reactWhenReadOnly}-hint`, children: t('React_when_read_only_changed_successfully') })] })), canViewArchived && ((0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: archivedField, children: t('Room_archivation_state_true') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'archived', control: control, render: (_a) => {
                                                var _b = _a.field, { value } = _b, field = __rest(_b, ["value"]);
                                                return ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, Object.assign({ id: archivedField }, field, { disabled: isDeleting || (0, core_typings_1.isRoomFederated)(room), checked: value })));
                                            } })] }) }))] })), (0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: isDefaultField, children: t('Default') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'isDefault', control: control, render: (_a) => {
                                        var _b = _a.field, { value } = _b, field = __rest(_b, ["value"]);
                                        return ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, Object.assign({ id: isDefaultField }, field, { disabled: isDeleting || (0, core_typings_1.isRoomFederated)(room), checked: value })));
                                    } })] }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: favoriteField, children: t('Favorite') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'favorite', control: control, render: (_a) => {
                                        var _b = _a.field, { value } = _b, field = __rest(_b, ["value"]);
                                        return ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, Object.assign({ id: favoriteField }, field, { disabled: isDeleting || !isDefault, checked: value })));
                                    } })] }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: featuredField, children: t('Featured') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'featured', control: control, render: (_a) => {
                                        var _b = _a.field, { value } = _b, field = __rest(_b, ["value"]);
                                        return ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, Object.assign({ id: featuredField }, field, { disabled: isDeleting || (0, core_typings_1.isRoomFederated)(room), checked: value })));
                                    } })] }) })] }), (0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarFooter, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { stretch: true, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { type: 'reset', disabled: !isDirty || isDeleting, onClick: () => reset(), children: t('Reset') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { form: formId, type: 'submit', disabled: !isDirty || isDeleting, children: t('Save') })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbs: 8, children: (0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, { stretch: true, children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { icon: 'trash', danger: true, loading: isDeleting, disabled: !canDeleteRoom || (0, core_typings_1.isRoomFederated)(room), onClick: handleDelete, children: t('Delete') }) }) })] })] }));
};
exports.default = EditRoom;
