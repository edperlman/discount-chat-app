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
exports.unarchiveRoom = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const notifyListener_1 = require("../lib/notifyListener");
const unarchiveRoom = function (rid, user) {
    return __awaiter(this, void 0, void 0, function* () {
        yield models_1.Rooms.unarchiveById(rid);
        const unarchiveResponse = yield models_1.Subscriptions.unarchiveByRoomId(rid);
        if (unarchiveResponse.modifiedCount) {
            void (0, notifyListener_1.notifyOnSubscriptionChangedByRoomId)(rid);
        }
        yield core_services_1.Message.saveSystemMessage('room-unarchived', rid, '', user);
        void (0, notifyListener_1.notifyOnRoomChangedById)(rid);
    });
};
exports.unarchiveRoom = unarchiveRoom;
