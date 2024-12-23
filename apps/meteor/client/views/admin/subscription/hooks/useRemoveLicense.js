"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRemoveLicense = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_i18next_1 = require("react-i18next");
const useLicense_1 = require("../../../../hooks/useLicense");
const useRemoveLicense = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const invalidateLicense = (0, useLicense_1.useInvalidateLicense)();
    const removeLicense = (0, ui_contexts_1.useEndpoint)('POST', '/v1/cloud.removeLicense');
    return (0, react_query_1.useMutation)({
        mutationFn: () => removeLicense(),
        onSuccess: () => {
            invalidateLicense(100);
            dispatchToastMessage({
                type: 'success',
                message: t('Removed'),
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
exports.useRemoveLicense = useRemoveLicense;
