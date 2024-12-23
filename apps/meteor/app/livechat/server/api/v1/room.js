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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_services_1 = require("@rocket.chat/core-services");
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const rest_typings_1 = require("@rocket.chat/rest-typings");
const check_1 = require("meteor/check");
const callbacks_1 = require("../../../../../lib/callbacks");
const i18n_1 = require("../../../../../server/lib/i18n");
const server_1 = require("../../../../api/server");
const isWidget_1 = require("../../../../api/server/helpers/isWidget");
const server_2 = require("../../../../authorization/server");
const hasPermission_1 = require("../../../../authorization/server/functions/hasPermission");
const addUserToRoom_1 = require("../../../../lib/server/functions/addUserToRoom");
const closeLivechatRoom_1 = require("../../../../lib/server/functions/closeLivechatRoom");
const server_3 = require("../../../../settings/server");
const Helper_1 = require("../../lib/Helper");
const LivechatTyped_1 = require("../../lib/LivechatTyped");
const livechat_1 = require("../lib/livechat");
const isAgentWithInfo = (agentObj) => !('hiddenInfo' in agentObj);
server_1.API.v1.addRoute('livechat/room', {
    rateLimiterOptions: {
        numRequestsAllowed: 5,
        intervalTimeInMS: 60000,
    },
}, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            // I'll temporary use check for validation, as validateParams doesnt support what's being done here
            const extraCheckParams = yield (0, livechat_1.onCheckRoomParams)({
                token: String,
                rid: Match.Maybe(String),
                agentId: Match.Maybe(String),
            });
            (0, check_1.check)(this.queryParams, extraCheckParams);
            const _a = this.queryParams, { token, rid, agentId } = _a, extraParams = __rest(_a, ["token", "rid", "agentId"]);
            const guest = token && (yield (0, livechat_1.findGuest)(token));
            if (!guest) {
                throw new Error('invalid-token');
            }
            if (!rid) {
                const room = yield models_1.LivechatRooms.findOneOpenByVisitorToken(token, {});
                if (room) {
                    return server_1.API.v1.success({ room, newRoom: false });
                }
                let agent;
                const agentObj = agentId && (yield (0, livechat_1.findAgent)(agentId));
                if (agentObj) {
                    if (isAgentWithInfo(agentObj)) {
                        const { username = undefined } = agentObj;
                        agent = { agentId, username };
                    }
                    else {
                        agent = { agentId };
                    }
                }
                const roomInfo = {
                    source: Object.assign({}, ((0, isWidget_1.isWidget)(this.request.headers)
                        ? { type: core_typings_1.OmnichannelSourceType.WIDGET, destination: this.request.headers.host }
                        : { type: core_typings_1.OmnichannelSourceType.API })),
                };
                const newRoom = yield LivechatTyped_1.Livechat.createRoom({
                    visitor: guest,
                    roomInfo,
                    agent,
                    extraData: extraParams,
                });
                return server_1.API.v1.success({
                    room: newRoom,
                    newRoom: true,
                });
            }
            const froom = yield models_1.LivechatRooms.findOneOpenByRoomIdAndVisitorToken(rid, token, {});
            if (!froom) {
                throw new Error('invalid-room');
            }
            return server_1.API.v1.success({ room: froom, newRoom: false });
        });
    },
});
// Note: use this route if a visitor is closing a room
// If a RC user(like eg agent) is closing a room, use the `livechat/room.closeByUser` route
server_1.API.v1.addRoute('livechat/room.close', { validateParams: rest_typings_1.isPOSTLivechatRoomCloseParams }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            const { rid, token } = this.bodyParams;
            if (!server_3.settings.get('Omnichannel_allow_visitors_to_close_conversation')) {
                throw new Error('error-not-allowed-to-close-conversation');
            }
            const visitor = yield (0, livechat_1.findGuest)(token);
            if (!visitor) {
                throw new Error('invalid-token');
            }
            const room = yield (0, livechat_1.findRoom)(token, rid);
            if (!room) {
                throw new Error('invalid-room');
            }
            if (!room.open) {
                throw new Error('room-closed');
            }
            const language = server_3.settings.get('Language') || 'en';
            const comment = i18n_1.i18n.t('Closed_by_visitor', { lng: language });
            const options = {};
            if (room.servedBy) {
                const servingAgent = yield models_1.Users.findOneById(room.servedBy._id, {
                    projection: {
                        name: 1,
                        username: 1,
                        utcOffset: 1,
                        settings: 1,
                        language: 1,
                    },
                });
                if ((_b = (_a = servingAgent === null || servingAgent === void 0 ? void 0 : servingAgent.settings) === null || _a === void 0 ? void 0 : _a.preferences) === null || _b === void 0 ? void 0 : _b.omnichannelTranscriptPDF) {
                    options.pdfTranscript = {
                        requestedBy: servingAgent._id,
                    };
                }
                // We'll send the transcript by email only if the setting is disabled (that means, we're not asking the user if he wants to receive the transcript by email)
                // And the agent has the preference enabled to send the transcript by email and the visitor has an email address
                // When Livechat_enable_transcript is enabled, the email will be sent via livechat/transcript route
                if (!server_3.settings.get('Livechat_enable_transcript') &&
                    ((_d = (_c = servingAgent === null || servingAgent === void 0 ? void 0 : servingAgent.settings) === null || _c === void 0 ? void 0 : _c.preferences) === null || _d === void 0 ? void 0 : _d.omnichannelTranscriptEmail) &&
                    ((_e = visitor.visitorEmails) === null || _e === void 0 ? void 0 : _e.length) &&
                    ((_g = (_f = visitor.visitorEmails) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.address)) {
                    const visitorEmail = (_j = (_h = visitor.visitorEmails) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.address;
                    const language = servingAgent.language || server_3.settings.get('Language') || 'en';
                    const t = i18n_1.i18n.getFixedT(language);
                    const subject = t('Transcript_of_your_livechat_conversation');
                    options.emailTranscript = {
                        sendToVisitor: true,
                        requestData: {
                            email: visitorEmail,
                            requestedAt: new Date(),
                            requestedBy: servingAgent,
                            subject,
                        },
                    };
                }
            }
            yield LivechatTyped_1.Livechat.closeRoom({ visitor, room, comment, options });
            return server_1.API.v1.success({ rid, comment });
        });
    },
});
server_1.API.v1.addRoute('livechat/room.closeByUser', {
    validateParams: rest_typings_1.isPOSTLivechatRoomCloseByUserParams,
    authRequired: true,
    permissionsRequired: ['close-livechat-room'],
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { rid, comment, tags, generateTranscriptPdf, transcriptEmail } = this.bodyParams;
            yield (0, closeLivechatRoom_1.closeLivechatRoom)(this.user, rid, { comment, tags, generateTranscriptPdf, transcriptEmail });
            return server_1.API.v1.success();
        });
    },
});
server_1.API.v1.addRoute('livechat/room.transfer', { validateParams: rest_typings_1.isPOSTLivechatRoomTransferParams, deprecation: { version: '7.0.0' } }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { rid, token, department } = this.bodyParams;
            const guest = yield (0, livechat_1.findGuest)(token);
            if (!guest) {
                throw new Error('invalid-token');
            }
            let room = yield (0, livechat_1.findRoom)(token, rid);
            if (!room) {
                throw new Error('invalid-room');
            }
            // update visited page history to not expire
            yield models_1.Messages.keepHistoryForToken(token);
            const { _id, username, name } = guest;
            const transferredBy = (0, Helper_1.normalizeTransferredByData)({ _id, username, name, userType: 'visitor' }, room);
            if (!(yield LivechatTyped_1.Livechat.transfer(room, guest, { departmentId: department, transferredBy }))) {
                return server_1.API.v1.failure();
            }
            room = yield (0, livechat_1.findRoom)(token, rid);
            if (!room) {
                throw new Error('invalid-room');
            }
            return server_1.API.v1.success({ room });
        });
    },
});
server_1.API.v1.addRoute('livechat/room.survey', { validateParams: rest_typings_1.isPOSTLivechatRoomSurveyParams }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { rid, token, data } = this.bodyParams;
            const visitor = yield (0, livechat_1.findGuest)(token);
            if (!visitor) {
                throw new Error('invalid-token');
            }
            const room = yield (0, livechat_1.findRoom)(token, rid);
            if (!room) {
                throw new Error('invalid-room');
            }
            const config = yield (0, livechat_1.settings)();
            if (!((_a = config.survey) === null || _a === void 0 ? void 0 : _a.items) || !config.survey.values) {
                throw new Error('invalid-livechat-config');
            }
            const updateData = {};
            for (const item of data) {
                if ((config.survey.items.includes(item.name) && config.survey.values.includes(item.value)) || item.name === 'additionalFeedback') {
                    updateData[item.name] = item.value;
                }
            }
            if (Object.keys(updateData).length === 0) {
                throw new Error('invalid-data');
            }
            if (!(yield models_1.LivechatRooms.updateSurveyFeedbackById(room._id, updateData))) {
                return server_1.API.v1.failure();
            }
            return server_1.API.v1.success({ rid, data: updateData });
        });
    },
});
server_1.API.v1.addRoute('livechat/room.forward', { authRequired: true, permissionsRequired: ['view-l-room', 'transfer-livechat-guest'], validateParams: rest_typings_1.isLiveChatRoomForwardProps }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const transferData = this.bodyParams;
            const room = yield models_1.LivechatRooms.findOneById(this.bodyParams.roomId);
            if (!room || room.t !== 'l') {
                throw new Error('error-invalid-room');
            }
            if (!room.open) {
                throw new Error('This_conversation_is_already_closed');
            }
            if (!(yield core_services_1.Omnichannel.isWithinMACLimit(room))) {
                throw new Error('error-mac-limit-reached');
            }
            const guest = yield models_1.LivechatVisitors.findOneEnabledById((_a = room.v) === null || _a === void 0 ? void 0 : _a._id);
            if (!guest) {
                throw new Error('error-invalid-visitor');
            }
            transferData.transferredBy = (0, Helper_1.normalizeTransferredByData)(this.user, room);
            if (transferData.userId) {
                const userToTransfer = yield models_1.Users.findOneById(transferData.userId);
                if (userToTransfer) {
                    transferData.transferredTo = {
                        _id: userToTransfer._id,
                        username: userToTransfer.username,
                        name: userToTransfer.name,
                    };
                }
            }
            const chatForwardedResult = yield LivechatTyped_1.Livechat.transfer(room, guest, transferData);
            if (!chatForwardedResult) {
                throw new Error('error-forwarding-chat');
            }
            return server_1.API.v1.success();
        });
    },
});
server_1.API.v1.addRoute('livechat/room.join', { authRequired: true, permissionsRequired: ['view-l-room'], validateParams: rest_typings_1.isLiveChatRoomJoinProps }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { roomId } = this.queryParams;
            const { user } = this;
            if (!user) {
                throw new Error('error-invalid-user');
            }
            const room = yield models_1.LivechatRooms.findOneById(roomId);
            if (!room) {
                throw new Error('error-invalid-room');
            }
            if (!room.open) {
                throw new Error('room-closed');
            }
            if (!(yield core_services_1.Omnichannel.isWithinMACLimit(room))) {
                throw new Error('error-mac-limit-reached');
            }
            if (!(yield (0, server_2.canAccessRoomAsync)(room, user))) {
                throw new Error('error-not-allowed');
            }
            yield (0, addUserToRoom_1.addUserToRoom)(roomId, user);
            return server_1.API.v1.success();
        });
    },
});
server_1.API.v1.addRoute('livechat/room.saveInfo', { authRequired: true, permissionsRequired: ['view-l-room'], validateParams: rest_typings_1.isLiveChatRoomSaveInfoProps }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { roomData, guestData } = this.bodyParams;
            const room = yield models_1.LivechatRooms.findOneById(roomData._id);
            if (!room || !(0, core_typings_1.isOmnichannelRoom)(room)) {
                throw new Error('error-invalid-room');
            }
            if ((!room.servedBy || room.servedBy._id !== this.userId) &&
                !(yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'save-others-livechat-room-info'))) {
                return server_1.API.v1.unauthorized();
            }
            if (room.sms) {
                delete guestData.phone;
            }
            // We want this both operations to be concurrent, so we have to go with Promise.allSettled
            const result = yield Promise.allSettled([LivechatTyped_1.Livechat.saveGuest(guestData, this.userId), LivechatTyped_1.Livechat.saveRoomInfo(roomData)]);
            const firstError = result.find((item) => item.status === 'rejected');
            if (firstError) {
                throw new Error(firstError.reason.error);
            }
            yield callbacks_1.callbacks.run('livechat.saveInfo', yield models_1.LivechatRooms.findOneById(roomData._id), {
                user: this.user,
                oldRoom: room,
            });
            return server_1.API.v1.success();
        });
    },
});
