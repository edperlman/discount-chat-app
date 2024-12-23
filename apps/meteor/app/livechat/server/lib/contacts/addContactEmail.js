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
exports.addContactEmail = addContactEmail;
const models_1 = require("@rocket.chat/models");
/**
 * Adds a new email into the contact's email list, if the email is already in the list it does not add anything
 * and simply return the data, since the email was aready registered :P
 *
 * @param contactId the id of the contact that will be updated
 * @param email the email that will be added to the contact
 * @returns the updated contact
 */
function addContactEmail(contactId, email) {
    return __awaiter(this, void 0, void 0, function* () {
        const contact = yield models_1.LivechatContacts.addEmail(contactId, email);
        if (!contact) {
            throw new Error('error-contact-not-found');
        }
        return contact;
    });
}
