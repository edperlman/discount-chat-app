"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersFromRoomMessages = void 0;
const meteor_1 = require("meteor/meteor");
const mongo_1 = require("meteor/mongo");
const tracker_1 = require("meteor/tracker");
const RoomManager_1 = require("../../../../client/lib/RoomManager");
const tracker_2 = require("../../../../client/lib/tracker");
const client_1 = require("../../../models/client");
exports.usersFromRoomMessages = new mongo_1.Mongo.Collection(null);
meteor_1.Meteor.startup(() => {
    tracker_1.Tracker.autorun(() => {
        const uid = meteor_1.Meteor.userId();
        const rid = (0, tracker_2.asReactiveSource)((cb) => RoomManager_1.RoomManager.on('changed', cb), () => RoomManager_1.RoomManager.opened);
        const user = uid ? meteor_1.Meteor.users.findOne(uid, { fields: { username: 1 } }) : undefined;
        if (!rid || !user) {
            return;
        }
        exports.usersFromRoomMessages.remove({});
        const uniqueMessageUsersControl = {};
        client_1.Messages.find({
            rid,
            'u.username': { $ne: user.username },
            't': { $exists: false },
        }, {
            fields: {
                'u.username': 1,
                'u.name': 1,
                'u._id': 1,
                'ts': 1,
            },
            sort: { ts: -1 },
        })
            .fetch()
            .filter(({ u: { username } }) => {
            const notMapped = !uniqueMessageUsersControl[username];
            uniqueMessageUsersControl[username] = true;
            return notMapped;
        })
            .forEach(({ u: { username, name, _id }, ts }) => exports.usersFromRoomMessages.upsert(_id, {
            _id,
            username,
            name,
            ts,
        }));
    });
});
