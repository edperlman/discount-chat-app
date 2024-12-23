"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const react_1 = __importDefault(require("react"));
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const PruneMessagesDateTimeRow_1 = __importDefault(require("./PruneMessagesDateTimeRow"));
const Contextualbar_1 = require("../../../../components/Contextualbar");
const UserAutoCompleteMultiple_1 = __importDefault(require("../../../../components/UserAutoCompleteMultiple"));
const PruneMessages = ({ callOutText, validateText, onClickClose, onClickPrune }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { control, register } = (0, react_hook_form_1.useFormContext)();
    const inclusiveCheckboxId = (0, fuselage_hooks_1.useUniqueId)();
    const pinnedCheckboxId = (0, fuselage_hooks_1.useUniqueId)();
    const discussionCheckboxId = (0, fuselage_hooks_1.useUniqueId)();
    const threadsCheckboxId = (0, fuselage_hooks_1.useUniqueId)();
    const attachedCheckboxId = (0, fuselage_hooks_1.useUniqueId)();
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarHeader, { children: [(0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarIcon, { name: 'eraser' }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarTitle, { children: t('Prune_Messages') }), onClickClose && (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarClose, { onClick: onClickClose })] }), (0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarScrollableContent, { children: [(0, jsx_runtime_1.jsx)(PruneMessagesDateTimeRow_1.default, { label: t('Newer_than'), field: 'newer' }), (0, jsx_runtime_1.jsx)(PruneMessagesDateTimeRow_1.default, { label: t('Older_than'), field: 'older' }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { flexGrow: 0, children: t('Only_from_users') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'users', render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsx)(UserAutoCompleteMultiple_1.default, { value: value, onChange: onChange, placeholder: t('Please_enter_usernames') })) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: inclusiveCheckboxId, children: t('Inclusive') }), (0, jsx_runtime_1.jsx)(fuselage_1.CheckBox, Object.assign({ id: inclusiveCheckboxId }, register('inclusive')))] }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: pinnedCheckboxId, children: t('RetentionPolicy_DoNotPrunePinned') }), (0, jsx_runtime_1.jsx)(fuselage_1.CheckBox, Object.assign({ id: pinnedCheckboxId }, register('pinned')))] }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: discussionCheckboxId, children: t('RetentionPolicy_DoNotPruneDiscussion') }), (0, jsx_runtime_1.jsx)(fuselage_1.CheckBox, Object.assign({ id: discussionCheckboxId }, register('discussion')))] }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: threadsCheckboxId, children: t('RetentionPolicy_DoNotPruneThreads') }), (0, jsx_runtime_1.jsx)(fuselage_1.CheckBox, Object.assign({ id: threadsCheckboxId }, register('threads')))] }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: attachedCheckboxId, children: t('Files_only') }), (0, jsx_runtime_1.jsx)(fuselage_1.CheckBox, Object.assign({ id: attachedCheckboxId }, register('attached')))] }) }), callOutText && !validateText && (0, jsx_runtime_1.jsx)(fuselage_1.Callout, { type: 'warning', children: callOutText }), validateText && (0, jsx_runtime_1.jsx)(fuselage_1.Callout, { type: 'warning', children: validateText })] }), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarFooter, { children: (0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, { stretch: true, children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { danger: true, disabled: Boolean(validateText), onClick: onClickPrune, children: t('Prune') }) }) })] }));
};
exports.default = PruneMessages;
