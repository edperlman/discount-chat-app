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
exports.migrateVisitorIfMissingContact = migrateVisitorIfMissingContact;
const models_1 = require("@rocket.chat/models");
const logger_1 = require("../logger");
const getContactIdByVisitor_1 = require("./getContactIdByVisitor");
const migrateVisitorToContactId_1 = require("./migrateVisitorToContactId");
function migrateVisitorIfMissingContact(visitorId, source) {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.livechatContactsLogger.debug(`Detecting visitor's contact ID`);
        // Check if there is any contact already linking to this visitorId and source
        const contactId = yield (0, getContactIdByVisitor_1.getContactIdByVisitor)({ visitorId, source });
        if (contactId) {
            return contactId;
        }
        const visitor = yield models_1.LivechatVisitors.findOneById(visitorId);
        if (!visitor) {
            throw new Error('Failed to migrate visitor data into Contact information: visitor not found.');
        }
        return (0, migrateVisitorToContactId_1.migrateVisitorToContactId)({ visitor, source, requireRoom: false });
    });
}
