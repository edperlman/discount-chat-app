"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const fuselage_hooks_1 = require("@rocket.chat/fuselage-hooks");
const ui_client_1 = require("@rocket.chat/ui-client");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const VoipTransferModal = ({ extension, isLoading = false, onCancel, onConfirm }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [username, setTransferTo] = (0, react_1.useState)('');
    const user = (0, ui_contexts_1.useUser)();
    const transferToId = (0, fuselage_hooks_1.useUniqueId)();
    const modalId = (0, fuselage_hooks_1.useUniqueId)();
    const getUserInfo = (0, ui_contexts_1.useEndpoint)('GET', '/v1/users.info');
    const { data: targetUser, isInitialLoading: isTargetInfoLoading } = (0, react_query_1.useQuery)(['/v1/users.info', username], () => getUserInfo({ username }), {
        enabled: Boolean(username),
        select: (data) => (data === null || data === void 0 ? void 0 : data.user) || {},
    });
    const handleConfirm = () => {
        if (!(targetUser === null || targetUser === void 0 ? void 0 : targetUser.freeSwitchExtension)) {
            return;
        }
        onConfirm({ extension: targetUser.freeSwitchExtension, name: targetUser.name });
    };
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Modal, { open: true, "aria-labelledby": modalId, children: [(0, jsx_runtime_1.jsxs)(fuselage_1.Modal.Header, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Modal.Icon, { color: 'danger', name: 'modal-warning' }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Title, { id: modalId, children: t('Transfer_call') }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Close, { "aria-label": t('Close'), onClick: onCancel })] }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Content, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Field, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.FieldLabel, { htmlFor: transferToId, children: t('Transfer_to') }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldRow, { children: (0, jsx_runtime_1.jsx)(ui_client_1.UserAutoComplete, { id: transferToId, value: username, "aria-describedby": `${transferToId}-hint`, "data-testid": 'vc-input-transfer-to', onChange: (target) => setTransferTo(target), multiple: false, conditions: {
                                    freeSwitchExtension: { $exists: true, $ne: extension },
                                    username: { $ne: user === null || user === void 0 ? void 0 : user.username },
                                } }) }), (0, jsx_runtime_1.jsx)(fuselage_1.FieldHint, { id: `${transferToId}-hint`, children: t('Select_someone_to_transfer_the_call_to') })] }) }), (0, jsx_runtime_1.jsx)(fuselage_1.Modal.Footer, { children: (0, jsx_runtime_1.jsxs)(fuselage_1.Modal.FooterControllers, { children: [(0, jsx_runtime_1.jsx)(fuselage_1.Button, { "data-testid": 'vc-button-cancel', secondary: true, onClick: onCancel, children: t('Cancel') }), (0, jsx_runtime_1.jsx)(fuselage_1.Button, { danger: true, onClick: handleConfirm, disabled: !(targetUser === null || targetUser === void 0 ? void 0 : targetUser.freeSwitchExtension), loading: isLoading || isTargetInfoLoading, children: t('Hang_up_and_transfer_call') })] }) })] }));
};
exports.default = VoipTransferModal;
