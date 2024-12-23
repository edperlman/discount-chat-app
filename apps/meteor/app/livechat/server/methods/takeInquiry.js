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
exports.takeInquiry = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const server_1 = require("../../../settings/server");
const RoutingManager_1 = require("../lib/RoutingManager");
const isAgentAvailableToTakeContactInquiry_1 = require("../lib/contacts/isAgentAvailableToTakeContactInquiry");
const migrateVisitorIfMissingContact_1 = require("../lib/contacts/migrateVisitorIfMissingContact");
const takeInquiry = (userId, inquiryId, options) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!userId || !(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'view-l-room'))) {
        throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed', {
            method: 'livechat:takeInquiry',
        });
    }
    const inquiry = yield models_1.LivechatInquiry.findOneById(inquiryId);
    if (!inquiry) {
        throw new meteor_1.Meteor.Error('error-not-found', 'Inquiry not found', {
            method: 'livechat:takeInquiry',
        });
    }
    if (inquiry.status === 'taken') {
        throw new meteor_1.Meteor.Error('error-inquiry-taken', 'Inquiry already taken', {
            method: 'livechat:takeInquiry',
        });
    }
    const user = yield models_1.Users.findOneOnlineAgentById(userId, server_1.settings.get('Livechat_enabled_when_agent_idle'));
    if (!user) {
        throw new meteor_1.Meteor.Error('error-agent-status-service-offline', 'Agent status is offline or Omnichannel service is not active', {
            method: 'livechat:takeInquiry',
        });
    }
    const room = yield models_1.LivechatRooms.findOneById(inquiry.rid);
    if (!room || !(yield core_services_1.Omnichannel.isWithinMACLimit(room))) {
        throw new meteor_1.Meteor.Error('error-mac-limit-reached');
    }
    const contactId = (_a = room.contactId) !== null && _a !== void 0 ? _a : (yield (0, migrateVisitorIfMissingContact_1.migrateVisitorIfMissingContact)(room.v._id, room.source));
    if (contactId) {
        const isAgentAvailableToTakeContactInquiryResult = yield (0, isAgentAvailableToTakeContactInquiry_1.isAgentAvailableToTakeContactInquiry)(inquiry.v._id, room.source, contactId);
        if (!isAgentAvailableToTakeContactInquiryResult.value) {
            throw new meteor_1.Meteor.Error(isAgentAvailableToTakeContactInquiryResult.error);
        }
    }
    const agent = {
        agentId: user._id,
        username: user.username,
    };
    try {
        yield RoutingManager_1.RoutingManager.takeInquiry(inquiry, agent, options !== null && options !== void 0 ? options : {}, room);
    }
    catch (e) {
        throw new meteor_1.Meteor.Error(e.message);
    }
});
exports.takeInquiry = takeInquiry;
meteor_1.Meteor.methods({
    'livechat:takeInquiry'(inquiryId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const uid = meteor_1.Meteor.userId();
            if (!uid) {
                throw new meteor_1.Meteor.Error('error-not-allowed', 'Invalid User', {
                    method: 'livechat:takeInquiry',
                });
            }
            return (0, exports.takeInquiry)(uid, inquiryId, options);
        });
    },
});
