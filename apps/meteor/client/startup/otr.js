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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_typings_1 = require("@rocket.chat/core-typings");
const meteor_1 = require("meteor/meteor");
const tracker_1 = require("meteor/tracker");
const OTR_1 = __importDefault(require("../../app/otr/client/OTR"));
const OtrRoomState_1 = require("../../app/otr/lib/OtrRoomState");
const SDKClient_1 = require("../../app/utils/client/lib/SDKClient");
const i18n_1 = require("../../app/utils/lib/i18n");
const onClientBeforeSendMessage_1 = require("../lib/onClientBeforeSendMessage");
const onClientMessageReceived_1 = require("../lib/onClientMessageReceived");
meteor_1.Meteor.startup(() => {
    tracker_1.Tracker.autorun(() => {
        const uid = meteor_1.Meteor.userId();
        if (!uid) {
            return;
        }
        SDKClient_1.sdk.stream('notify-user', [`${uid}/otr`], (type, data) => {
            if (!data.roomId || !data.userId || data.userId === uid) {
                return;
            }
            const otrRoom = OTR_1.default.getInstanceByRoomId(uid, data.roomId);
            otrRoom === null || otrRoom === void 0 ? void 0 : otrRoom.onUserStream(type, data);
        });
    });
    onClientBeforeSendMessage_1.onClientBeforeSendMessage.use((message) => __awaiter(void 0, void 0, void 0, function* () {
        const uid = meteor_1.Meteor.userId();
        if (!uid) {
            return message;
        }
        const otrRoom = OTR_1.default.getInstanceByRoomId(uid, message.rid);
        if (otrRoom && otrRoom.getState() === OtrRoomState_1.OtrRoomState.ESTABLISHED) {
            const msg = yield otrRoom.encrypt(message);
            return Object.assign(Object.assign({}, message), { msg, t: 'otr' });
        }
        return message;
    }));
    onClientMessageReceived_1.onClientMessageReceived.use((message) => __awaiter(void 0, void 0, void 0, function* () {
        const uid = meteor_1.Meteor.userId();
        if (!uid) {
            return message;
        }
        if (!(0, core_typings_1.isOTRMessage)(message)) {
            return message;
        }
        if ('notification' in message) {
            return Object.assign(Object.assign({}, message), { msg: (0, i18n_1.t)('Encrypted_message') });
        }
        const otrRoom = OTR_1.default.getInstanceByRoomId(uid, message.rid);
        if (otrRoom && otrRoom.getState() === OtrRoomState_1.OtrRoomState.ESTABLISHED) {
            const decrypted = yield otrRoom.decrypt(message.msg);
            if (typeof decrypted === 'string') {
                return Object.assign(Object.assign({}, message), { msg: decrypted });
            }
            const { _id, text: msg, ack, ts, userId } = decrypted;
            if (ts)
                message.ts = ts;
            if (message.otrAck) {
                const otrAck = yield otrRoom.decrypt(message.otrAck);
                if (typeof otrAck === 'string') {
                    return Object.assign(Object.assign({}, message), { msg: otrAck });
                }
                if (ack === otrAck.text) {
                    return Object.assign(Object.assign({}, message), { _id, t: 'otr-ack', msg });
                }
            }
            else if (userId !== meteor_1.Meteor.userId()) {
                const encryptedAck = yield otrRoom.encryptText(ack);
                void SDKClient_1.sdk.call('updateOTRAck', { message, ack: encryptedAck });
            }
            return Object.assign(Object.assign({}, message), { _id, msg });
        }
        if (message.t === 'otr')
            message.msg = '';
        return message;
    }));
});
