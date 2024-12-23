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
exports.useStarMessageMutation = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_i18next_1 = require("react-i18next");
const starredMessage_1 = require("../../../lib/mutationEffects/starredMessage");
const queryKeys_1 = require("../../../lib/queryKeys");
const useStarMessageMutation = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const queryClient = (0, react_query_1.useQueryClient)();
    const starMessage = (0, ui_contexts_1.useEndpoint)('POST', '/v1/chat.starMessage');
    return (0, react_query_1.useMutation)({
        mutationFn: (message) => __awaiter(void 0, void 0, void 0, function* () {
            yield starMessage({ messageId: message._id });
        }),
        onSuccess: (_data, message) => {
            (0, starredMessage_1.toggleStarredMessage)(message, true);
            dispatchToastMessage({ type: 'success', message: t('Message_has_been_starred') });
        },
        onError: (error) => {
            dispatchToastMessage({ type: 'error', message: error });
        },
        onSettled: (_data, _error, message) => {
            queryClient.invalidateQueries(queryKeys_1.roomsQueryKeys.starredMessages(message.rid));
        },
    });
};
exports.useStarMessageMutation = useStarMessageMutation;
