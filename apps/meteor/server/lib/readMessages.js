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
exports.readMessages = readMessages;
const models_1 = require("@rocket.chat/models");
const notifyListener_1 = require("../../app/lib/server/lib/notifyListener");
const callbacks_1 = require("../../lib/callbacks");
function readMessages(rid, uid, readThreads) {
    return __awaiter(this, void 0, void 0, function* () {
        yield callbacks_1.callbacks.run('beforeReadMessages', rid, uid);
        const projection = { ls: 1, tunread: 1, alert: 1, ts: 1 };
        const sub = yield models_1.Subscriptions.findOneByRoomIdAndUserId(rid, uid, { projection });
        if (!sub) {
            throw new Error('error-invalid-subscription');
        }
        // do not mark room as read if there are still unread threads
        const alert = !!(sub.alert && !readThreads && sub.tunread && sub.tunread.length > 0);
        const setAsReadResponse = yield models_1.Subscriptions.setAsReadByRoomIdAndUserId(rid, uid, readThreads, alert);
        if (setAsReadResponse.modifiedCount) {
            void (0, notifyListener_1.notifyOnSubscriptionChangedByRoomIdAndUserId)(rid, uid);
        }
        yield models_1.NotificationQueue.clearQueueByUserId(uid);
        const lastSeen = sub.ls || sub.ts;
        callbacks_1.callbacks.runAsync('afterReadMessages', rid, { uid, lastSeen });
    });
}
