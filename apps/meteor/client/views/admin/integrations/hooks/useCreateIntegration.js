"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCreateIntegration = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_i18next_1 = require("react-i18next");
const useCreateIntegration = (integrationType) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const router = (0, ui_contexts_1.useRouter)();
    const createIntegration = (0, ui_contexts_1.useEndpoint)('POST', '/v1/integrations.create');
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    return (0, react_query_1.useMutation)({
        mutationFn: createIntegration,
        onSuccess: (data) => {
            dispatchToastMessage({ type: 'success', message: t('Integration_added') });
            router.navigate(`/admin/integrations/edit/${integrationType === 'webhook-incoming' ? 'incoming' : 'outgoing'}/${data.integration._id}`);
        },
        onError: (error) => {
            dispatchToastMessage({ type: 'error', message: error });
        },
    });
};
exports.useCreateIntegration = useCreateIntegration;
