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
exports.createContactFromVisitor = createContactFromVisitor;
const models_1 = require("@rocket.chat/models");
const createContact_1 = require("./createContact");
const mapVisitorToContact_1 = require("./mapVisitorToContact");
function createContactFromVisitor(visitor, source) {
    return __awaiter(this, void 0, void 0, function* () {
        const contactData = yield (0, mapVisitorToContact_1.mapVisitorToContact)(visitor, source);
        const contactId = yield (0, createContact_1.createContact)(contactData);
        yield models_1.LivechatRooms.setContactByVisitorAssociation({
            visitorId: visitor._id,
            source: Object.assign({ type: source.type }, (source.id ? { id: source.id } : {})),
        }, {
            _id: contactId,
            name: contactData.name,
        });
        return contactId;
    });
}
