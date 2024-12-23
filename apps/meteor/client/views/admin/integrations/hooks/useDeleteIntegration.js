"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDeleteIntegration = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_i18next_1 = require("react-i18next");
const useDeleteIntegration = (integrationType) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const router = (0, ui_contexts_1.useRouter)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const createIntegration = (0, ui_contexts_1.useEndpoint)('POST', '/v1/integrations.remove');
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    return (0, react_query_1.useMutation)({
        mutationFn: createIntegration,
        onSuccess: () => {
            dispatchToastMessage({ type: 'success', message: t('Your_entry_has_been_deleted') });
            router.navigate(`/admin/integrations/${integrationType}`);
        },
        onError: (error) => {
            dispatchToastMessage({ type: 'error', message: error });
        },
        onSettled: () => {
            setModal(null);
        },
    });
};
exports.useDeleteIntegration = useDeleteIntegration;
