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
const rest_typings_1 = require("@rocket.chat/rest-typings");
const i18n_1 = require("../../../../../server/lib/i18n");
const server_1 = require("../../../../api/server");
const canSendMessage_1 = require("../../../../authorization/server/functions/canSendMessage");
const notifyListener_1 = require("../../../../lib/server/lib/notifyListener");
const server_2 = require("../../../../settings/server");
const LivechatTyped_1 = require("../../lib/LivechatTyped");
const livechat_1 = require("../lib/livechat");
server_1.API.v1.addRoute('livechat/webrtc.call', { authRequired: true, permissionsRequired: ['view-l-room'], validateParams: rest_typings_1.isGETWebRTCCall }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const room = yield (0, canSendMessage_1.canSendMessageAsync)(this.queryParams.rid, {
                uid: this.userId,
                username: this.user.username,
                type: this.user.type,
            }, {});
            if (!room) {
                throw new Error('invalid-room');
            }
            if (!(yield core_services_1.Omnichannel.isWithinMACLimit(room))) {
                throw new Error('error-mac-limit-reached');
            }
            const webrtcCallingAllowed = server_2.settings.get('WebRTC_Enabled') === true && server_2.settings.get('Omnichannel_call_provider') === 'WebRTC';
            if (!webrtcCallingAllowed) {
                throw new Error('webRTC calling not enabled');
            }
            const config = yield (0, livechat_1.settings)();
            if (!((_b = (_a = config.theme) === null || _a === void 0 ? void 0 : _a.actionLinks) === null || _b === void 0 ? void 0 : _b.webrtc)) {
                throw new Error('invalid-livechat-config');
            }
            let { callStatus } = room;
            if (!callStatus || callStatus === 'ended' || callStatus === 'declined') {
                const { value } = yield models_1.Settings.incrementValueById('WebRTC_Calls_Count', 1, { returnDocument: 'after' });
                if (value) {
                    void (0, notifyListener_1.notifyOnSettingChanged)(value);
                }
                callStatus = 'ringing';
                (yield models_1.Rooms.setCallStatusAndCallStartTime(room._id, callStatus)).modifiedCount && void (0, notifyListener_1.notifyOnRoomChangedById)(room._id);
                yield core_services_1.Message.saveSystemMessage('livechat_webrtc_video_call', room._id, i18n_1.i18n.t('Join_my_room_to_start_the_video_call'), this.user, {
                    actionLinks: config.theme.actionLinks.webrtc,
                });
            }
            const videoCall = {
                rid: room._id,
                provider: 'webrtc',
                callStatus,
            };
            return server_1.API.v1.success({ videoCall });
        });
    },
});
server_1.API.v1.addRoute('livechat/webrtc.call/:callId', { authRequired: true, permissionsRequired: ['view-l-room'], validateParams: rest_typings_1.isPUTWebRTCCallId }, {
    put() {
        return __awaiter(this, void 0, void 0, function* () {
            const { callId } = this.urlParams;
            const { rid, status } = this.bodyParams;
            const room = yield (0, canSendMessage_1.canSendMessageAsync)(rid, {
                uid: this.userId,
                username: this.user.username,
                type: this.user.type,
            }, {});
            if (!room) {
                throw new Error('invalid-room');
            }
            if (!(yield core_services_1.Omnichannel.isWithinMACLimit(room))) {
                throw new Error('error-mac-limit-reached');
            }
            const call = yield models_1.Messages.findOneById(callId);
            if (!call || call.t !== 'livechat_webrtc_video_call') {
                throw new Error('invalid-callId');
            }
            yield LivechatTyped_1.Livechat.updateCallStatus(callId, rid, status, this.user);
            return server_1.API.v1.success({ status });
        });
    },
});
