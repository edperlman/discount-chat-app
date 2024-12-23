"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const GenericModal_1 = __importDefault(require("../../../../components/GenericModal"));
const useDeleteMessagesAction = (userId) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const deleteMessages = (0, ui_contexts_1.useEndpoint)('POST', '/v1/moderation.user.deleteReportedMessages');
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const router = (0, ui_contexts_1.useRouter)();
    const tab = (0, ui_contexts_1.useRouteParameter)('tab');
    const queryClient = (0, react_query_1.useQueryClient)();
    const handleDeleteMessages = (0, react_query_1.useMutation)({
        mutationFn: deleteMessages,
        onError: (error) => {
            dispatchToastMessage({ type: 'error', message: error });
        },
        onSuccess: () => {
            dispatchToastMessage({ type: 'success', message: t('Moderation_Messages_deleted') });
        },
    });
    const onDeleteAll = () => __awaiter(void 0, void 0, void 0, function* () {
        yield handleDeleteMessages.mutateAsync({ userId });
        queryClient.invalidateQueries({ queryKey: ['moderation', 'msgReports', 'fetchAll'] });
        setModal();
        router.navigate(`/admin/moderation/${tab}`);
    });
    const confirmDeletMessages = () => {
        setModal((0, jsx_runtime_1.jsx)(GenericModal_1.default, { confirmText: t('Moderation_Dismiss_and_delete'), title: t('Moderation_Delete_all_messages'), variant: 'danger', onConfirm: () => onDeleteAll(), onCancel: () => setModal(), children: t('Moderation_Are_you_sure_you_want_to_delete_all_reported_messages_from_this_user') }));
    };
    return {
        id: 'deleteAll',
        content: t('Moderation_Delete_all_messages'),
        icon: 'trash',
        onClick: () => confirmDeletMessages(),
    };
};
exports.default = useDeleteMessagesAction;
