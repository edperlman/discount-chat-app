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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOutlookAuthenticationMutationLogout = exports.useOutlookAuthenticationMutation = exports.useOutlookAuthentication = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_i18next_1 = require("react-i18next");
const NotOnDesktopError_1 = require("../lib/NotOnDesktopError");
const useOutlookAuthentication = () => {
    const { data: authEnabled, isError, error, } = (0, react_query_1.useQuery)(['outlook', 'auth'], () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const desktopApp = window.RocketChatDesktop;
        if (!(desktopApp === null || desktopApp === void 0 ? void 0 : desktopApp.hasOutlookCredentials)) {
            throw new NotOnDesktopError_1.NotOnDesktopError();
        }
        return Boolean(yield ((_a = desktopApp === null || desktopApp === void 0 ? void 0 : desktopApp.hasOutlookCredentials) === null || _a === void 0 ? void 0 : _a.call(desktopApp))) || false;
    }), {
        onError: (error) => {
            console.error(error);
        },
    });
    return { authEnabled: Boolean(authEnabled), isError, error };
};
exports.useOutlookAuthentication = useOutlookAuthentication;
const useOutlookAuthenticationMutation = () => {
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)({
        mutationFn: () => __awaiter(void 0, void 0, void 0, function* () {
            yield queryClient.invalidateQueries(['outlook', 'auth']);
        }),
    });
};
exports.useOutlookAuthenticationMutation = useOutlookAuthenticationMutation;
const useOutlookAuthenticationMutationLogout = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const mutation = (0, exports.useOutlookAuthenticationMutation)();
    return (0, react_query_1.useMutation)({
        mutationFn: () => __awaiter(void 0, void 0, void 0, function* () {
            const desktopApp = window.RocketChatDesktop;
            if (!(desktopApp === null || desktopApp === void 0 ? void 0 : desktopApp.clearOutlookCredentials)) {
                throw new NotOnDesktopError_1.NotOnDesktopError();
            }
            yield desktopApp.clearOutlookCredentials();
            return mutation.mutateAsync();
        }),
        onSuccess: () => {
            dispatchToastMessage({ type: 'success', message: t('Outlook_authentication_disabled') });
        },
    });
};
exports.useOutlookAuthenticationMutationLogout = useOutlookAuthenticationMutationLogout;
