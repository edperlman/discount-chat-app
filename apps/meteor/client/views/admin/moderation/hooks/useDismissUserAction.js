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
const useDismissUserAction = (userId, isUserReport) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const setModal = (0, ui_contexts_1.useSetModal)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const moderationRoute = (0, ui_contexts_1.useRouter)();
    const tab = (0, ui_contexts_1.useRouteParameter)('tab');
    const queryClient = (0, react_query_1.useQueryClient)();
    const dismissMsgReports = (0, ui_contexts_1.useEndpoint)('POST', '/v1/moderation.dismissReports');
    const dismissUserReports = (0, ui_contexts_1.useEndpoint)('POST', '/v1/moderation.dismissUserReports');
    const dismissUser = isUserReport ? dismissUserReports : dismissMsgReports;
    const handleDismissUser = (0, react_query_1.useMutation)({
        mutationFn: dismissUser,
        onError: (error) => {
            dispatchToastMessage({ type: 'error', message: error });
        },
        onSuccess: () => {
            dispatchToastMessage({ type: 'success', message: t('Moderation_Reports_all_dismissed') });
        },
    });
    const onDismissUser = () => __awaiter(void 0, void 0, void 0, function* () {
        yield handleDismissUser.mutateAsync({ userId });
        queryClient.invalidateQueries({ queryKey: ['moderation', 'userReports'] });
        setModal();
        moderationRoute.navigate(`/admin/moderation/${tab}`, { replace: true });
    });
    const confirmDismissUser = () => {
        setModal((0, jsx_runtime_1.jsx)(GenericModal_1.default, { title: t('Moderation_Dismiss_all_reports'), confirmText: t('Moderation_Dismiss_all_reports'), variant: 'danger', onConfirm: () => onDismissUser(), onCancel: () => setModal(), children: t('Moderation_Dismiss_all_reports_confirm') }));
    };
    return {
        id: 'approve',
        content: t('Moderation_Dismiss_reports'),
        icon: 'circle-check',
        onClick: () => confirmDismissUser(),
    };
};
exports.default = useDismissUserAction;
