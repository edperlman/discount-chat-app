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
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_client_1 = require("@rocket.chat/ui-client");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importStar(require("react"));
const react_hook_form_1 = require("react-hook-form");
const react_i18next_1 = require("react-i18next");
const AssignExtensionModal = ({ defaultExtension, defaultUsername, onClose }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const queryClient = (0, react_query_1.useQueryClient)();
    const loggedUser = (0, ui_contexts_1.useUser)();
    const assignUser = (0, ui_contexts_1.useEndpoint)('POST', '/v1/voip-freeswitch.extension.assign');
    const getAvailableExtensions = (0, ui_contexts_1.useEndpoint)('GET', '/v1/voip-freeswitch.extension.list');
    const modalTitleId = (0, fuselage_hooks_1.useUniqueId)();
    const usersWithoutExtensionsId = (0, fuselage_hooks_1.useUniqueId)();
    const freeExtensionNumberId = (0, fuselage_hooks_1.useUniqueId)();
    const { control, handleSubmit, formState: { isSubmitting }, } = (0, react_hook_form_1.useForm)({
        defaultValues: {
            username: defaultUsername,
            extension: defaultExtension,
        },
    });
    const selectedUsername = (0, react_hook_form_1.useWatch)({ control, name: 'username' });
    const selectedExtension = (0, react_hook_form_1.useWatch)({ control, name: 'extension' });
    const { data: availableExtensions = [], isLoading } = (0, react_query_1.useQuery)(['/v1/voip-freeswitch.extension.list', selectedUsername], () => getAvailableExtensions({ type: 'available', username: selectedUsername }), {
        select: (data) => data.extensions || [],
        enabled: !!selectedUsername,
    });
    const extensionOptions = (0, react_1.useMemo)(() => availableExtensions.map(({ extension }) => [extension, extension]), [availableExtensions]);
    const handleAssignment = (0, react_query_1.useMutation)({
        mutationFn: (_a) => __awaiter(void 0, [_a], void 0, function* ({ username, extension }) {
            yield assignUser({ username, extension });
            queryClient.invalidateQueries(['users.list']);
            if ((loggedUser === null || loggedUser === void 0 ? void 0 : loggedUser.username) === username) {
                queryClient.invalidateQueries(['voip-client']);
            }
            onClose();
        }),
        onError: (error) => {
            dispatchToastMessage({ type: 'error', message: error });
            onClose();
        },
    });
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Modal, { "aria-labelledby": modalTitleId, wrapperFunction: (props) => (0, jsx_runtime_1.jsx)(fuselage_1.Box, Object.assign({ is: 'form', onSubmit: handleSubmit((data) => handleAssignment.mutateAsync(data)) }, props)), children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Header, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Modal.Title, { id: modalTitleId, children: t('Assign_extension') }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Close, { "aria-label": t('Close'), onClick: onClose })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Content, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: usersWithoutExtensionsId, children: t('User') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'username', render: ({ field }) => ((0, jsx_runtime_1.jsx)(ui_client_1.UserAutoComplete, { id: usersWithoutExtensionsId, value: field.value, onChange: field.onChange, conditions: {
                                                $or: [
                                                    { freeSwitchExtension: { $exists: true, $eq: selectedExtension } },
                                                    { freeSwitchExtension: { $exists: false } },
                                                    { username: { $exists: true, $eq: selectedUsername } },
                                                ],
                                            } })) }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: freeExtensionNumberId, children: t('Available_extensions') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: 'extension', render: ({ field }) => ((0, jsx_runtime_1.jsx)(fuselage_1.Select, { id: freeExtensionNumberId, disabled: isLoading || !selectedUsername, options: extensionOptions, placeholder: t('Select_an_option'), value: field.value, onChange: field.onChange })) }) })] })] }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Footer, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Modal.FooterControllers, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: onClose, children: t('Cancel') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { primary: true, disabled: !selectedUsername || !selectedExtension, loading: isSubmitting, type: 'submit', children: t('Associate') })] }) })] }));
};
exports.default = AssignExtensionModal;
