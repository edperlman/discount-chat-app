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
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importDefault(require("react"));
const react_hook_form_1 = require("react-hook-form");
const goToRoomById_1 = require("../../lib/utils/goToRoomById");
const RoomAutoComplete_1 = __importDefault(require("../RoomAutoComplete"));
const UserAutoCompleteMultiple_1 = __importDefault(require("../UserAutoCompleteMultiple"));
const DefaultParentRoomField_1 = __importDefault(require("./DefaultParentRoomField"));
const CreateDiscussion = ({ onClose, defaultParentRoom, parentMessageId, nameSuggestion }) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const { formState: { errors }, handleSubmit, control, watch, } = (0, react_hook_form_1.useForm)({
        mode: 'onBlur',
        defaultValues: {
            name: nameSuggestion || '',
            parentRoom: '',
            encrypted: false,
            usernames: [],
            firstMessage: '',
            topic: '',
        },
    });
    const { encrypted } = watch();
    const createDiscussion = (0, ui_contexts_1.useEndpoint)('POST', '/v1/rooms.createDiscussion');
    const createDiscussionMutation = (0, react_query_1.useMutation)({
        mutationFn: createDiscussion,
        onSuccess: ({ discussion }) => {
            (0, goToRoomById_1.goToRoomById)(discussion._id);
            onClose();
        },
    });
    const handleCreate = (_a) => __awaiter(void 0, [_a], void 0, function* ({ name, parentRoom, encrypted, usernames, firstMessage, topic }) {
        createDiscussionMutation.mutate(Object.assign({ prid: defaultParentRoom || parentRoom, t_name: name, users: usernames, reply: encrypted ? undefined : firstMessage, topic }, (parentMessageId && { pmid: parentMessageId })));
    });
    const parentRoomId = (0, fuselage_hooks_1.useUniqueId)();
    const encryptedId = (0, fuselage_hooks_1.useUniqueId)();
    const discussionNameId = (0, fuselage_hooks_1.useUniqueId)();
    const membersId = (0, fuselage_hooks_1.useUniqueId)();
    const firstMessageId = (0, fuselage_hooks_1.useUniqueId)();
    const topicId = (0, fuselage_hooks_1.useUniqueId)();
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Modal, { "data-qa": 'create-discussion-modal', wrapperFunction: (props) => (0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ is: 'form', onSubmit: handleSubmit(handleCreate) }, props)), children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Header, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Modal.Title, { children: t('Discussion_title') }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Close, { tabIndex: -1, onClick: onClose })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Content, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbe: 24, children: t('Discussion_description') }), (0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: parentRoomId, required: true, children: t('Discussion_target_channel') }), (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [defaultParentRoom && ((0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'parentRoom', render: () => (0, jsx_runtime_1.jsx)(DefaultParentRoomField_1.default, { defaultParentRoom: defaultParentRoom }) })), !defaultParentRoom && ((0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'parentRoom', rules: { required: t('Required_field', { field: t('Discussion_target_channel') }) }, render: ({ field: { name, onBlur, onChange, value } }) => ((0, jsx_runtime_1.jsx)(RoomAutoComplete_1.default, { name: name, onBlur: onBlur, onChange: onChange, value: value, id: parentRoomId, placeholder: t('Search_options'), disabled: Boolean(defaultParentRoom), "aria-invalid": Boolean(errors.parentRoom), "aria-required": 'true', "aria-describedby": `${parentRoomId}-error` })) }))] }), errors.parentRoom && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${parentRoomId}-error`, children: errors.parentRoom.message }))] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: discussionNameId, required: true, children: t('Name') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'name', control: control, rules: { required: t('Required_field', { field: t('Name') }) }, render: ({ field }) => ((0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: discussionNameId }, field, { "aria-invalid": Boolean(errors.name), "aria-required": 'true', "aria-describedby": `${discussionNameId}-error ${discussionNameId}-hint`, addon: (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'baloons', size: 'x20' }) }))) }) }), errors.name && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${discussionNameId}-error`, children: errors.name.message }))] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: topicId, children: t('Topic') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'topic', control: control, render: ({ field }) => (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({ id: topicId }, field, { "aria-describedby": `${topicId}-hint` })) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${topicId}-hint`, children: t('Displayed_next_to_name') }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: membersId, children: t('Members') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'usernames', render: ({ field: { name, onChange, value, onBlur } }) => ((0, jsx_runtime_1.jsx)(UserAutoCompleteMultiple_1.default, { id: membersId, name: name, onChange: onChange, value: value, onBlur: onBlur, placeholder: t('Add_people') })) }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: firstMessageId, children: t('Discussion_first_message_title') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'firstMessage', render: ({ field }) => ((0, jsx_runtime_1.jsx)(fuselage_1.TextAreaInput, Object.assign({ id: firstMessageId }, field, { rows: 5, disabled: encrypted, "aria-describedby": `${firstMessageId}-hint ${firstMessageId}-encrypted-hint` }))) }) }), encrypted ? ((0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${firstMessageId}-encrypted-hint`, children: t('Discussion_first_message_disabled_due_to_e2e') })) : ((0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${firstMessageId}-hint`, children: t('First_message_hint') }))] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: encryptedId, children: t('Encrypted') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'encrypted', render: (_a) => {
                                                    var _b = _a.field, { value } = _b, field = __rest(_b, ["value"]);
                                                    return (0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, Object.assign({ id: encryptedId }, field, { checked: value }));
                                                } })] }), encrypted ? ((0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${encryptedId}-hint`, children: t('Encrypted_messages', { roomType: 'discussion' }) })) : ((0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${encryptedId}-hint`, children: t('Encrypted_messages_false') }))] })] })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Footer, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Modal.FooterControllers, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: onClose, children: t('Cancel') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { type: 'submit', primary: true, loading: createDiscussionMutation.isLoading, children: t('Create') })] }) })] }));
};
exports.default = CreateDiscussion;
