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
const useDeleteMessage = (mid, rid, onChange) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const deleteMessage = (0, ui_contexts_1.useEndpoint)('POST', '/v1/chat.delete');
    const dismissMessage = (0, ui_contexts_1.useEndpoint)('POST', '/v1/moderation.dismissReports');
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const queryClient = (0, react_query_1.useQueryClient)();
    const handleDeleteMessages = (0, react_query_1.useMutation)({
        mutationFn: deleteMessage,
        onError: (error) => {
            dispatchToastMessage({ type: 'error', message: error });
            setModal();
        },
        onSuccess: () => __awaiter(void 0, void 0, void 0, function* () {
            yield handleDismissMessage.mutateAsync({ msgId: mid });
        }),
    });
    const handleDismissMessage = (0, react_query_1.useMutation)({
        mutationFn: dismissMessage,
        onError: (error) => {
            dispatchToastMessage({ type: 'error', message: error });
        },
        onSuccess: () => {
            dispatchToastMessage({ type: 'success', message: t('Moderation_Message_deleted') });
        },
        onSettled: () => {
            onChange();
            queryClient.invalidateQueries({ queryKey: ['moderation', 'msgReports'] });
            setModal();
        },
    });
    const onDeleteAll = () => __awaiter(void 0, void 0, void 0, function* () {
        yield handleDeleteMessages.mutateAsync({ msgId: mid, roomId: rid, asUser: true });
    });
    const confirmDeletMessage = () => {
        setModal((0, jsx_runtime_1.jsx)(GenericModal_1.default, { confirmText: t('Moderation_Dismiss_and_delete'), title: t('Moderation_Delete_this_message'), variant: 'danger', onConfirm: () => onDeleteAll(), onCancel: () => setModal(), children: t('Moderation_Are_you_sure_you_want_to_delete_this_message') }));
    };
    return confirmDeletMessage;
};
exports.default = useDeleteMessage;
