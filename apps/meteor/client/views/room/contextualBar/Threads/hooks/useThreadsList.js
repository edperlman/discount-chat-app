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
exports.useThreadsList = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const useScrollableMessageList_1 = require("../../../../../hooks/lists/useScrollableMessageList");
const useStreamUpdatesForMessageList_1 = require("../../../../../hooks/lists/useStreamUpdatesForMessageList");
const ThreadsList_1 = require("../../../../../lib/lists/ThreadsList");
const getConfig_1 = require("../../../../../lib/utils/getConfig");
const useThreadsList = (options, uid) => {
    const threadsList = (0, react_1.useMemo)(() => new ThreadsList_1.ThreadsList(options), [options]);
    const getThreadsList = (0, ui_contexts_1.useEndpoint)('GET', '/v1/chat.getThreadsList');
    const fetchMessages = (0, react_1.useCallback)((start, end) => __awaiter(void 0, void 0, void 0, function* () {
        const { threads, total } = yield getThreadsList({
            rid: options.rid,
            type: options.type,
            text: options.text,
            offset: start,
            count: end,
        });
        return {
            items: threads,
            itemCount: total,
        };
    }), [getThreadsList, options.rid, options.text, options.type]);
    const { loadMoreItems, initialItemCount } = (0, useScrollableMessageList_1.useScrollableMessageList)(threadsList, fetchMessages, (0, react_1.useMemo)(() => parseInt(`${(0, getConfig_1.getConfig)('threadsListSize', 10)}`), []));
    (0, useStreamUpdatesForMessageList_1.useStreamUpdatesForMessageList)(threadsList, uid, options.rid);
    return {
        threadsList,
        loadMoreItems,
        initialItemCount,
    };
};
exports.useThreadsList = useThreadsList;
