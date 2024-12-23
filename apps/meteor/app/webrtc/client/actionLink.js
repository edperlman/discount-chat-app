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
const actionLinks_1 = require("../../../client/lib/actionLinks");
const toast_1 = require("../../../client/lib/toast");
const client_1 = require("../../models/client");
const SDKClient_1 = require("../../utils/client/lib/SDKClient");
const i18n_1 = require("../../utils/lib/i18n");
actionLinks_1.actionLinks.register('joinLivechatWebRTCCall', (message) => {
    const room = client_1.Rooms.findOne({ _id: message.rid });
    if (!room) {
        throw new Error('Room not found');
    }
    const { callStatus, _id } = room;
    if (callStatus === 'declined' || callStatus === 'ended') {
        (0, toast_1.dispatchToastMessage)({ type: 'info', message: (0, i18n_1.t)('Call_Already_Ended') });
        return;
    }
    window.open(`/meet/${_id}`, _id);
});
actionLinks_1.actionLinks.register('endLivechatWebRTCCall', (message) => __awaiter(void 0, void 0, void 0, function* () {
    const room = client_1.Rooms.findOne({ _id: message.rid });
    if (!room) {
        throw new Error('Room not found');
    }
    const { callStatus, _id } = room;
    if (callStatus === 'declined' || callStatus === 'ended') {
        (0, toast_1.dispatchToastMessage)({ type: 'info', message: (0, i18n_1.t)('Call_Already_Ended') });
        return;
    }
    yield SDKClient_1.sdk.rest.put(`/v1/livechat/webrtc.call/${message._id}`, { rid: _id, status: 'ended' });
    SDKClient_1.sdk.publish('notify-room', [`${_id}/webrtc`, 'callStatus', { callStatus: 'ended' }]);
}));
