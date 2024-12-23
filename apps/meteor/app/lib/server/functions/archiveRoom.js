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
exports.archiveRoom = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const callbacks_1 = require("../../../../lib/callbacks");
const notifyListener_1 = require("../lib/notifyListener");
const archiveRoom = function (rid, user) {
    return __awaiter(this, void 0, void 0, function* () {
        yield models_1.Rooms.archiveById(rid);
        const archiveResponse = yield models_1.Subscriptions.archiveByRoomId(rid);
        if (archiveResponse.modifiedCount) {
            void (0, notifyListener_1.notifyOnSubscriptionChangedByRoomId)(rid);
        }
        yield core_services_1.Message.saveSystemMessage('room-archived', rid, '', user);
        const room = yield models_1.Rooms.findOneById(rid);
        yield callbacks_1.callbacks.run('afterRoomArchived', room, user);
        if (room) {
            void (0, notifyListener_1.notifyOnRoomChanged)(room);
        }
    });
};
exports.archiveRoom = archiveRoom;
