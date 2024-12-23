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
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const Contextualbar_1 = require("../../../components/Contextualbar");
const GenericModal_1 = __importDefault(require("../../../components/GenericModal"));
const useEndpointAction_1 = require("../../../hooks/useEndpointAction");
const useEndpointUpload_1 = require("../../../hooks/useEndpointUpload");
const useSingleFileInput_1 = require("../../../hooks/useSingleFileInput");
const EditCustomEmoji = (_a) => {
    var { close, onChange, data } = _a, props = __rest(_a, ["close", "onChange", "data"]);
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const absoluteUrl = (0, ui_contexts_1.useAbsoluteUrl)();
    const [errors, setErrors] = (0, react_1.useState)({ name: false, aliases: false });
    const { _id, name: previousName, aliases: previousAliases } = data || {};
    const [name, setName] = (0, react_1.useState)(() => { var _a; return (_a = data === null || data === void 0 ? void 0 : data.name) !== null && _a !== void 0 ? _a : ''; });
    const [aliases, setAliases] = (0, react_1.useState)(() => { var _a, _b; return (_b = (_a = data === null || data === void 0 ? void 0 : data.aliases) === null || _a === void 0 ? void 0 : _a.join(', ')) !== null && _b !== void 0 ? _b : ''; });
    const [emojiFile, setEmojiFile] = (0, react_1.useState)();
    const newEmojiPreview = (0, react_1.useMemo)(() => {
        if (emojiFile) {
            return URL.createObjectURL(emojiFile);
        }
        if (data) {
            return absoluteUrl(`/emoji-custom/${encodeURIComponent(data.name)}.${data.extension}${data.etag ? `?etag=${data.etag}` : ''}`);
        }
        return null;
    }, [absoluteUrl, data, emojiFile]);
    (0, react_1.useEffect)(() => {
        setName(previousName || '');
        setAliases((previousAliases === null || previousAliases === void 0 ? void 0 : previousAliases.join(', ')) || '');
    }, [previousName, previousAliases, _id]);
    const hasUnsavedChanges = (0, react_1.useMemo)(() => previousName !== name || aliases !== previousAliases.join(', ') || !!emojiFile, [previousName, name, aliases, previousAliases, emojiFile]);
    const saveAction = (0, useEndpointUpload_1.useEndpointUpload)('/v1/emoji-custom.update', t('Custom_Emoji_Updated_Successfully'));
    const handleSave = (0, react_1.useCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        if (!name) {
            return setErrors((prevState) => (Object.assign(Object.assign({}, prevState), { name: true })));
        }
        if (name === aliases) {
            return setErrors((prevState) => (Object.assign(Object.assign({}, prevState), { aliases: true })));
        }
        if (!emojiFile && !newEmojiPreview) {
            return;
        }
        const formData = new FormData();
        emojiFile && formData.append('emoji', emojiFile);
        formData.append('_id', _id);
        formData.append('name', name);
        formData.append('aliases', aliases);
        const result = (yield saveAction(formData));
        if (result.success) {
            onChange();
            close();
        }
    }), [emojiFile, _id, name, aliases, saveAction, onChange, close, newEmojiPreview]);
    const deleteAction = (0, useEndpointAction_1.useEndpointAction)('POST', '/v1/emoji-custom.delete');
    const handleDeleteButtonClick = (0, react_1.useCallback)(() => {
        const handleDelete = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield deleteAction({ emojiId: _id });
                dispatchToastMessage({ type: 'success', message: t('Custom_Emoji_Has_Been_Deleted') });
            }
            catch (error) {
                dispatchToastMessage({ type: 'error', message: error });
            }
            finally {
                onChange();
                setModal(null);
                close();
            }
        });
        const handleCancel = () => {
            setModal(null);
        };
        setModal(() => ((0, jsx_runtime_1.jsx)(GenericModal_1.default, { variant: 'danger', onConfirm: handleDelete, onCancel: handleCancel, onClose: handleCancel, confirmText: t('Delete'), children: t('Custom_Emoji_Delete_Warning') })));
    }, [setModal, deleteAction, _id, dispatchToastMessage, t, onChange, close]);
    const handleChangeAliases = (0, react_1.useCallback)((e) => {
        if (e.currentTarget.value !== name) {
            setErrors((prevState) => (Object.assign(Object.assign({}, prevState), { aliases: false })));
        }
        return setAliases(e.currentTarget.value);
    }, [setAliases, name]);
    const [clickUpload] = (0, useSingleFileInput_1.useSingleFileInput)(setEmojiFile, 'emoji');
    const handleChangeName = (e) => {
        if (e.currentTarget.value !== '') {
            setErrors((prevState) => (Object.assign(Object.assign({}, prevState), { name: false })));
        }
        return setName(e.currentTarget.value);
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarScrollableContent, Object.assign({}, props, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Name') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, { value: name, onChange: handleChangeName, placeholder: t('Name') }) }), errors.name && (0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { children: t('Required_field', { field: t('Name') }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Aliases') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, { value: aliases, onChange: handleChangeAliases, placeholder: t('Aliases') }) }), errors.aliases && (0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { children: t('Custom_Emoji_Error_Same_Name_And_Alias') })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.FieldLabel, { alignSelf: 'stretch', display: 'flex', justifyContent: 'space-between', alignItems: 'center', children: [t('Custom_Emoji'), (0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { icon: 'upload', secondary: true, onClick: clickUpload })] }), newEmojiPreview && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { display: 'flex', flexDirection: 'row', mbs: 'none', justifyContent: 'center', children: (0, jsx_runtime_1.jsx)(fuselage_1.Margins, { inline: 4, children: (0, jsx_runtime_1.jsx)(fuselage_1.Box, { is: 'img', style: { objectFit: 'contain' }, w: 'x120', h: 'x120', src: newEmojiPreview }) }) }))] })] }) })), (0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarFooter, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { stretch: true, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: close, children: t('Cancel') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, onClick: handleSave, disabled: !hasUnsavedChanges, children: t('Save') })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbs: 8, children: (0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, { stretch: true, children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { icon: 'trash', danger: true, onClick: handleDeleteButtonClick, children: t('Delete') }) }) })] })] }));
};
exports.default = EditCustomEmoji;
