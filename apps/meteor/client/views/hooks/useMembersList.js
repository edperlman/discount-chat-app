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
exports.useMembersList = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const endpointsByRoomType = {
    d: '/v1/im.members',
    p: '/v1/groups.members',
    c: '/v1/channels.members',
};
const useMembersList = (options) => {
    const getMembers = (0, ui_contexts_1.useEndpoint)('GET', endpointsByRoomType[options.roomType]);
    return (0, react_query_1.useInfiniteQuery)([options.roomType, 'members', options.rid, options.type, options.debouncedText], (_a) => __awaiter(void 0, [_a], void 0, function* ({ pageParam }) {
        const start = pageParam !== null && pageParam !== void 0 ? pageParam : 0;
        return getMembers(Object.assign(Object.assign({ roomId: options.rid, offset: start, count: 20 }, (options.debouncedText && { filter: options.debouncedText })), (options.type !== 'all' && { status: [options.type] })));
    }), {
        getNextPageParam: (lastPage) => {
            const offset = lastPage.offset + lastPage.count;
            // if the offset is greater than the total, return undefined to stop the query from trying to fetch another page
            return offset >= lastPage.total ? undefined : offset;
        },
    });
};
exports.useMembersList = useMembersList;
