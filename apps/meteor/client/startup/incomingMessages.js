"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const meteor_1 = require("meteor/meteor");
const client_1 = require("../../app/models/client");
const SDKClient_1 = require("../../app/utils/client/lib/SDKClient");
const loggedIn_1 = require("../lib/loggedIn");
meteor_1.Meteor.startup(() => {
    (0, loggedIn_1.onLoggedIn)(() => {
        // Only event I found triggers this is from ephemeral messages
        // Other types of messages come from another stream
        return SDKClient_1.sdk.stream('notify-user', [`${meteor_1.Meteor.userId()}/message`], (msg) => {
            msg.u = msg.u || { username: 'rocket.cat' };
            msg.private = true;
            return client_1.Messages.upsert({ _id: msg._id }, msg);
        });
    });
    (0, loggedIn_1.onLoggedIn)(() => {
        return SDKClient_1.sdk.stream('notify-user', [`${meteor_1.Meteor.userId()}/subscriptions-changed`], (_action, sub) => {
            client_1.Messages.update(Object.assign({ rid: sub.rid }, ('ignored' in sub && sub.ignored ? { 'u._id': { $nin: sub.ignored } } : { ignored: { $exists: true } })), { $unset: { ignored: true } }, { multi: true });
            if ('ignored' in sub && sub.ignored) {
                client_1.Messages.update({ 'rid': sub.rid, 't': { $ne: 'command' }, 'u._id': { $in: sub.ignored } }, { $set: { ignored: true } }, { multi: true });
            }
        });
    });
});
