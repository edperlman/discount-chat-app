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
const models_1 = require("@rocket.chat/models");
const notifyListener_1 = require("../../../../../app/lib/server/lib/notifyListener");
const server_1 = require("../../../../../app/settings/server");
const callbacks_1 = require("../../../../../lib/callbacks");
const AutoCloseOnHoldScheduler_1 = require("../lib/AutoCloseOnHoldScheduler");
const Helper_1 = require("../lib/Helper");
const onCloseLivechat = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const { room, room: { _id: roomId }, } = params;
    const responses = yield Promise.all([
        models_1.LivechatRooms.unsetOnHoldByRoomId(roomId),
        models_1.Subscriptions.unsetOnHoldByRoomId(roomId),
        AutoCloseOnHoldScheduler_1.AutoCloseOnHoldScheduler.unscheduleRoom(roomId),
    ]);
    if (responses[1].modifiedCount) {
        void (0, notifyListener_1.notifyOnSubscriptionChangedByRoomId)(roomId);
    }
    if (!server_1.settings.get('Livechat_waiting_queue')) {
        return params;
    }
    const { departmentId } = room || {};
    (0, Helper_1.debouncedDispatchWaitingQueueStatus)(departmentId);
    return params;
});
callbacks_1.callbacks.add('livechat.closeRoom', (params) => onCloseLivechat(params), callbacks_1.callbacks.priority.HIGH, 'livechat-waiting-queue-monitor-close-room');
