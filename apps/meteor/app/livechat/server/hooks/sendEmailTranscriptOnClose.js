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
const sendTranscript_1 = require("../lib/sendTranscript");
const sendEmailTranscriptOnClose = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const { room, options } = params;
    if (!(0, core_typings_1.isOmnichannelRoom)(room)) {
        return params;
    }
    const { _id: rid, v: { token } = {} } = room;
    if (!token) {
        return params;
    }
    const transcriptData = resolveTranscriptData(room, options);
    if (!transcriptData) {
        return params;
    }
    const { email, subject, requestedBy: user } = transcriptData;
    yield Promise.all([(0, sendTranscript_1.sendTranscript)({ token, rid, email, subject, user }), models_1.LivechatRooms.unsetEmailTranscriptRequestedByRoomId(rid)]);
    delete room.transcriptRequest;
    return {
        room,
        options,
    };
});
const resolveTranscriptData = (room, options = {}) => {
    const { transcriptRequest: roomTranscriptRequest } = room;
    const { emailTranscript: optionsTranscriptRequest } = options;
    // Note: options.emailTranscript will override the room.transcriptRequest check
    // If options.emailTranscript is not set, then the room.transcriptRequest will be checked
    if (optionsTranscriptRequest === undefined) {
        return roomTranscriptRequest;
    }
    if (!optionsTranscriptRequest.sendToVisitor) {
        return undefined;
    }
    return optionsTranscriptRequest.requestData;
};
callbacks_1.callbacks.add('livechat.closeRoom', sendEmailTranscriptOnClose, callbacks_1.callbacks.priority.HIGH, 'livechat-send-email-transcript-on-close-room');
