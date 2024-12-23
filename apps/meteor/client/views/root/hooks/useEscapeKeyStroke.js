"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEscapeKeyStroke = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const useClearUnreadAllMessagesMutation_1 = require("./useClearUnreadAllMessagesMutation");
const GenericModal_1 = __importDefault(require("../../../components/GenericModal"));
const imperativeModal_1 = require("../../../lib/imperativeModal");
const useEscapeKeyStroke = () => {
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const clearUnreadAllMessagesMutation = (0, useClearUnreadAllMessagesMutation_1.useClearUnreadAllMessagesMutation)({
        onError: (error) => {
            dispatchToastMessage({ type: 'error', message: error });
        },
        onMutate: () => {
            imperativeModal_1.imperativeModal.close();
        },
    });
    (0, react_1.useEffect)(() => {
        const handleKeyDown = (event) => {
            if (event.code !== 'Escape' || !(event.shiftKey === true || event.ctrlKey === true)) {
                return;
            }
            event.preventDefault();
            event.stopPropagation();
            imperativeModal_1.imperativeModal.open({
                component: GenericModal_1.default,
                props: {
                    children: t('Are_you_sure_you_want_to_clear_all_unread_messages'),
                    variant: 'warning',
                    title: t('Clear_all_unreads_question'),
                    confirmText: t('Yes_clear_all'),
                    onClose: imperativeModal_1.imperativeModal.close,
                    onCancel: imperativeModal_1.imperativeModal.close,
                    onConfirm: clearUnreadAllMessagesMutation.mutate,
                },
            });
        };
        document.body.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.removeEventListener('keydown', handleKeyDown);
        };
    }, [clearUnreadAllMessagesMutation.mutate, dispatchToastMessage, t]);
};
exports.useEscapeKeyStroke = useEscapeKeyStroke;
