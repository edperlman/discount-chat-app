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
exports.migrateVisitorToContactId = migrateVisitorToContactId;
const models_1 = require("@rocket.chat/models");
const logger_1 = require("../logger");
const ContactMerger_1 = require("./ContactMerger");
const createContactFromVisitor_1 = require("./createContactFromVisitor");
/**
    This function assumes you already ensured that the visitor is not yet linked to any contact
**/
function migrateVisitorToContactId(_a) {
    return __awaiter(this, arguments, void 0, function* ({ visitor, source, requireRoom = true, }) {
        if (requireRoom) {
            // Do not migrate the visitor with this source if they have no rooms matching it
            const anyRoom = yield models_1.LivechatRooms.findNewestByContactVisitorAssociation({ visitorId: visitor._id, source }, {
                projection: { _id: 1 },
            });
            if (!anyRoom) {
                return null;
            }
        }
        // Search for any contact that is not yet associated with any visitor and that have the same email or phone number as this visitor.
        const existingContact = yield models_1.LivechatContacts.findContactMatchingVisitor(visitor);
        if (!existingContact) {
            logger_1.livechatContactsLogger.debug(`Creating a new contact for existing visitor ${visitor._id}`);
            return (0, createContactFromVisitor_1.createContactFromVisitor)(visitor, source);
        }
        // There is already an existing contact with no linked visitors and matching this visitor's phone or email, so let's use it
        logger_1.livechatContactsLogger.debug(`Adding channel to existing contact ${existingContact._id}`);
        yield ContactMerger_1.ContactMerger.mergeVisitorIntoContact(visitor, existingContact, source);
        // Update all existing rooms matching the visitor id and source to set the contactId to them
        yield models_1.LivechatRooms.setContactByVisitorAssociation({
            visitorId: visitor._id,
            source,
        }, existingContact);
        return existingContact._id;
    });
}
