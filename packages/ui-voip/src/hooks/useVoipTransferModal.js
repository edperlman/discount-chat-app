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
exports.useVoipTransferModal = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const VoipTransferModal_1 = __importDefault(require("../components/VoipTransferModal"));
const useVoipAPI_1 = require("./useVoipAPI");
const useVoipTransferModal = ({ session }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const { transferCall } = (0, useVoipAPI_1.useVoipAPI)();
    const close = (0, react_1.useCallback)(() => setModal(null), [setModal]);
    (0, react_1.useEffect)(() => () => close(), [close]);
    const handleTransfer = (0, react_query_1.useMutation)({
        mutationFn: (_a) => __awaiter(void 0, [_a], void 0, function* ({ extension, name }) {
            yield transferCall(extension);
            return name || extension;
        }),
        onSuccess: (name) => {
            dispatchToastMessage({ type: 'success', message: t('Call_transfered_to__name__', { name }) });
            close();
        },
        onError: () => {
            dispatchToastMessage({ type: 'error', message: t('Failed_to_transfer_call') });
            close();
        },
    });
    const startTransfer = (0, react_1.useCallback)(() => {
        setModal((0, jsx_runtime_1.jsx)(VoipTransferModal_1.default, { extension: session.contact.id, isLoading: handleTransfer.isLoading, onCancel: () => setModal(null), onConfirm: handleTransfer.mutate }));
    }, [handleTransfer.isLoading, handleTransfer.mutate, session, setModal]);
    return { startTransfer, cancelTransfer: close };
};
exports.useVoipTransferModal = useVoipTransferModal;
