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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultChannels = getDefaultChannels;
const models_1 = require("@rocket.chat/models");
function getDefaultChannels() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        const defaultRooms = yield models_1.Rooms.findByDefaultAndTypes(true, ['c', 'p'], {
            projection: { usernames: 0 },
        }).toArray();
        const roomsThatAreGoingToBeJoined = new Set(defaultRooms.map((room) => room._id));
        // If any of those are teams, we need to get all the channels that have the auto-join flag as well
        const teamRooms = defaultRooms.filter((room) => room.teamMain && room.teamId);
        if (teamRooms.length > 0) {
            try {
                for (var _d = true, teamRooms_1 = __asyncValues(teamRooms), teamRooms_1_1; teamRooms_1_1 = yield teamRooms_1.next(), _a = teamRooms_1_1.done, !_a; _d = true) {
                    _c = teamRooms_1_1.value;
                    _d = false;
                    const teamRoom = _c;
                    const defaultTeamRooms = yield models_1.Rooms.findDefaultRoomsForTeam(teamRoom.teamId).toArray();
                    const defaultTeamRoomsThatWereNotAlreadyAdded = defaultTeamRooms.filter((channel) => !roomsThatAreGoingToBeJoined.has(channel._id));
                    defaultTeamRoomsThatWereNotAlreadyAdded.forEach((channel) => roomsThatAreGoingToBeJoined.add(channel._id));
                    // Add the channels to the defaultRooms list
                    defaultRooms.push(...defaultTeamRoomsThatWereNotAlreadyAdded);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = teamRooms_1.return)) yield _b.call(teamRooms_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        return defaultRooms;
    });
}
