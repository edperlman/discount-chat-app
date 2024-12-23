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
exports.useResumeChatOnHoldMutation = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const queryKeys_1 = require("../../../../../lib/queryKeys");
const useResumeChatOnHoldMutation = (options) => {
    const resumeChatOnHold = (0, ui_contexts_1.useEndpoint)('POST', '/v1/livechat/room.resumeOnHold');
    const dispatchToastMessage = (0, ui_contexts_1.useToastMessageDispatch)();
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)((roomId) => __awaiter(void 0, void 0, void 0, function* () {
        yield resumeChatOnHold({ roomId });
    }), Object.assign(Object.assign({}, options), { onSuccess: (data, rid, context) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            yield queryClient.invalidateQueries(['current-chats']);
            yield queryClient.invalidateQueries(['rooms', rid]);
            yield queryClient.invalidateQueries(queryKeys_1.subscriptionsQueryKeys.subscription(rid));
            return (_a = options === null || options === void 0 ? void 0 : options.onSuccess) === null || _a === void 0 ? void 0 : _a.call(options, data, rid, context);
        }), onError: (error) => {
            dispatchToastMessage({ type: 'error', message: error });
        } }));
};
exports.useResumeChatOnHoldMutation = useResumeChatOnHoldMutation;
