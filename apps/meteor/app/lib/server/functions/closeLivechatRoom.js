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
exports.closeLivechatRoom = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const LivechatTyped_1 = require("../../../livechat/server/lib/LivechatTyped");
const notifyListener_1 = require("../lib/notifyListener");
const closeLivechatRoom = (user_1, roomId_1, _a) => __awaiter(void 0, [user_1, roomId_1, _a], void 0, function* (user, roomId, { comment, tags, generateTranscriptPdf, transcriptEmail, }) {
    const room = yield models_1.LivechatRooms.findOneById(roomId);
    if (!room || !(0, core_typings_1.isOmnichannelRoom)(room)) {
        throw new Error('error-invalid-room');
    }
    if (!room.open) {
        const { deletedCount } = yield models_1.Subscriptions.removeByRoomId(roomId, {
            onTrash(doc) {
                return __awaiter(this, void 0, void 0, function* () {
                    void (0, notifyListener_1.notifyOnSubscriptionChanged)(doc, 'removed');
                });
            },
        });
        if (deletedCount) {
            return;
        }
        throw new Error('error-room-already-closed');
    }
    const subscription = yield models_1.Subscriptions.findOneByRoomIdAndUserId(roomId, user._id, { projection: { _id: 1 } });
    if (!subscription && !(yield (0, hasPermission_1.hasPermissionAsync)(user._id, 'close-others-livechat-room'))) {
        throw new Error('error-not-authorized');
    }
    const options = Object.assign(Object.assign({ clientAction: true, tags }, (generateTranscriptPdf && { pdfTranscript: { requestedBy: user._id } })), (transcriptEmail && Object.assign({}, (transcriptEmail.sendToVisitor
        ? {
            emailTranscript: {
                sendToVisitor: true,
                requestData: {
                    email: transcriptEmail.requestData.email,
                    subject: transcriptEmail.requestData.subject,
                    requestedAt: new Date(),
                    requestedBy: user,
                },
            },
        }
        : {
            emailTranscript: {
                sendToVisitor: false,
            },
        }))));
    yield LivechatTyped_1.Livechat.closeRoom({
        room,
        user,
        options,
        comment,
    });
});
exports.closeLivechatRoom = closeLivechatRoom;
