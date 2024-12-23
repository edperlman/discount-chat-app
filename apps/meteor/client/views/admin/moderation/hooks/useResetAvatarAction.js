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
const useResetAvatarAction = (userId) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const queryClient = (0, react_query_1.useQueryClient)();
    const resetAvatar = (0, ui_contexts_1.useEndpoint)('POST', '/v1/users.resetAvatar');
    const handleResetAvatar = (0, react_query_1.useMutation)({
        mutationFn: resetAvatar,
        onError: (error) => {
            dispatchToastMessage({ type: 'error', message: error });
        },
        onSuccess: () => {
            dispatchToastMessage({ type: 'success', message: t('Moderation_Avatar_reset_success') });
        },
    });
    const onResetAvatar = () => __awaiter(void 0, void 0, void 0, function* () {
        setModal();
        yield handleResetAvatar.mutateAsync({ userId });
        queryClient.invalidateQueries({ queryKey: ['moderation'] });
    });
    const confirmResetAvatar = () => {
        setModal((0, jsx_runtime_1.jsx)(GenericModal_1.default, { title: t('Moderation_Reset_user_avatar'), confirmText: t('Reset'), variant: 'danger', onConfirm: () => onResetAvatar(), onCancel: () => setModal(), children: t('Moderation_Are_you_sure_you_want_to_reset_the_avatar') }));
    };
    return {
        id: 'resetAvatar',
        content: t('Moderation_Reset_user_avatar'),
        icon: 'reload',
        onClick: () => confirmResetAvatar(),
    };
};
exports.default = useResetAvatarAction;
