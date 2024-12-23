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
exports.useHistoryMessageList = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const useScrollableMessageList_1 = require("../../../../hooks/lists/useScrollableMessageList");
const useStreamUpdatesForMessageList_1 = require("../../../../hooks/lists/useStreamUpdatesForMessageList");
const useComponentDidUpdate_1 = require("../../../../hooks/useComponentDidUpdate");
const MessageList_1 = require("../../../../lib/lists/MessageList");
const getConfig_1 = require("../../../../lib/utils/getConfig");
const useHistoryMessageList = (options, uid) => {
    const [itemsList, setItemsList] = (0, react_1.useState)(() => new MessageList_1.MessageList());
    const reload = (0, react_1.useCallback)(() => setItemsList(new MessageList_1.MessageList()), []);
    const getMessages = (0, ui_contexts_1.useEndpoint)('GET', '/v1/livechat/:rid/messages', { rid: options.roomId });
    (0, useComponentDidUpdate_1.useComponentDidUpdate)(() => {
        options && reload();
    }, [options, reload]);
    const fetchMessages = (0, react_1.useCallback)((start, end) => __awaiter(void 0, void 0, void 0, function* () {
        const { messages, total } = yield getMessages(Object.assign(Object.assign({}, (options.filter && { searchTerm: options.filter })), { offset: start, count: end, sort: `{ "ts": 1 }` }));
        return {
            items: messages,
            itemCount: total,
        };
    }), [getMessages, options.filter]);
    const { loadMoreItems, initialItemCount } = (0, useScrollableMessageList_1.useScrollableMessageList)(itemsList, fetchMessages, (0, react_1.useMemo)(() => parseInt(`${(0, getConfig_1.getConfig)('historyMessageListSize', 10)}`), []));
    (0, useStreamUpdatesForMessageList_1.useStreamUpdatesForMessageList)(itemsList, uid, options.roomId);
    return {
        itemsList,
        loadMoreItems,
        initialItemCount,
    };
};
exports.useHistoryMessageList = useHistoryMessageList;
