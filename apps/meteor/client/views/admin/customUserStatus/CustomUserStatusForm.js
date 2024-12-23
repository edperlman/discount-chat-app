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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const Contextualbar_1 = require("../../../components/Contextualbar");
const GenericModal_1 = __importDefault(require("../../../components/GenericModal"));
const CustomUserStatusForm = ({ onClose, onReload, status }) => {
    var _a, _b;
    const t = (0, ui_contexts_1.useTranslation)();
    const { _id, name, statusType } = status || {};
    const setModal = (0, ui_contexts_1.useSetModal)();
    const route = (0, ui_contexts_1.useRoute)('user-status');
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const formId = (0, fuselage_hooks_1.useUniqueId)();
    const { register, control, handleSubmit, formState: { errors }, } = (0, react_hook_form_1.useForm)({
        defaultValues: { name: (_a = status === null || status === void 0 ? void 0 : status.name) !== null && _a !== void 0 ? _a : '', statusType: (_b = status === null || status === void 0 ? void 0 : status.statusType) !== null && _b !== void 0 ? _b : '' },
        mode: 'all',
    });
    const saveStatus = (0, ui_contexts_1.useEndpoint)('POST', _id ? '/v1/custom-user-status.update' : '/v1/custom-user-status.create');
    const deleteStatus = (0, ui_contexts_1.useEndpoint)('POST', '/v1/custom-user-status.delete');
    const handleSave = (0, react_1.useCallback)((data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield saveStatus(Object.assign({ _id, name, statusType }, data));
            dispatchToastMessage({
                type: 'success',
                message: t('Custom_User_Status_Updated_Successfully'),
            });
            onReload();
            route.push({});
        }
        catch (error) {
            dispatchToastMessage({ type: 'error', message: error });
        }
    }), [saveStatus, _id, name, statusType, route, dispatchToastMessage, t, onReload]);
    const handleDeleteStatus = (0, react_1.useCallback)(() => {
        const handleCancel = () => {
            setModal(null);
        };
        const handleDelete = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield deleteStatus({ customUserStatusId: _id || '' });
                dispatchToastMessage({ type: 'success', message: t('Custom_User_Status_Has_Been_Deleted') });
                onReload();
                route.push({});
            }
            catch (error) {
                dispatchToastMessage({ type: 'error', message: error });
            }
            finally {
                setModal(null);
            }
        });
        setModal(() => ((0, jsx_runtime_1.jsx)(GenericModal_1.default, { variant: 'danger', onConfirm: handleDelete, onCancel: handleCancel, onClose: handleCancel, confirmText: t('Delete'), children: t('Custom_User_Status_Delete_Warning') })));
    }, [_id, route, deleteStatus, dispatchToastMessage, onReload, setModal, t]);
    const presenceOptions = [
        ['online', t('Online')],
        ['busy', t('Busy')],
        ['away', t('Away')],
        ['offline', t('Offline')],
    ];
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(Contextualbar_1.ContextualbarScrollableContent, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { id: formId, is: 'form', onSubmit: handleSubmit(handleSave), children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Name') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, Object.assign({}, register('name', { required: t('Required_field', { field: t('Name') }) }), { placeholder: t('Name') })) }), errors.name && (0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { children: errors.name.message })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { children: t('Presence') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'statusType', control: control, rules: { required: t('Required_field', { field: t('Presence') }) }, render: ({ field }) => (0, jsx_runtime_1.jsx)(fuselage_1.Select, Object.assign({}, field, { placeholder: t('Presence'), options: presenceOptions })) }) }), errors.statusType && (0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { children: errors.statusType.message })] })] }) }), (0, jsx_runtime_1.jsxs)(Contextualbar_1.ContextualbarFooter, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.ButtonGroup, { stretch: true, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: onClose, children: t('Cancel') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { form: formId, primary: true, type: 'submit', children: t('Save') })] }), _id && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { mbs: 8, children: (0, jsx_runtime_1.jsx)(fuselage_1.ButtonGroup, { stretch: true, children: (0, jsx_runtime_1.jsx)(fuselage_1.Button, { icon: 'trash', danger: true, onClick: handleDeleteStatus, children: t('Delete') }) }) }))] })] }));
};
exports.default = CustomUserStatusForm;
