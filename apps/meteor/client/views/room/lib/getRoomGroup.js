"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoomGroup = void 0;
const groupsDict = {
    l: 'live',
    v: 'voip',
    d: 'direct',
    p: 'group',
    c: 'channel',
};
const getRoomGroup = (room) => {
    var _a, _b;
    if (room.teamMain) {
        return 'team';
    }
    if (room.t === 'd' && ((_b = (_a = room.uids) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) > 2) {
        return 'direct_multiple';
    }
    return groupsDict[room.t];
};
exports.getRoomGroup = getRoomGroup;
