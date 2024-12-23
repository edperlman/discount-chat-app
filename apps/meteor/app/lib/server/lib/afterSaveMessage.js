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
exports.afterSaveMessage = afterSaveMessage;
exports.afterSaveMessageAsync = afterSaveMessageAsync;
const models_1 = require("@rocket.chat/models");
const callbacks_1 = require("../../../../lib/callbacks");
function afterSaveMessage(message, room, uid, roomUpdater) {
    return __awaiter(this, void 0, void 0, function* () {
        const updater = roomUpdater !== null && roomUpdater !== void 0 ? roomUpdater : models_1.Rooms.getUpdater();
        const data = yield callbacks_1.callbacks.run('afterSaveMessage', message, { room, uid, roomUpdater: updater });
        if (!roomUpdater && updater.hasChanges()) {
            yield models_1.Rooms.updateFromUpdater({ _id: room._id }, updater);
        }
        // TODO: Fix type - callback configuration needs to be updated
        return data;
    });
}
function afterSaveMessageAsync(message, room, uid, roomUpdater = models_1.Rooms.getUpdater()) {
    callbacks_1.callbacks.runAsync('afterSaveMessage', message, { room, uid, roomUpdater });
    if (roomUpdater.hasChanges()) {
        void models_1.Rooms.updateFromUpdater({ _id: room._id }, roomUpdater);
    }
}
