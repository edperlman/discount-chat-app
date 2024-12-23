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
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const canAccessRoom_1 = require("../../../authorization/server/functions/canAccessRoom");
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
meteor_1.Meteor.methods({
    'e2e.setRoomKeyID'(rid, keyID) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(rid, String);
            (0, check_1.check)(keyID, String);
            const userId = meteor_1.Meteor.userId();
            if (!userId) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'e2e.setRoomKeyID' });
            }
            if (!rid) {
                throw new meteor_1.Meteor.Error('error-invalid-room', 'Invalid room', { method: 'e2e.setRoomKeyID' });
            }
            if (!(yield (0, canAccessRoom_1.canAccessRoomIdAsync)(rid, userId))) {
                throw new meteor_1.Meteor.Error('error-invalid-room', 'Invalid room', { method: 'e2e.setRoomKeyID' });
            }
            const room = yield models_1.Rooms.findOneById(rid, { projection: { e2eKeyId: 1 } });
            if (!room) {
                throw new meteor_1.Meteor.Error('error-invalid-room', 'Invalid room', { method: 'e2e.setRoomKeyID' });
            }
            if (room.e2eKeyId) {
                throw new meteor_1.Meteor.Error('error-room-e2e-key-already-exists', 'E2E Key ID already exists', {
                    method: 'e2e.setRoomKeyID',
                });
            }
            yield models_1.Rooms.setE2eKeyId(room._id, keyID);
            void (0, notifyListener_1.notifyOnRoomChangedById)(room._id);
        });
    },
});
