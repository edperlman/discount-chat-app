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
exports.runIsAgentAvailableToTakeContactInquiry = void 0;
const license_1 = require("@rocket.chat/license");
const models_1 = require("@rocket.chat/models");
const isAgentAvailableToTakeContactInquiry_1 = require("../../../app/livechat/server/lib/contacts/isAgentAvailableToTakeContactInquiry");
const isVerifiedChannelInSource_1 = require("../../../app/livechat/server/lib/contacts/isVerifiedChannelInSource");
const server_1 = require("../../../app/settings/server");
// If the contact is unknown and the setting to block unknown contacts is on, we must not allow the agent to take this inquiry
// if the contact is not verified in this channel and the block unverified contacts setting is on, we should not allow the inquiry to be taken
// otherwise, the contact is allowed to be taken
const runIsAgentAvailableToTakeContactInquiry = (_next, visitorId, source, contactId) => __awaiter(void 0, void 0, void 0, function* () {
    const contact = yield models_1.LivechatContacts.findOneById(contactId, {
        projection: {
            unknown: 1,
            channels: 1,
        },
    });
    if (!contact) {
        return { value: false, error: 'error-invalid-contact' };
    }
    if (contact.unknown && server_1.settings.get('Livechat_Block_Unknown_Contacts')) {
        return { value: false, error: 'error-unknown-contact' };
    }
    const isContactVerified = (contact.channels.filter((channel) => (0, isVerifiedChannelInSource_1.isVerifiedChannelInSource)(channel, visitorId, source)) || []).length > 0;
    if (!isContactVerified && server_1.settings.get('Livechat_Block_Unverified_Contacts')) {
        return { value: false, error: 'error-unverified-contact' };
    }
    return { value: true };
});
exports.runIsAgentAvailableToTakeContactInquiry = runIsAgentAvailableToTakeContactInquiry;
isAgentAvailableToTakeContactInquiry_1.isAgentAvailableToTakeContactInquiry.patch(exports.runIsAgentAvailableToTakeContactInquiry, () => license_1.License.hasModule('contact-id-verification'));
