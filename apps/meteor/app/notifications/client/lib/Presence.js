"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STATUS_MAP = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const meteor_1 = require("meteor/meteor");
const presence_1 = require("../../../../client/lib/presence");
// TODO implement API on Streamer to be able to listen to all streamed data
// this is a hacky way to listen to all streamed data from user-presence Streamer
new meteor_1.Meteor.Streamer('user-presence');
exports.STATUS_MAP = [core_typings_1.UserStatus.OFFLINE, core_typings_1.UserStatus.ONLINE, core_typings_1.UserStatus.AWAY, core_typings_1.UserStatus.BUSY, core_typings_1.UserStatus.DISABLED];
meteor_1.Meteor.StreamerCentral.on('stream-user-presence', (uid, [username, statusChanged, statusText]) => {
    presence_1.Presence.notify({ _id: uid, username, status: exports.STATUS_MAP[statusChanged], statusText });
});
