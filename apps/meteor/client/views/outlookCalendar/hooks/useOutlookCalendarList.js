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
exports.useMutationOutlookCalendarSync = exports.useOutlookCalendarList = exports.useOutlookCalendarListForToday = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const useOutlookAuthentication_1 = require("./useOutlookAuthentication");
const syncOutlookEvents_1 = require("../lib/syncOutlookEvents");
const useOutlookCalendarListForToday = () => {
    return (0, exports.useOutlookCalendarList)(new Date());
};
exports.useOutlookCalendarListForToday = useOutlookCalendarListForToday;
const useOutlookCalendarList = (date) => {
    const calendarData = (0, ui_contexts_1.useEndpoint)('GET', '/v1/calendar-events.list');
    return (0, react_query_1.useQuery)(['outlook', 'calendar', 'list'], () => __awaiter(void 0, void 0, void 0, function* () {
        const { data } = yield calendarData({ date: date.toISOString() });
        return data;
    }));
};
exports.useOutlookCalendarList = useOutlookCalendarList;
const useMutationOutlookCalendarSync = () => {
    const t = (0, ui_contexts_1.useTranslation)();
    const queryClient = (0, react_query_1.useQueryClient)();
    const checkOutlookCredentials = (0, useOutlookAuthentication_1.useOutlookAuthenticationMutation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const syncMutation = (0, react_query_1.useMutation)({
        mutationFn: () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, syncOutlookEvents_1.syncOutlookEvents)();
            yield queryClient.invalidateQueries(['outlook', 'calendar', 'list']);
            yield checkOutlookCredentials.mutateAsync();
        }),
        onSuccess: () => {
            dispatchToastMessage({ type: 'success', message: t('Outlook_Sync_Success') });
        },
        onError: (error) => {
            if (error instanceof Error && error.message === 'abort') {
                return;
            }
            dispatchToastMessage({ type: 'error', message: t('Outlook_Sync_Failed') });
        },
    });
    return syncMutation;
};
exports.useMutationOutlookCalendarSync = useMutationOutlookCalendarSync;
