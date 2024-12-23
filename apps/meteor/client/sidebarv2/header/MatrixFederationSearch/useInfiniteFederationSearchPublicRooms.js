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
exports.useInfiniteFederationSearchPublicRooms = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const tenMinutes = 10 * 60 * 1000;
const useInfiniteFederationSearchPublicRooms = (serverName, roomName, count) => {
    const fetchRoomList = (0, ui_contexts_1.useEndpoint)('GET', '/v1/federation/searchPublicRooms');
    return (0, react_query_1.useInfiniteQuery)(['federation/searchPublicRooms', serverName, roomName, count], (_a) => __awaiter(void 0, [_a], void 0, function* ({ pageParam }) { return fetchRoomList({ serverName, roomName, count, pageToken: pageParam }); }), {
        getNextPageParam: (lastPage) => lastPage.nextPageToken,
        useErrorBoundary: true,
        staleTime: tenMinutes,
        cacheTime: tenMinutes,
    });
};
exports.useInfiniteFederationSearchPublicRooms = useInfiniteFederationSearchPublicRooms;
