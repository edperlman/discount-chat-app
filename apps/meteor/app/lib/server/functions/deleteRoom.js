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
exports.deleteRoom = void 0;
const models_1 = require("@rocket.chat/models");
const callbacks_1 = require("../../../../lib/callbacks");
const server_1 = require("../../../file-upload/server");
const notifyListener_1 = require("../lib/notifyListener");
const deleteRoom = function (rid) {
    return __awaiter(this, void 0, void 0, function* () {
        yield server_1.FileUpload.removeFilesByRoomId(rid);
        yield models_1.Messages.removeByRoomId(rid);
        yield callbacks_1.callbacks.run('beforeDeleteRoom', rid);
        yield models_1.Subscriptions.removeByRoomId(rid, {
            onTrash(doc) {
                return __awaiter(this, void 0, void 0, function* () {
                    void (0, notifyListener_1.notifyOnSubscriptionChanged)(doc, 'removed');
                });
            },
        });
        yield server_1.FileUpload.getStore('Avatars').deleteByRoomId(rid);
        yield callbacks_1.callbacks.run('afterDeleteRoom', rid);
        const { deletedCount } = yield models_1.Rooms.removeById(rid);
        if (deletedCount) {
            void (0, notifyListener_1.notifyOnRoomChangedById)(rid, 'removed');
        }
    });
};
exports.deleteRoom = deleteRoom;
