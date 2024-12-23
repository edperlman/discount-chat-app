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
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const Contextualbar_1 = require("../../../components/Contextualbar");
const useEndpointUpload_1 = require("../../../hooks/useEndpointUpload");
const useSingleFileInput_1 = require("../../../hooks/useSingleFileInput");
const AddCustomEmoji = (_a) => {
    var { close, onChange } = _a, props = __rest(_a, ["close", "onChange"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const [name, setName] = (0, react_1.useState)('');
    const [aliases, setAliases] = (0, react_1.useState)('');
    const [emojiFile, setEmojiFile] = (0, react_1.useState)();
    const [newEmojiPreview, setNewEmojiPreview] = (0, react_1.useState)('');
    const [errors, setErrors] = (0, react_1.useState)({ name: false, emoji: false, aliases: false });
    const setEmojiPreview = (0, react_1.useCallback)((file) => __awaiter(void 0, void 0, void 0, function* () {
        setEmojiFile(file);
        setNewEmojiPreview(URL.createObjectURL(file));
        setErrors((prevState) => (Object.assign(Object.assign({}, prevState), { emoji: false })));
    }), [setEmojiFile]);
    const saveAction = (0, useEndpointUpload_1.useEndpointUpload)('/v1/emoji-custom.create', t('Custom_Emoji_Added_Successfully'));
    const handleSave = (0, react_1.useCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        if (!name) {
            return setErrors((prevState) => (Object.assign(Object.assign({}, prevState), { name: true })));
        }
        if (name === aliases) {
            return setErrors((prevState) => (Object.assign(Object.assign({}, prevState), { aliases: true })));
        }
        if (!emojiFile) {
            return setErrors((prevState) => (Object.assign(Object.assign({}, prevState), { emoji: true })));
        }
        const formData = new FormData();
        formData.append('emoji', emojiFile);
        formData.append('name', name);
        formData.append('aliases', aliases);
        const result = (yield saveAction(formData));
        if (result.success) {
            onChange();
            close();
        }
    }), [emojiFile, name, aliases, saveAction, onChange, close]);
    const [clickUpload] = (0, useSingleFileInput_1.useSingleFileInput)(setEmojiPreview, 'emoji');
    const handleChangeName = (e) => {
        if (e.currentTarget.value !== '') {
            setErrors((prevState) => (Object.assign(Object.assign({}, prevState), { name: false })));
        }
        return setName(e.currentTarget.value);
    };
    const handleChangeAliases = (e) => {
        if (e.currentTarget.value !== name) {
            setErrors((prevState) => (Object.assign(Object.assign({}, prevState), { aliases: false })));
        }
        return setAliases(e.currentTarget.value);
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarScrollableContent, Object.assign({}, props, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Name') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, { value: name, onChange: handleChangeName, placeholder: t('Name') }) }), errors.name && (0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { children: t('Required_field', { field: t('Name') }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Aliases') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, { value: aliases, onChange: handleChangeAliases, placeholder: t('Aliases') }) }), errors.aliases && (0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { children: t('Custom_Emoji_Error_Same_Name_And_Alias') })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldLabel, { alignSelf: 'stretch', display: 'flex', justifyContent: 'space-between', alignItems: 'center', children: [t('Custom_Emoji'), (0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { secondary: true, small: true, icon: 'upload', onClick: clickUpload })] }), errors.emoji && (0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { children: t('Required_field', { field: t('Custom_Emoji') }) }), newEmojiPreview && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', mi: 'neg-x4', justifyContent: 'center', children: (0, jsx_runtime_1.jsx)(fuselage_1.Margins, { inline: 4, children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'img', style: { objectFit: 'contain' }, w: 'x120', h: 'x120', src: newEmojiPreview }) }) }))] })] })), (0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarFooter, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { stretch: true, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: close, children: t('Cancel') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, onClick: handleSave, children: t('Save') })] }) })] }));
};
exports.default = AddCustomEmoji;
