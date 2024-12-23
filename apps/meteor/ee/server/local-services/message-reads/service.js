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
exports.MessageReadsService = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const constants_1 = require("../../lib/constants");
const ReadReceipt_1 = require("../../lib/message-read-receipt/ReadReceipt");
class MessageReadsService extends core_services_1.ServiceClassInternal {
    constructor() {
        super(...arguments);
        this.name = 'message-reads';
    }
    readThread(userId, tmid) {
        return __awaiter(this, void 0, void 0, function* () {
            const read = yield models_1.MessageReads.findOneByUserIdAndThreadId(userId, tmid);
            const threadMessage = yield models_1.Messages.findOneById(tmid, { projection: { ts: 1, tlm: 1, rid: 1 } });
            if (!(threadMessage === null || threadMessage === void 0 ? void 0 : threadMessage.tlm)) {
                return;
            }
            yield models_1.MessageReads.updateReadTimestampByUserIdAndThreadId(userId, tmid);
            yield ReadReceipt_1.ReadReceipt.storeThreadMessagesReadReceipts(tmid, userId, (read === null || read === void 0 ? void 0 : read.ls) || threadMessage.ts);
            // doesn't mark as read if not all room members have read the thread
            const membersCount = yield models_1.Subscriptions.countUnarchivedByRoomId(threadMessage.rid);
            if (membersCount <= constants_1.MAX_ROOM_SIZE_CHECK_INDIVIDUAL_READ_RECEIPTS) {
                const subscriptions = yield models_1.Subscriptions.findUnarchivedByRoomId(threadMessage.rid, {
                    projection: { 'u._id': 1 },
                }).toArray();
                const members = subscriptions.map((s) => s.u._id);
                const totalMessageReads = yield models_1.MessageReads.countByThreadAndUserIds(tmid, members);
                if (totalMessageReads < membersCount) {
                    return;
                }
            }
            else {
                // for large rooms, mark as read if there are as many reads as room members to improve performance (instead of checking each read)
                const totalMessageReads = yield models_1.MessageReads.countByThreadId(tmid);
                if (totalMessageReads < membersCount) {
                    return;
                }
            }
            const firstRead = yield models_1.MessageReads.getMinimumLastSeenByThreadId(tmid);
            if (firstRead === null || firstRead === void 0 ? void 0 : firstRead.ls) {
                const result = yield models_1.Messages.setThreadMessagesAsRead(tmid, firstRead.ls);
                if (result.modifiedCount > 0) {
                    void core_services_1.api.broadcast('notify.messagesRead', { rid: threadMessage.rid, tmid, until: firstRead.ls });
                }
            }
        });
    }
}
exports.MessageReadsService = MessageReadsService;
