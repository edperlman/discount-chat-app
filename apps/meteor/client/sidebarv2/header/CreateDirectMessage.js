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
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const UserAutoCompleteMultipleFederated_1 = __importDefault(require("../../components/UserAutoCompleteMultiple/UserAutoCompleteMultipleFederated"));
const goToRoomById_1 = require("../../lib/utils/goToRoomById");
const CreateDirectMessage = ({ onClose }) => {
    const t = (0, ui_contexts_1.useTranslation)();
    const directMaxUsers = (0, ui_contexts_1.useSetting)('DirectMesssage_maxUsers', 1);
    const membersFieldId = (0, fuselage_hooks_1.useUniqueId)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const createDirectAction = (0, ui_contexts_1.useEndpoint)('POST', '/v1/dm.create');
    const { control, handleSubmit, formState: { isSubmitting, isValidating, errors }, } = (0, react_hook_form_1.useForm)({ mode: 'onBlur', defaultValues: { users: [] } });
    const mutateDirectMessage = (0, react_query_1.useMutation)({
        mutationFn: createDirectAction,
        onSuccess: ({ room: { rid } }) => {
            (0, goToRoomById_1.goToRoomById)(rid);
        },
        onError: (error) => {
            dispatchToastMessage({ type: 'error', message: error });
        },
        onSettled: () => {
            onClose();
        },
    });
    const handleCreate = (_a) => __awaiter(void 0, [_a], void 0, function* ({ users }) {
        return mutateDirectMessage.mutateAsync({ usernames: users.join(',') });
    });
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Modal, { "data-qa": 'create-direct-modal', wrapperFunction: (props) => (0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ is: 'form', onSubmit: handleSubmit(handleCreate) }, props)), children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Header, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Modal.Title, { children: t('Create_direct_message') }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Close, { tabIndex: -1, onClick: onClose })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Content, { mbe: 2, children: (0, jsx_runtime_1.jsx)(fuselage_1.FieldGroup, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Box, { htmlFor: membersFieldId, children: t('Direct_message_creation_description') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { name: 'users', rules: {
                                        required: t('Direct_message_creation_error'),
                                        validate: (users) => users.length + 1 > directMaxUsers
                                            ? t('error-direct-message-max-user-exceeded', { maxUsers: directMaxUsers })
                                            : undefined,
                                    }, control: control, render: ({ field: { name, onChange, value, onBlur } }) => ((0, jsx_runtime_1.jsx)(UserAutoCompleteMultipleFederated_1.default, { name: name, onChange: onChange, value: value, onBlur: onBlur, id: membersFieldId, "aria-describedby": `${membersFieldId}-hint ${membersFieldId}-error`, "aria-required": 'true', "aria-invalid": Boolean(errors.users) })) }) }), errors.users && ((0, jsx_runtime_1.jsx)(fuselage_1.FieldError, { "aria-live": 'assertive', id: `${membersFieldId}-error`, children: errors.users.message })), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${membersFieldId}-hint`, children: t('Direct_message_creation_description_hint') })] }) }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Footer, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Modal.FooterControllers, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: onClose, children: t('Cancel') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { loading: isSubmitting || isValidating, type: 'submit', primary: true, children: t('Create') })] }) })] }));
};
exports.default = (0, react_1.memo)(CreateDirectMessage);
