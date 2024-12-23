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
exports.useSearchItems = void 0;
const string_helpers_1 = require("@rocket.chat/string-helpers");
const ui_contexts_1 = require("@rocket.chat/ui-contexts");
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("react");
const getConfig_1 = require("../../../lib/utils/getConfig");
const LIMIT = parseInt(String((0, getConfig_1.getConfig)('Sidebar_Search_Spotlight_LIMIT', 20)));
const options = {
    sort: {
        lm: -1,
        name: 1,
    },
    limit: LIMIT,
};
const useSearchItems = (filterText) => {
    const [, mention, name] = (0, react_1.useMemo)(() => filterText.match(/(@|#)?(.*)/i) || [], [filterText]);
    const query = (0, react_1.useMemo)(() => {
        const filterRegex = new RegExp((0, string_helpers_1.escapeRegExp)(name), 'i');
        return Object.assign({ $or: [{ name: filterRegex }, { fname: filterRegex }] }, (mention && {
            t: mention === '@' ? 'd' : { $ne: 'd' },
        }));
    }, [name, mention]);
    const localRooms = (0, ui_contexts_1.useUserSubscriptions)(query, options);
    const usernamesFromClient = [...localRooms === null || localRooms === void 0 ? void 0 : localRooms.map(({ t, name }) => (t === 'd' ? name : null))].filter(Boolean);
    const searchForChannels = mention === '#';
    const searchForDMs = mention === '@';
    const type = (0, react_1.useMemo)(() => {
        if (searchForChannels) {
            return { users: false, rooms: true, includeFederatedRooms: true };
        }
        if (searchForDMs) {
            return { users: true, rooms: false };
        }
        return { users: true, rooms: true, includeFederatedRooms: true };
    }, [searchForChannels, searchForDMs]);
    const getSpotlight = (0, ui_contexts_1.useMethod)('spotlight');
    return (0, react_query_1.useQuery)(['sidebar/search/spotlight', name, usernamesFromClient, type, localRooms.map(({ _id, name }) => _id + name)], () => __awaiter(void 0, void 0, void 0, function* () {
        if (localRooms.length === LIMIT) {
            return localRooms;
        }
        const spotlight = yield getSpotlight(name, usernamesFromClient, type);
        const filterUsersUnique = ({ _id }, index, arr) => index === arr.findIndex((user) => _id === user._id);
        const roomFilter = (room) => !localRooms.find((item) => {
            var _a;
            return (room.t === 'd' && room.uids && room.uids.length > 1 && ((_a = room.uids) === null || _a === void 0 ? void 0 : _a.includes(item._id))) ||
                [item.rid, item._id].includes(room._id);
        });
        const usersFilter = (user) => !localRooms.find((room) => { var _a; return room.t === 'd' && room.uids && ((_a = room.uids) === null || _a === void 0 ? void 0 : _a.length) === 2 && room.uids.includes(user._id); });
        const userMap = (user) => ({
            _id: user._id,
            t: 'd',
            name: user.username,
            fname: user.name,
            avatarETag: user.avatarETag,
        });
        const resultsFromServer = [];
        resultsFromServer.push(...spotlight.users.filter(filterUsersUnique).filter(usersFilter).map(userMap));
        resultsFromServer.push(...spotlight.rooms.filter(roomFilter));
        const exact = resultsFromServer === null || resultsFromServer === void 0 ? void 0 : resultsFromServer.filter((item) => [item.name, item.fname].includes(name));
        return Array.from(new Set([...exact, ...localRooms, ...resultsFromServer]));
    }), {
        staleTime: 60000,
        keepPreviousData: true,
        placeholderData: localRooms,
    });
};
exports.useSearchItems = useSearchItems;
