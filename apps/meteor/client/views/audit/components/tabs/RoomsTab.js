"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importDefault(require("react"));
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const RoomAutoComplete_1 = __importDefault(require("../../../../components/RoomAutoComplete"));
const RoomsTab = ({ form: { control }, setSelectedRoom }) => {
    var _a, _b;
    const { t } = (0, react_i18next_1.useTranslation)();
    const { field: ridField, fieldState: ridFieldState } = (0, react_hook_form_1.useController)({ name: 'rid', control, rules: { required: true } });
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { flexShrink: 1, children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Channel_name') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(RoomAutoComplete_1.default, { scope: 'admin', setSelectedRoom: setSelectedRoom, value: ridField.value, error: !!ridFieldState.error, placeholder: t('Channel_Name_Placeholder'), onChange: ridField.onChange, renderRoomIcon: ({ encrypted }) => encrypted ? (0, jsx_runtime_1.jsx)(fuselage_1.Icon, { name: 'key', color: 'danger', title: t('Encrypted_content_will_not_appear_search') }) : null }) }), ((_a = ridFieldState.error) === null || _a === void 0 ? void 0 : _a.type) === 'required' && (0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { children: t('Required_field', { field: t('Channel_name') }) }), ((_b = ridFieldState.error) === null || _b === void 0 ? void 0 : _b.type) === 'validate' && (0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { children: ridFieldState.error.message })] }));
};
exports.default = RoomsTab;
