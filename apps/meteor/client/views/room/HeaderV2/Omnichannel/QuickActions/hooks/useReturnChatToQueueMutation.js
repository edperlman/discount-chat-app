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
exports.useReturnChatToQueueMutation = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const queryKeys_1 = require("../../../../../../lib/queryKeys");
const useReturnChatToQueueMutation = (options) => {
    const returnChatToQueue = (0, ui_contexts_1.useMethod)('livechat:returnAsInquiry');
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)((rid) => __awaiter(void 0, void 0, void 0, function* () {
        yield returnChatToQueue(rid);
    }), Object.assign(Object.assign({}, options), { onSuccess: (data, rid, context) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            yield queryClient.invalidateQueries(['current-chats']);
            queryClient.removeQueries(['rooms', rid]);
            queryClient.removeQueries(['/v1/rooms.info', rid]);
            queryClient.removeQueries(queryKeys_1.subscriptionsQueryKeys.subscription(rid));
            return (_a = options === null || options === void 0 ? void 0 : options.onSuccess) === null || _a === void 0 ? void 0 : _a.call(options, data, rid, context);
        }) }));
};
exports.useReturnChatToQueueMutation = useReturnChatToQueueMutation;
