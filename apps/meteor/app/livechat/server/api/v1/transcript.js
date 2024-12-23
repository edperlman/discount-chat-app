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
const LivechatTyped_1 = require("../../lib/LivechatTyped");
const sendTranscript_1 = require("../../lib/sendTranscript");
server_1.API.v1.addRoute('livechat/transcript', { validateParams: rest_typings_1.isPOSTLivechatTranscriptParams }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { token, rid, email } = this.bodyParams;
            if (!(yield (0, sendTranscript_1.sendTranscript)({ token, rid, email }))) {
                return server_1.API.v1.failure({ message: i18n_1.i18n.t('Error_sending_livechat_transcript') });
            }
            return server_1.API.v1.success({ message: i18n_1.i18n.t('Livechat_transcript_sent') });
        });
    },
});
server_1.API.v1.addRoute('livechat/transcript/:rid', {
    authRequired: true,
    permissionsRequired: ['send-omnichannel-chat-transcript'],
    validateParams: {
        POST: rest_typings_1.isPOSTLivechatTranscriptRequestParams,
    },
}, {
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            const { rid } = this.urlParams;
            const room = yield models_1.LivechatRooms.findOneById(rid, {
                projection: { open: 1, transcriptRequest: 1, v: 1 },
            });
            if (!(room === null || room === void 0 ? void 0 : room.open)) {
                throw new Error('error-invalid-room');
            }
            if (!room.transcriptRequest) {
                throw new Error('error-transcript-not-requested');
            }
            if (!(yield core_services_1.Omnichannel.isWithinMACLimit(room))) {
                throw new Error('error-mac-limit-reached');
            }
            yield models_1.LivechatRooms.unsetEmailTranscriptRequestedByRoomId(rid);
            return server_1.API.v1.success();
        });
    },
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { rid } = this.urlParams;
            const { email, subject } = this.bodyParams;
            const user = yield models_1.Users.findOneById(this.userId, {
                projection: { _id: 1, username: 1, name: 1, utcOffset: 1 },
            });
            if (!user) {
                throw new Error('error-invalid-user');
            }
            yield LivechatTyped_1.Livechat.requestTranscript({ rid, email, subject, user });
            return server_1.API.v1.success();
        });
    },
});
