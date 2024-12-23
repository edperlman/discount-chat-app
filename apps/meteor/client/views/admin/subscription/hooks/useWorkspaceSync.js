"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWorkspaceSync = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_i18next_1 = require("react-i18next");
const useWorkspaceSync = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const cloudSync = (0, ui_contexts_1.useEndpoint)('POST', '/v1/cloud.syncWorkspace');
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    return (0, react_query_1.useMutation)({
        mutationFn: () => cloudSync(),
        onSuccess: () => {
            dispatchToastMessage({
                type: 'success',
                message: t('Sync_success'),
            });
        },
        onError: (error) => {
            dispatchToastMessage({
                type: 'error',
                message: error,
            });
        },
    });
};
exports.useWorkspaceSync = useWorkspaceSync;
