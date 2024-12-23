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
const callbacks_1 = require("../../../../../lib/callbacks");
const AutoCloseOnHoldScheduler_1 = require("../lib/AutoCloseOnHoldScheduler");
const logger_1 = require("../lib/logger");
const handleAfterOnHoldChatResumed = (room) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(room === null || room === void 0 ? void 0 : room._id)) {
        return room;
    }
    const { _id: roomId } = room;
    logger_1.cbLogger.debug(`Removing current on hold timers for room ${roomId}`);
    yield AutoCloseOnHoldScheduler_1.AutoCloseOnHoldScheduler.unscheduleRoom(roomId);
    return room;
});
callbacks_1.callbacks.add('livechat:afterOnHoldChatResumed', handleAfterOnHoldChatResumed, callbacks_1.callbacks.priority.HIGH, 'livechat-after-on-hold-chat-resumed');
