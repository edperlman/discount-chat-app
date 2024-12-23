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
exports.OmnichannelEE = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const core_typings_1 = require("@rocket.chat/core-typings");
const logger_1 = require("@rocket.chat/logger");
const models_1 = require("@rocket.chat/models");
const notifyListener_1 = require("../../../../../app/lib/server/lib/notifyListener");
const Helper_1 = require("../../../../../app/livechat/server/lib/Helper");
const QueueManager_1 = require("../../../../../app/livechat/server/lib/QueueManager");
const RoutingManager_1 = require("../../../../../app/livechat/server/lib/RoutingManager");
const server_1 = require("../../../../../app/settings/server");
const callbacks_1 = require("../../../../../lib/callbacks");
class OmnichannelEE extends core_services_1.ServiceClassInternal {
    constructor() {
        super();
        this.name = 'omnichannel-ee';
        this.internal = true;
        this.logger = new logger_1.Logger('OmnichannelEE');
    }
    placeRoomOnHold(room, comment, onHoldBy) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            this.logger.debug(`Attempting to place room ${room._id} on hold by user ${onHoldBy === null || onHoldBy === void 0 ? void 0 : onHoldBy._id}`);
            const { _id: roomId } = room;
            if (!room || !(0, core_typings_1.isOmnichannelRoom)(room)) {
                throw new Error('error-invalid-room');
            }
            if (!room.open) {
                throw new Error('error-room-already-closed');
            }
            if (room.onHold) {
                throw new Error('error-room-is-already-on-hold');
            }
            const restrictedOnHold = server_1.settings.get('Livechat_allow_manual_on_hold_upon_agent_engagement_only');
            const canRoomBePlacedOnHold = !room.onHold;
            const canAgentPlaceOnHold = !((_a = room.lastMessage) === null || _a === void 0 ? void 0 : _a.token);
            const canPlaceChatOnHold = canRoomBePlacedOnHold && (!restrictedOnHold || canAgentPlaceOnHold);
            if (!canPlaceChatOnHold) {
                throw new Error('error-cannot-place-chat-on-hold');
            }
            if (!room.servedBy) {
                throw new Error('error-unserved-rooms-cannot-be-placed-onhold');
            }
            const [roomResult, subsResult] = yield Promise.all([
                models_1.LivechatRooms.setOnHoldByRoomId(roomId),
                models_1.Subscriptions.setOnHoldByRoomId(roomId),
                core_services_1.Message.saveSystemMessage('omnichannel_placed_chat_on_hold', roomId, '', onHoldBy, { comment }),
            ]);
            if (roomResult.modifiedCount) {
                void (0, notifyListener_1.notifyOnRoomChangedById)(roomId);
            }
            if (subsResult.modifiedCount) {
                void (0, notifyListener_1.notifyOnSubscriptionChangedByRoomId)(roomId);
            }
            yield callbacks_1.callbacks.run('livechat:afterOnHold', room);
        });
    }
    resumeRoomOnHold(room_1, comment_1, resumeBy_1) {
        return __awaiter(this, arguments, void 0, function* (room, comment, resumeBy, clientAction = false) {
            this.logger.debug(`Attempting to resume room ${room._id} on hold by user ${resumeBy === null || resumeBy === void 0 ? void 0 : resumeBy._id}`);
            if (!room || !(0, core_typings_1.isOmnichannelRoom)(room)) {
                throw new Error('error-invalid-room');
            }
            if (!room.open) {
                throw new Error('This_conversation_is_already_closed');
            }
            if (!room.onHold) {
                throw new Error('error-room-not-on-hold');
            }
            const { _id: roomId, servedBy } = room;
            if (!servedBy) {
                this.logger.error(`No serving agent found for room ${roomId}`);
                throw new Error('error-room-not-served');
            }
            const inquiry = yield models_1.LivechatInquiry.findOneByRoomId(roomId, {});
            if (!inquiry) {
                this.logger.error(`No inquiry found for room ${roomId}`);
                throw new Error('error-invalid-inquiry');
            }
            yield this.attemptToAssignRoomToServingAgentElseQueueIt({
                room,
                inquiry,
                servingAgent: servedBy,
                clientAction,
            });
            const [roomResult, subsResult] = yield Promise.all([
                models_1.LivechatRooms.unsetOnHoldByRoomId(roomId),
                models_1.Subscriptions.unsetOnHoldByRoomId(roomId),
                core_services_1.Message.saveSystemMessage('omnichannel_on_hold_chat_resumed', roomId, '', resumeBy, { comment }),
            ]);
            if (roomResult.modifiedCount) {
                void (0, notifyListener_1.notifyOnRoomChangedById)(roomId);
            }
            if (subsResult.modifiedCount) {
                void (0, notifyListener_1.notifyOnSubscriptionChangedByRoomId)(roomId);
            }
            yield callbacks_1.callbacks.run('livechat:afterOnHoldChatResumed', room);
        });
    }
    attemptToAssignRoomToServingAgentElseQueueIt(_a) {
        return __awaiter(this, arguments, void 0, function* ({ room, inquiry, servingAgent, clientAction, }) {
            try {
                const agent = {
                    agentId: servingAgent._id,
                    username: servingAgent.username,
                };
                yield callbacks_1.callbacks.run('livechat.checkAgentBeforeTakeInquiry', {
                    agent,
                    inquiry,
                    options: {},
                });
                return;
            }
            catch (e) {
                this.logger.error(`Agent ${servingAgent._id} is not available to take the inquiry ${inquiry._id}`, e);
                if (clientAction) {
                    // if the action was triggered by the client, we should throw the error
                    // so the client can handle it and show the error message to the user
                    throw e;
                }
            }
            yield this.removeCurrentAgentFromRoom({ room, inquiry });
            const { _id: inquiryId } = inquiry;
            const newInquiry = yield models_1.LivechatInquiry.findOneById(inquiryId);
            if (!newInquiry) {
                throw new Error('error-invalid-inquiry');
            }
            yield (0, QueueManager_1.queueInquiry)(newInquiry);
        });
    }
    removeCurrentAgentFromRoom(_a) {
        return __awaiter(this, arguments, void 0, function* ({ room, inquiry, }) {
            this.logger.debug(`Attempting to remove current agent from room ${room._id}`);
            const { _id: roomId } = room;
            const { _id: inquiryId } = inquiry;
            yield Promise.all([
                models_1.LivechatRooms.removeAgentByRoomId(roomId),
                models_1.LivechatInquiry.queueInquiryAndRemoveDefaultAgent(inquiryId),
                RoutingManager_1.RoutingManager.removeAllRoomSubscriptions(room),
            ]);
            void (0, notifyListener_1.notifyOnLivechatInquiryChangedById)(inquiryId, 'updated', {
                status: core_typings_1.LivechatInquiryStatus.QUEUED,
                queuedAt: new Date(),
                takenAt: undefined,
                defaultAgent: undefined,
            });
            yield (0, Helper_1.dispatchAgentDelegated)(roomId);
            void (0, notifyListener_1.notifyOnRoomChangedById)(roomId);
        });
    }
}
exports.OmnichannelEE = OmnichannelEE;
