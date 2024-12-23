"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importDefault(require("react"));
const react_hook_form_1 = require("react-hook-form");
const PreferencesSoundSection = () => {
    var _a;
    const t = (0, ui_contexts_1.useTranslation)();
    const customSound = (0, ui_contexts_1.useCustomSound)();
    const soundsList = ((_a = customSound === null || customSound === void 0 ? void 0 : customSound.getList()) === null || _a === void 0 ? void 0 : _a.map((value) => [value._id, value.name])) || [];
    const { control, watch } = (0, react_hook_form_1.useFormContext)();
    const { newMessageNotification, notificationsSoundVolume = 100, masterVolume = 100, voipRingerVolume = 100 } = watch();
    const newRoomNotificationId = (0, fuselage_hooks_1.useUniqueId)();
    const newMessageNotificationId = (0, fuselage_hooks_1.useUniqueId)();
    const muteFocusedConversationsId = (0, fuselage_hooks_1.useUniqueId)();
    const masterVolumeId = (0, fuselage_hooks_1.useUniqueId)();
    const notificationsSoundVolumeId = (0, fuselage_hooks_1.useUniqueId)();
    const voipRingerVolumeId = (0, fuselage_hooks_1.useUniqueId)();
    return ((0, jsx_runtime_1.jsx)(fuselage_1.Accordion.Item, { title: t('Sound'), children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { "aria-describedby": `${masterVolumeId}-hint`, children: t('Master_volume') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${masterVolumeId}-hint`, mbe: 4, children: t('Master_volume_hint') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'masterVolume', control: control, render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.Slider, { "aria-labelledby": masterVolumeId, "aria-describedby": `${masterVolumeId}-hint`, value: value, minValue: 0, maxValue: 100, onChange: onChange })) }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { id: notificationsSoundVolumeId, children: t('Notification_volume') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${notificationsSoundVolumeId}-hint`, mbe: 4, children: t('Notification_volume_hint') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'notificationsSoundVolume', control: control, render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.Slider, { "aria-labelledby": notificationsSoundVolumeId, "aria-describedby": `${notificationsSoundVolumeId}-hint`, value: value, minValue: 0, maxValue: 100, onChange: (value) => {
                                        const soundVolume = (notificationsSoundVolume * masterVolume) / 100;
                                        customSound.play(newMessageNotification, { volume: soundVolume / 100 });
                                        onChange(value);
                                    } })) }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { "aria-describedby": `${voipRingerVolumeId}-hint`, children: t('Call_ringer_volume') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${voipRingerVolumeId}-hint`, mbe: 4, children: t('Call_ringer_volume_hint') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'voipRingerVolume', control: control, render: ({ field: { onChange, value } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.Slider, { "aria-labelledby": voipRingerVolumeId, "aria-describedby": `${voipRingerVolumeId}-hint`, value: value, minValue: 0, maxValue: 100, onChange: (value) => {
                                        const soundVolume = (voipRingerVolume * masterVolume) / 100;
                                        customSound.play('telephone', { volume: soundVolume / 100 });
                                        onChange(value);
                                    } })) }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: newRoomNotificationId, children: t('New_Room_Notification') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'newRoomNotification', control: control, render: ({ field: { value, onChange } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.Select, { id: newRoomNotificationId, value: value, options: soundsList, onChange: (value) => {
                                        onChange(value);
                                        customSound.play(String(value), { volume: notificationsSoundVolume / 100 });
                                    } })) }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: newMessageNotificationId, children: t('New_Message_Notification') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'newMessageNotification', control: control, render: ({ field: { value, onChange } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.Select, { id: newMessageNotificationId, value: value, options: soundsList, onChange: (value) => {
                                        onChange(value);
                                        customSound.play(String(value), { volume: notificationsSoundVolume / 100 });
                                    } })) }) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: muteFocusedConversationsId, children: t('Mute_Focused_Conversations') }), (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'muteFocusedConversations', control: control, render: ({ field: { ref, value, onChange } }) => ((0, jsx_runtime_1.jsx)(fuselage_1.ToggleSwitch, { id: muteFocusedConversationsId, ref: ref, checked: value, onChange: onChange })) })] }) })] }) }));
};
exports.default = PreferencesSoundSection;
