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
exports.useDiscussionsList = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const useScrollableMessageList_1 = require("../../../../hooks/lists/useScrollableMessageList");
const useStreamUpdatesForMessageList_1 = require("../../../../hooks/lists/useStreamUpdatesForMessageList");
const DiscussionsList_1 = require("../../../../lib/lists/DiscussionsList");
const getConfig_1 = require("../../../../lib/utils/getConfig");
const useDiscussionsList = (options, uid) => {
    if (!uid) {
        throw new Error('User ID is undefined. Cannot load discussions list');
    }
    const discussionsList = (0, react_1.useMemo)(() => new DiscussionsList_1.DiscussionsList(options), [options]);
    const getDiscussions = (0, ui_contexts_1.useEndpoint)('GET', '/v1/chat.getDiscussions');
    const fetchMessages = (0, react_1.useCallback)((start, end) => __awaiter(void 0, void 0, void 0, function* () {
        const { messages, total } = yield getDiscussions({
            roomId: options.rid,
            text: options.text,
            offset: start,
            count: end,
        });
        return {
            items: messages,
            itemCount: total,
        };
    }), [getDiscussions, options.rid, options.text]);
    const { loadMoreItems, initialItemCount } = (0, useScrollableMessageList_1.useScrollableMessageList)(discussionsList, fetchMessages, (0, react_1.useMemo)(() => parseInt(`${(0, getConfig_1.getConfig)('discussionListSize', 10)}`), []));
    (0, useStreamUpdatesForMessageList_1.useStreamUpdatesForMessageList)(discussionsList, uid, options.rid);
    return {
        discussionsList,
        loadMoreItems,
        initialItemCount,
    };
};
exports.useDiscussionsList = useDiscussionsList;
