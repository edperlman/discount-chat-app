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
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const callbacks_1 = require("../../../../lib/callbacks");
callbacks_1.callbacks.add('afterSaveMessage', (message_1, _a) => __awaiter(void 0, [message_1, _a], void 0, function* (message, { room }) {
    if (!(0, core_typings_1.isOmnichannelRoom)(room)) {
        return message;
    }
    const updater = models_1.LivechatRooms.getUpdater();
    const result = yield callbacks_1.callbacks.run('afterOmnichannelSaveMessage', message, { room, roomUpdater: updater });
    if (updater.hasChanges()) {
        yield models_1.LivechatRooms.updateFromUpdater({ _id: room._id }, updater);
    }
    return result;
}), callbacks_1.callbacks.priority.MEDIUM, 'after-omnichannel-save-message');