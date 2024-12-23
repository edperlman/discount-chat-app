"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const RemoveExtensionModal = ({ name, extension, username, onClose }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const queryClient = (0, react_query_1.useQueryClient)();
    const loggedUser = (0, ui_contexts_1.useUser)();
    const removeExtension = (0, ui_contexts_1.useEndpoint)('POST', '/v1/voip-freeswitch.extension.assign');
    const modalTitleId = (0, fuselage_hooks_1.useUniqueId)();
    const userFieldId = (0, fuselage_hooks_1.useUniqueId)();
    const freeExtensionNumberId = (0, fuselage_hooks_1.useUniqueId)();
    const handleRemoveExtension = (0, react_query_1.useMutation)({
        mutationFn: (username) => removeExtension({ username }),
        onSuccess: () => {
            dispatchToastMessage({ type: 'success', message: t('Extension_removed') });
            queryClient.invalidateQueries(['users.list']);
            if ((loggedUser === null || loggedUser === void 0 ? void 0 : loggedUser.username) === username) {
                queryClient.invalidateQueries(['voip-client']);
            }
            onClose();
        },
        onError: (error) => {
            dispatchToastMessage({ type: 'error', message: error });
            onClose();
        },
    });
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Modal, { "aria-labelledby": modalTitleId, children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Header, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Modal.Title, { id: modalTitleId, children: t('Remove_extension') }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Close, { "aria-label": t('Close'), onClick: onClose })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Content, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.FieldGroup, { children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: userFieldId, children: t('User') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, { disabled: true, id: userFieldId, value: name }) })] }), (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: freeExtensionNumberId, children: t('Extension') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(fuselage_1.TextInput, { disabled: true, id: freeExtensionNumberId, value: extension }) })] })] }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Footer, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Modal.FooterControllers, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { onClick: onClose, children: t('Cancel') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { danger: true, onClick: () => handleRemoveExtension.mutate(username), loading: handleRemoveExtension.isLoading, children: t('Remove') })] }) })] }));
};
exports.default = RemoveExtensionModal;
