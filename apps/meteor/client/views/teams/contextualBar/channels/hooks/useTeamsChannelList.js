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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTeamsChannelList = void 0;
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_1 = require("react");
const useScrollableRecordList_1 = require("../../../../../hooks/lists/useScrollableRecordList");
const useComponentDidUpdate_1 = require("../../../../../hooks/useComponentDidUpdate");
const RecordList_1 = require("../../../../../lib/lists/RecordList");
const getConfig_1 = require("../../../../../lib/utils/getConfig");
const mapMessageFromApi_1 = require("../../../../../lib/utils/mapMessageFromApi");
const useTeamsChannelList = (options) => {
    const apiEndPoint = (0, ui_contexts_1.useEndpoint)('GET', '/v1/teams.listRooms');
    const [teamsChannelList, setTeamsChannelList] = (0, react_1.useState)(() => new RecordList_1.RecordList());
    const reload = (0, react_1.useCallback)(() => setTeamsChannelList(new RecordList_1.RecordList()), []);
    (0, useComponentDidUpdate_1.useComponentDidUpdate)(() => {
        options && reload();
    }, [options, reload]);
    const fetchData = (0, react_1.useCallback)((start, end) => __awaiter(void 0, void 0, void 0, function* () {
        const { rooms, total } = yield apiEndPoint({
            teamId: options.teamId,
            offset: start,
            count: end,
            filter: options.text,
            type: options.type,
        });
        return {
            items: rooms.map((_a) => {
                var { _updatedAt, lastMessage, lm, ts, webRtcCallStartTime, usersWaitingForE2EKeys } = _a, room = __rest(_a, ["_updatedAt", "lastMessage", "lm", "ts", "webRtcCallStartTime", "usersWaitingForE2EKeys"]);
                return (Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (lm && { lm: new Date(lm) })), (ts && { ts: new Date(ts) })), { _updatedAt: new Date(_updatedAt) }), (lastMessage && { lastMessage: (0, mapMessageFromApi_1.mapMessageFromApi)(lastMessage) })), (webRtcCallStartTime && { webRtcCallStartTime: new Date(webRtcCallStartTime) })), (usersWaitingForE2EKeys && usersWaitingForE2EKeys.map(({ userId, ts }) => ({ userId, ts: new Date(ts) })))), room));
            }),
            itemCount: total,
        };
    }), [apiEndPoint, options]);
    const { loadMoreItems, initialItemCount } = (0, useScrollableRecordList_1.useScrollableRecordList)(teamsChannelList, fetchData, (0, react_1.useMemo)(() => parseInt(`${(0, getConfig_1.getConfig)('teamsChannelListSize', 10)}`), []));
    return {
        reload,
        teamsChannelList,
        loadMoreItems,
        initialItemCount,
    };
};
exports.useTeamsChannelList = useTeamsChannelList;
