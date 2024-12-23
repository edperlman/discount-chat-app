"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const meteor_1 = require("meteor/meteor");
const client_1 = require("../../app/models/client");
const client_2 = require("../../app/ui-utils/client");
meteor_1.Meteor.startup(() => {
    client_1.Messages.find().observe({
        removed(record) {
            if (!client_2.LegacyRoomManager.getOpenedRoomByRid(record.rid)) {
                return;
            }
            const recordBefore = client_1.Messages.findOne({ ts: { $lt: record.ts } }, { sort: { ts: -1 } });
            if (recordBefore) {
                client_1.Messages.update({ _id: recordBefore._id }, { $set: { tick: new Date() } });
            }
            const recordAfter = client_1.Messages.findOne({ ts: { $gt: record.ts } }, { sort: { ts: 1 } });
            if (recordAfter) {
                return client_1.Messages.update({ _id: recordAfter._id }, { $set: { tick: new Date() } });
            }
        },
    });
});
