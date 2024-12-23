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
exports.updateContact = updateContact;
const models_1 = require("@rocket.chat/models");
const getAllowedCustomFields_1 = require("./getAllowedCustomFields");
const validateContactManager_1 = require("./validateContactManager");
const validateCustomFields_1 = require("./validateCustomFields");
const notifyListener_1 = require("../../../../lib/server/lib/notifyListener");
function updateContact(params) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const { contactId, name, emails, phones, customFields: receivedCustomFields, contactManager, channels, wipeConflicts } = params;
        const contact = yield models_1.LivechatContacts.findOneById(contactId, {
            projection: { _id: 1, name: 1 },
        });
        if (!contact) {
            throw new Error('error-contact-not-found');
        }
        if (contactManager) {
            yield (0, validateContactManager_1.validateContactManager)(contactManager);
        }
        const customFields = receivedCustomFields && (0, validateCustomFields_1.validateCustomFields)(yield (0, getAllowedCustomFields_1.getAllowedCustomFields)(), receivedCustomFields);
        const updatedContact = yield models_1.LivechatContacts.updateContact(contactId, Object.assign({ name, emails: emails === null || emails === void 0 ? void 0 : emails.map((address) => ({ address })), phones: phones === null || phones === void 0 ? void 0 : phones.map((phoneNumber) => ({ phoneNumber })), contactManager,
            channels,
            customFields }, (wipeConflicts && { conflictingFields: [] })));
        // If the contact name changed, update the name of its existing rooms and subscriptions
        if (name !== undefined && name !== contact.name) {
            yield models_1.LivechatRooms.updateContactDataByContactId(contactId, { name });
            void (0, notifyListener_1.notifyOnRoomChangedByContactId)(contactId);
            const visitorIds = (_a = updatedContact.channels) === null || _a === void 0 ? void 0 : _a.map((channel) => channel.visitor.visitorId);
            if (visitorIds === null || visitorIds === void 0 ? void 0 : visitorIds.length) {
                yield models_1.Subscriptions.updateNameAndFnameByVisitorIds(visitorIds, name);
                void (0, notifyListener_1.notifyOnSubscriptionChangedByVisitorIds)(visitorIds);
                yield models_1.LivechatInquiry.updateNameByVisitorIds(visitorIds, name);
                void (0, notifyListener_1.notifyOnLivechatInquiryChangedByVisitorIds)(visitorIds, 'updated', { name });
            }
        }
        return updatedContact;
    });
}
