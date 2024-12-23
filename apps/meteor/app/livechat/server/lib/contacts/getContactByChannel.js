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
exports.getContactByChannel = getContactByChannel;
const models_1 = require("@rocket.chat/models");
const migrateVisitorToContactId_1 = require("./migrateVisitorToContactId");
function getContactByChannel(association) {
    return __awaiter(this, void 0, void 0, function* () {
        // If a contact already exists for that visitor, return it
        const linkedContact = yield models_1.LivechatContacts.findOneByVisitor(association);
        if (linkedContact) {
            return linkedContact;
        }
        // If the contact was not found, Load the visitor data so we can migrate it
        const visitor = yield models_1.LivechatVisitors.findOneById(association.visitorId);
        // If there is no visitor data, there's nothing we can do
        if (!visitor) {
            return null;
        }
        const newContactId = yield (0, migrateVisitorToContactId_1.migrateVisitorToContactId)({ visitor, source: association.source });
        // If no contact was created by the migration, this visitor doesn't need a contact yet, so let's return null
        if (!newContactId) {
            return null;
        }
        // Finally, let's return the data of the migrated contact
        return models_1.LivechatContacts.findOneById(newContactId);
    });
}
