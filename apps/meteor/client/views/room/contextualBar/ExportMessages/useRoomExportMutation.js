"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRoomExportMutation = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_i18next_1 = require("react-i18next");
const useRoomExportMutation = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const roomsExport = (0, ui_contexts_1.useEndpoint)('POST', '/v1/rooms.export');
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    return (0, react_query_1.useMutation)({
        mutationFn: roomsExport,
        onSuccess: () => {
            dispatchToastMessage({
                type: 'success',
                message: t('Your_email_has_been_queued_for_sending'),
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
exports.useRoomExportMutation = useRoomExportMutation;
