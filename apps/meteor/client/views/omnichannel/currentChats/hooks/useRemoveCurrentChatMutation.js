"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRemoveCurrentChatMutation = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const useRemoveCurrentChatMutation = (options) => {
    const removeRoom = (0, ui_contexts_1.useMethod)('livechat:removeRoom');
    const queryClient = (0, react_query_1.useQueryClient)();
    return (0, react_query_1.useMutation)((rid) => removeRoom(rid), Object.assign(Object.assign({}, options), { onSuccess: (...args) => {
            var _a;
            queryClient.invalidateQueries(['current-chats']);
            (_a = options === null || options === void 0 ? void 0 : options.onSuccess) === null || _a === void 0 ? void 0 : _a.call(options, ...args);
        } }));
};
exports.useRemoveCurrentChatMutation = useRemoveCurrentChatMutation;
