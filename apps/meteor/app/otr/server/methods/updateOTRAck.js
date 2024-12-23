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
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const canAccessRoom_1 = require("../../../authorization/server/functions/canAccessRoom");
meteor_1.Meteor.methods({
    updateOTRAck(_a) {
        return __awaiter(this, arguments, void 0, function* ({ message, ack }) {
            const uid = meteor_1.Meteor.userId();
            if (!uid) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'updateOTRAck' });
            }
            (0, check_1.check)(ack, String);
            (0, check_1.check)(message, {
                _id: String,
                rid: String,
                msg: String,
                t: String,
                ts: Date,
                u: {
                    _id: String,
                    username: String,
                    name: String,
                },
            });
            if ((message === null || message === void 0 ? void 0 : message.t) !== 'otr') {
                throw new meteor_1.Meteor.Error('error-invalid-message', 'Invalid message type', { method: 'updateOTRAck' });
            }
            const room = yield models_1.Rooms.findOneByIdAndType(message.rid, 'd', { projection: { t: 1, _id: 1, uids: 1 } });
            if (!room) {
                throw new meteor_1.Meteor.Error('error-invalid-room', 'Invalid room', { method: 'updateOTRAck' });
            }
            if (!(yield (0, canAccessRoom_1.canAccessRoomAsync)(room, { _id: uid })) || (room.uids && (!message.u._id || !room.uids.includes(message.u._id)))) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user, not in room', { method: 'updateOTRAck' });
            }
            const acknowledgeMessage = Object.assign(Object.assign({}, message), { otrAck: ack });
            void core_services_1.api.broadcast('otrAckUpdate', { roomId: message.rid, acknowledgeMessage });
        });
    },
});
