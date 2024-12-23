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
exports.WrapUpCallModal = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const Tags_1 = __importDefault(require("../../../components/Omnichannel/Tags"));
const WrapUpCallModal = ({ closeRoom }) => {
    const setModal = (0, ui_contexts_1.useSetModal)();
    const closeModal = () => setModal(null);
    const { t } = (0, react_i18next_1.useTranslation)();
    const { register, handleSubmit, setValue, watch } = (0, react_hook_form_1.useForm)();
    const tags = watch('tags');
    (0, react_1.useEffect)(() => {
        register('tags');
    }, [register]);
    const handleTags = (value) => {
        setValue('tags', value);
    };
    const onSubmit = (data) => {
        closeRoom(data);
        closeModal();
    };
    const onCancel = () => {
        closeRoom();
        closeModal();
    };
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Modal, { wrapperFunction: (props) => (0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ is: 'form', onSubmit: handleSubmit(onSubmit) }, props)), children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Header, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Modal.Title, { children: t('Wrap_up_the_call') }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Close, { onClick: closeModal })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Content, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { mbe: '24px', children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Notes') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextAreaInput, Object.assign({ placeholder: t('Do_you_have_any_notes_for_this_conversation') }, register('comment'))) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { children: t('These_notes_will_be_available_in_the_call_summary') })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Field, { children: (0, jsx_runtime_1.jsx)(Tags_1.default, { tags: tags, handler: handleTags }) })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Footer, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Modal.FooterControllers, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { secondary: true, onClick: onCancel, children: t('Cancel') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { type: 'submit', primary: true, children: t('Save') })] }) })] }));
};
exports.WrapUpCallModal = WrapUpCallModal;
