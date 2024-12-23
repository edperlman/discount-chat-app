"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const fuselage_1 = require("@rocket.chat/fuselage");
const ui_avatar_1 = require("@rocket.chat/ui-avatar");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_i18next_1 = require("react-i18next");
const VoipContactId = ({ name, username, transferedBy, isLoading = false, }) => {
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const handleCopy = (0, react_query_1.useMutation)({
        mutationFn: (contactName) => navigator.clipboard.writeText(contactName),
        onSuccess: () => dispatchToastMessage({ type: 'success', message: t('Phone_number_copied') }),
        onError: () => dispatchToastMessage({ type: 'error', message: t('Failed_to_copy_phone_number') }),
    });
    if (!name) {
        return null;
    }
    if (isLoading) {
        return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', pi: 12, pb: 8, children: [(0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { variant: 'rect', size: 20, mie: 8 }), (0, jsx_runtime_1.jsx)(fuselage_1.Skeleton, { variant: 'text', width: 100, height: 16 })] }));
    }
    return ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { pi: 12, pbs: 4, pbe: 8, children: [transferedBy && ((0, jsx_runtime_1.jsxs)(fuselage_1.Box, { mbe: 8, fontScale: 'p2', color: 'secondary-info', children: [t('From'), ": ", transferedBy] })), (0, jsx_runtime_1.jsxs)(fuselage_1.Box, { display: 'flex', children: [username && ((0, jsx_runtime_1.jsx)(fuselage_1.Box, { flexShrink: 0, mie: 8, children: (0, jsx_runtime_1.jsx)(ui_avatar_1.UserAvatar, { username: username, size: 'x24' }) })), (0, jsx_runtime_1.jsx)(fuselage_1.Box, { withTruncatedText: true, is: 'p', fontScale: 'p1', mie: 'auto', color: 'secondary-info', flexGrow: 1, flexShrink: 1, title: name, children: name }), !username && ((0, jsx_runtime_1.jsx)(fuselage_1.IconButton, { mini: true, "aria-label": t('Copy_phone_number'), "data-tooltip": t('Copy_phone_number'), mis: 6, icon: 'copy', onClick: () => handleCopy.mutate(name) }))] })] }));
};
exports.default = VoipContactId;
