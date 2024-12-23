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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const ResetSettingButton_1 = __importDefault(require("../ResetSettingButton"));
function ColorSettingInput({ _id, label, value, editor, allowedTypes = [], placeholder, readonly, autocomplete, disabled, required, hasResetButton, onChangeValue, onChangeEditor, onResetButtonClick, }) {
    const { t } = (0, react_i18next_1.useTranslation)();
    const handleChange = (0, react_1.useCallback)((event) => {
        onChangeValue === null || onChangeValue === void 0 ? void 0 : onChangeValue(event.currentTarget.value);
    }, [onChangeValue]);
    const handleEditorTypeChange = (0, react_1.useCallback)((value) => {
        onChangeEditor === null || onChangeEditor === void 0 ? void 0 : onChangeEditor(value);
    }, [onChangeEditor]);
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldRow, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: _id, title: _id, required: required, children: label }), hasResetButton && (0, jsx_runtime_1.jsx)(ResetSettingButton_1.default, { "data-qa-reset-setting-id": _id, onClick: onResetButtonClick })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Margins, { inline: 4, children: (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Margins, { inline: 4, children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Flex.Item, { grow: 2, children: [editor === 'color' && ((0, jsx_runtime_1.jsx)(fuselage_1.InputBox, { "data-qa-setting-id": _id, type: 'color', id: _id, value: value, placeholder: placeholder, disabled: disabled, readOnly: readonly, autoComplete: autocomplete === false ? 'off' : undefined, onChange: handleChange })), editor === 'expression' && ((0, jsx_runtime_1.jsx)(fuselage_1.TextInput, { "data-qa-setting-id": _id, id: _id, value: value, placeholder: placeholder, disabled: disabled, readOnly: readonly, autoComplete: autocomplete === false ? 'off' : undefined, onChange: handleChange }))] }), (0, jsx_runtime_1.jsx)(fuselage_1.Select, { "data-qa-setting-id": `${_id}_editor`, type: 'color', id: `${_id}_editor`, value: editor, disabled: disabled, readOnly: readonly, autoComplete: autocomplete === false ? 'off' : undefined, onChange: handleEditorTypeChange, options: allowedTypes.map((type) => [type, t(type)]) })] }) }) }), (0, jsx_runtime_1.jsxs)(fuselage_1.FieldHint, { children: ["Variable name: ", _id.replace(/theme-color-/, '@')] })] }));
}
exports.default = ColorSettingInput;
