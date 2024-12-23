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
const meteor_1 = require("meteor/meteor");
const tracker_1 = require("meteor/tracker");
const client_1 = require("../../app/models/client");
const client_2 = require("../../app/ui-utils/client");
const callWithErrorHandling_1 = require("../lib/utils/callWithErrorHandling");
const loadMissedMessages = function (rid) {
    return __awaiter(this, void 0, void 0, function* () {
        const lastMessage = client_1.Messages.findOne({ rid, _hidden: { $ne: true }, temp: { $exists: false } }, { sort: { ts: -1 }, limit: 1 });
        if (!lastMessage) {
            return;
        }
        try {
            const result = yield (0, callWithErrorHandling_1.callWithErrorHandling)('loadMissedMessages', rid, lastMessage.ts);
            if (result) {
                const subscription = client_1.Subscriptions.findOne({ rid });
                yield Promise.all(Array.from(result).map((msg) => (0, client_2.upsertMessage)({ msg, subscription })));
            }
        }
        catch (error) {
            console.error(error);
        }
    });
};
meteor_1.Meteor.startup(() => {
    let connectionWasOnline = true;
    tracker_1.Tracker.autorun(() => {
        const { connected } = meteor_1.Meteor.connection.status();
        if (connected === true && connectionWasOnline === false && client_2.LegacyRoomManager.openedRooms) {
            Object.keys(client_2.LegacyRoomManager.openedRooms).forEach((key) => {
                const value = client_2.LegacyRoomManager.openedRooms[key];
                if (value.rid) {
                    loadMissedMessages(value.rid);
                }
            });
        }
        connectionWasOnline = connected;
    });
});
