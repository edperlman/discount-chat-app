"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUidDirectMessage = void 0;
const meteor_1 = require("meteor/meteor");
const client_1 = require("../../../app/models/client");
const getUidDirectMessage = (rid, uid = meteor_1.Meteor.userId()) => {
    const room = client_1.Rooms.findOne({ _id: rid }, { fields: { t: 1, uids: 1 } });
    if (!room || room.t !== 'd' || !room.uids || room.uids.length > 2) {
        return undefined;
    }
    return room.uids.filter((_uid) => _uid !== uid)[0];
};
exports.getUidDirectMessage = getUidDirectMessage;
