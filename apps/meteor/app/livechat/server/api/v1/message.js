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
const random_1 = require("@rocket.chat/random");
const rest_typings_1 = require("@rocket.chat/rest-typings");
const callbacks_1 = require("../../../../../lib/callbacks");
const server_1 = require("../../../../api/server");
const getPaginationItems_1 = require("../../../../api/server/helpers/getPaginationItems");
const isWidget_1 = require("../../../../api/server/helpers/isWidget");
const loadMessageHistory_1 = require("../../../../lib/server/functions/loadMessageHistory");
const server_2 = require("../../../../settings/server");
const normalizeMessageFileUpload_1 = require("../../../../utils/server/functions/normalizeMessageFileUpload");
const LivechatTyped_1 = require("../../lib/LivechatTyped");
const livechat_1 = require("../lib/livechat");
server_1.API.v1.addRoute('livechat/message', { validateParams: rest_typings_1.isPOSTLivechatMessageParams }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { token, rid, agent, msg } = this.bodyParams;
            const guest = yield (0, livechat_1.findGuest)(token);
            if (!guest) {
                throw new Error('invalid-token');
            }
            const room = yield (0, livechat_1.findRoom)(token, rid);
            if (!room) {
                throw new Error('invalid-room');
            }
            if (!room.open) {
                throw new Error('room-closed');
            }
            if (server_2.settings.get('Livechat_enable_message_character_limit') &&
                msg.length > parseInt(server_2.settings.get('Livechat_message_character_limit'))) {
                throw new Error('message-length-exceeds-character-limit');
            }
            const _id = this.bodyParams._id || random_1.Random.id();
            const sendMessage = {
                guest,
                message: {
                    _id,
                    rid,
                    msg,
                    token,
                },
                agent,
                roomInfo: {
                    source: {
                        type: (0, isWidget_1.isWidget)(this.request.headers) ? core_typings_1.OmnichannelSourceType.WIDGET : core_typings_1.OmnichannelSourceType.API,
                    },
                },
            };
            const result = yield LivechatTyped_1.Livechat.sendMessage(sendMessage);
            if (result) {
                const message = yield models_1.Messages.findOneById(_id);
                if (!message) {
                    return server_1.API.v1.failure();
                }
                return server_1.API.v1.success({ message });
            }
            return server_1.API.v1.failure();
        });
    },
});
server_1.API.v1.addRoute('livechat/message/:_id', { validateParams: { GET: rest_typings_1.isGETLivechatMessageIdParams, PUT: rest_typings_1.isPUTLivechatMessageIdParams, DELETE: rest_typings_1.isDELETELivechatMessageIdParams } }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { token, rid } = this.queryParams;
            const { _id } = this.urlParams;
            const guest = yield (0, livechat_1.findGuest)(token);
            if (!guest) {
                throw new Error('invalid-token');
            }
            const room = yield (0, livechat_1.findRoom)(token, rid);
            if (!room) {
                throw new Error('invalid-room');
            }
            let message = yield models_1.Messages.findOneByRoomIdAndMessageId(rid, _id);
            if (!message) {
                throw new Error('invalid-message');
            }
            if (message.file) {
                message = Object.assign(Object.assign({}, (yield (0, normalizeMessageFileUpload_1.normalizeMessageFileUpload)(message))), { _updatedAt: message._updatedAt });
            }
            if (!message) {
                throw new Error('invalid-message');
            }
            return server_1.API.v1.success({ message });
        });
    },
    put() {
        return __awaiter(this, void 0, void 0, function* () {
            const { token, rid } = this.bodyParams;
            const { _id } = this.urlParams;
            const guest = yield (0, livechat_1.findGuest)(token);
            if (!guest) {
                throw new Error('invalid-token');
            }
            const room = yield (0, livechat_1.findRoom)(token, rid);
            if (!room) {
                throw new Error('invalid-room');
            }
            const msg = yield models_1.Messages.findOneById(_id);
            if (!msg) {
                throw new Error('invalid-message');
            }
            const result = yield LivechatTyped_1.Livechat.updateMessage({
                guest,
                message: { _id: msg._id, msg: this.bodyParams.msg, rid: msg.rid },
            });
            if (!result) {
                return server_1.API.v1.failure();
            }
            let message = yield models_1.Messages.findOneById(_id);
            if (!message) {
                return server_1.API.v1.failure();
            }
            if (message === null || message === void 0 ? void 0 : message.file) {
                message = Object.assign(Object.assign({}, (yield (0, normalizeMessageFileUpload_1.normalizeMessageFileUpload)(message))), { _updatedAt: message._updatedAt });
            }
            if (!message) {
                throw new Error('invalid-message');
            }
            return server_1.API.v1.success({ message });
        });
    },
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            const { token, rid } = this.bodyParams;
            const { _id } = this.urlParams;
            const guest = yield (0, livechat_1.findGuest)(token);
            if (!guest) {
                throw new Error('invalid-token');
            }
            const room = yield (0, livechat_1.findRoom)(token, rid);
            if (!room) {
                throw new Error('invalid-room');
            }
            const message = yield models_1.Messages.findOneById(_id);
            if (!message) {
                throw new Error('invalid-message');
            }
            const result = yield LivechatTyped_1.Livechat.deleteMessage({ guest, message });
            if (result) {
                return server_1.API.v1.success({
                    message: {
                        _id,
                        ts: new Date().toISOString(),
                    },
                });
            }
            return server_1.API.v1.failure();
        });
    },
});
server_1.API.v1.addRoute('livechat/messages.history/:rid', { validateParams: rest_typings_1.isGETLivechatMessagesHistoryRidParams }, {
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { offset } = yield (0, getPaginationItems_1.getPaginationItems)(this.queryParams);
            const { token } = this.queryParams;
            const { rid } = this.urlParams;
            if (!token) {
                throw new Error('error-token-param-not-provided');
            }
            const guest = yield (0, livechat_1.findGuest)(token);
            if (!guest) {
                throw new Error('invalid-token');
            }
            const room = yield (0, livechat_1.findRoom)(token, rid);
            if (!room) {
                throw new Error('invalid-room');
            }
            let ls = undefined;
            if (this.queryParams.ls) {
                ls = new Date(this.queryParams.ls);
            }
            let end = undefined;
            if (this.queryParams.end) {
                end = new Date(this.queryParams.end);
            }
            let limit = 20;
            if (this.queryParams.limit) {
                limit = parseInt(`${this.queryParams.limit}`, 10);
            }
            const history = yield (0, loadMessageHistory_1.loadMessageHistory)({
                userId: guest._id,
                rid,
                end,
                limit,
                ls,
                offset,
            });
            const messages = yield Promise.all(history.messages.map((message) => (0, normalizeMessageFileUpload_1.normalizeMessageFileUpload)(message)));
            return server_1.API.v1.success({ messages });
        });
    },
});
server_1.API.v1.addRoute('livechat/messages', { authRequired: true, validateParams: rest_typings_1.isGETLivechatMessagesParams }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const visitorToken = this.bodyParams.visitor.token;
            const visitor = yield models_1.LivechatVisitors.getVisitorByToken(visitorToken, {});
            let rid;
            if (visitor) {
                const extraQuery = yield callbacks_1.callbacks.run('livechat.applyRoomRestrictions', {});
                const rooms = yield models_1.LivechatRooms.findOpenByVisitorToken(visitorToken, {}, extraQuery).toArray();
                if (rooms && rooms.length > 0) {
                    rid = rooms[0]._id;
                }
                else {
                    rid = random_1.Random.id();
                }
            }
            else {
                rid = random_1.Random.id();
                const guest = this.bodyParams.visitor;
                guest.connectionData = (0, livechat_1.normalizeHttpHeaderData)(this.request.headers);
                const visitor = yield LivechatTyped_1.Livechat.registerGuest(guest);
                if (!visitor) {
                    throw new Error('error-livechat-visitor-registration');
                }
            }
            const guest = visitor;
            if (!guest) {
                throw new Error('error-invalid-token');
            }
            const sentMessages = yield Promise.all(this.bodyParams.messages.map((message) => __awaiter(this, void 0, void 0, function* () {
                const sendMessage = {
                    guest,
                    message: {
                        _id: random_1.Random.id(),
                        rid,
                        token: visitorToken,
                        msg: message.msg,
                    },
                    roomInfo: {
                        source: {
                            type: (0, isWidget_1.isWidget)(this.request.headers) ? core_typings_1.OmnichannelSourceType.WIDGET : core_typings_1.OmnichannelSourceType.API,
                        },
                    },
                };
                const sentMessage = yield LivechatTyped_1.Livechat.sendMessage(sendMessage);
                return {
                    username: sentMessage.u.username,
                    msg: sentMessage.msg,
                    ts: sentMessage.ts,
                };
            })));
            return server_1.API.v1.success({
                messages: sentMessages,
            });
        });
    },
});
