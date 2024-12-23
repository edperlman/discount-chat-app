"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUpdateIntegration = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_i18next_1 = require("react-i18next");
const useUpdateIntegration = (integrationType) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const router = (0, ui_contexts_1.useRouter)();
    const updateIntegration = (0, ui_contexts_1.useEndpoint)('PUT', '/v1/integrations.update');
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    return (0, react_query_1.useMutation)({
        mutationFn: updateIntegration,
        onSuccess: () => {
            dispatchToastMessage({ type: 'success', message: t('Integration_updated') });
            router.navigate(`/admin/integrations/${integrationType}`);
        },
        onError: (error) => {
            dispatchToastMessage({ type: 'error', message: error });
        },
    });
};
exports.useUpdateIntegration = useUpdateIntegration;
