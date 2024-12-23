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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMergeContacts = void 0;
const license_1 = require("@rocket.chat/license");
const models_1 = require("@rocket.chat/models");
const isSameChannel_1 = require("../../../app/livechat/lib/isSameChannel");
const ContactMerger_1 = require("../../../app/livechat/server/lib/contacts/ContactMerger");
const mergeContacts_1 = require("../../../app/livechat/server/lib/contacts/mergeContacts");
const logger_1 = require("../../app/livechat-enterprise/server/lib/logger");
const runMergeContacts = (_next, contactId, visitor, session) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    const originalContact = yield models_1.LivechatContacts.findOneById(contactId, { session });
    if (!originalContact) {
        throw new Error('error-invalid-contact');
    }
    const channel = originalContact.channels.find((channel) => (0, isSameChannel_1.isSameChannel)(channel.visitor, visitor));
    if (!channel) {
        throw new Error('error-invalid-channel');
    }
    logger_1.contactLogger.debug({ msg: 'Getting similar contacts', contactId });
    const similarContacts = yield models_1.LivechatContacts.findSimilarVerifiedContacts(channel, contactId, { session });
    if (!similarContacts.length) {
        logger_1.contactLogger.debug({ msg: 'No similar contacts found', contactId });
        return originalContact;
    }
    logger_1.contactLogger.debug({ msg: `Found ${similarContacts.length} contacts to merge`, contactId });
    try {
        for (var _d = true, similarContacts_1 = __asyncValues(similarContacts), similarContacts_1_1; similarContacts_1_1 = yield similarContacts_1.next(), _a = similarContacts_1_1.done, !_a; _d = true) {
            _c = similarContacts_1_1.value;
            _d = false;
            const similarContact = _c;
            const fields = ContactMerger_1.ContactMerger.getAllFieldsFromContact(similarContact);
            yield ContactMerger_1.ContactMerger.mergeFieldsIntoContact({ fields, contact: originalContact, session });
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (!_d && !_a && (_b = similarContacts_1.return)) yield _b.call(similarContacts_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    const similarContactIds = similarContacts.map((c) => c._id);
    const { deletedCount } = yield models_1.LivechatContacts.deleteMany({ _id: { $in: similarContactIds } }, { session });
    logger_1.contactLogger.info({
        msg: `${deletedCount} contacts have been deleted and merged`,
        deletedContactIds: similarContactIds,
        contactId,
    });
    logger_1.contactLogger.debug({ msg: 'Updating rooms with new contact id', contactId });
    yield models_1.LivechatRooms.updateMergedContactIds(similarContactIds, contactId, { session });
    return models_1.LivechatContacts.findOneById(contactId, { session });
});
exports.runMergeContacts = runMergeContacts;
mergeContacts_1.mergeContacts.patch(exports.runMergeContacts, () => license_1.License.hasModule('contact-id-verification'));
