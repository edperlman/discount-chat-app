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
exports.LivechatContactsRaw = void 0;
const string_helpers_1 = require("@rocket.chat/string-helpers");
const BaseRaw_1 = require("./BaseRaw");
class LivechatContactsRaw extends BaseRaw_1.BaseRaw {
    constructor(db, trash) {
        super(db, 'livechat_contact', trash);
    }
    modelIndexes() {
        return [
            {
                key: { name: 1 },
                unique: false,
                name: 'name_insensitive',
                collation: { locale: 'en', strength: 2, caseLevel: false },
            },
            {
                key: { 'emails.address': 1 },
                unique: false,
                name: 'emails_insensitive',
                partialFilterExpression: { emails: { $exists: true } },
                collation: { locale: 'en', strength: 2, caseLevel: false },
            },
            {
                key: { 'phones.phoneNumber': 1 },
                partialFilterExpression: { phones: { $exists: true } },
                unique: false,
            },
            {
                key: {
                    'channels.visitor.visitorId': 1,
                    'channels.visitor.source.type': 1,
                    'channels.visitor.source.id': 1,
                },
                name: 'visitorAssociation',
                unique: false,
            },
            {
                key: {
                    'channels.field': 1,
                    'channels.value': 1,
                    'channels.verified': 1,
                },
                partialFilterExpression: { 'channels.verified': true },
                name: 'verificationKey',
                unique: false,
            },
            {
                key: {
                    preRegistration: 1,
                },
                sparse: true,
                unique: false,
            },
        ];
    }
    insertContact(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.insertOne(Object.assign(Object.assign({ createdAt: new Date() }, data), { preRegistration: !data.channels.length }));
            return result.insertedId;
        });
    }
    updateContact(contactId, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedValue = yield this.findOneAndUpdate({ _id: contactId }, { $set: Object.assign(Object.assign(Object.assign({}, data), { unknown: false }), (data.channels && { preRegistration: !data.channels.length })) }, Object.assign({ returnDocument: 'after' }, options));
            return updatedValue.value;
        });
    }
    updateById(contactId, update, options) {
        return this.updateOne({ _id: contactId }, update, options);
    }
    findPaginatedContacts(search, options) {
        const { searchText, unknown = false } = search;
        const searchRegex = (0, string_helpers_1.escapeRegExp)(searchText || '');
        const match = {
            $or: [
                { name: { $regex: searchRegex, $options: 'i' } },
                { 'emails.address': { $regex: searchRegex, $options: 'i' } },
                { 'phones.phoneNumber': { $regex: searchRegex, $options: 'i' } },
            ],
            unknown,
        };
        return this.findPaginated(Object.assign({}, match), Object.assign({ allowDiskUse: true }, options));
    }
    findContactMatchingVisitor(visitor) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const emails = ((_a = visitor.visitorEmails) === null || _a === void 0 ? void 0 : _a.map(({ address }) => address).filter((email) => Boolean(email))) || [];
            const phoneNumbers = ((_b = visitor.phone) === null || _b === void 0 ? void 0 : _b.map(({ phoneNumber }) => phoneNumber).filter((phone) => Boolean(phone))) || [];
            if (!(emails === null || emails === void 0 ? void 0 : emails.length) && !(phoneNumbers === null || phoneNumbers === void 0 ? void 0 : phoneNumbers.length)) {
                return null;
            }
            const query = {
                $and: [
                    {
                        $or: [
                            ...emails === null || emails === void 0 ? void 0 : emails.map((email) => ({ 'emails.address': email })),
                            ...phoneNumbers === null || phoneNumbers === void 0 ? void 0 : phoneNumbers.map((phone) => ({ 'phones.phoneNumber': phone })),
                        ],
                    },
                    {
                        preRegistration: true,
                    },
                ],
            };
            return this.findOne(query);
        });
    }
    makeQueryForVisitor(visitor, extraFilters) {
        return {
            channels: {
                $elemMatch: Object.assign(Object.assign({ 'visitor.visitorId': visitor.visitorId, 'visitor.source.type': visitor.source.type }, (visitor.source.id ? { 'visitor.source.id': visitor.source.id } : {})), extraFilters),
            },
        };
    }
    findOneByVisitor(visitor_1) {
        return __awaiter(this, arguments, void 0, function* (visitor, options = {}) {
            return this.findOne(this.makeQueryForVisitor(visitor), options);
        });
    }
    addChannel(contactId, channel) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateOne({ _id: contactId }, { $push: { channels: channel }, $set: { preRegistration: false } });
        });
    }
    updateLastChatById(contactId, visitor, lastChat) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.updateOne(Object.assign(Object.assign({}, this.makeQueryForVisitor(visitor)), { _id: contactId }), { $set: { lastChat, 'channels.$.lastChat': lastChat } });
        });
    }
    isChannelBlocked(visitor) {
        return __awaiter(this, void 0, void 0, function* () {
            return Boolean(yield this.findOne(this.makeQueryForVisitor(visitor, { blocked: true }), { projection: { _id: 1 } }));
        });
    }
    updateContactChannel(visitor_1, data_1, contactData_1) {
        return __awaiter(this, arguments, void 0, function* (visitor, data, contactData, options = {}) {
            return this.updateOne(this.makeQueryForVisitor(visitor), {
                $set: Object.assign(Object.assign({}, contactData), Object.fromEntries(Object.keys(data).map((key) => [`channels.$.${key}`, data[key]]))),
            }, options);
        });
    }
    findSimilarVerifiedContacts(_a, originalContactId_1, options_1) {
        return __awaiter(this, arguments, void 0, function* ({ field, value }, originalContactId, options) {
            return this.find({
                channels: {
                    $elemMatch: {
                        field,
                        value,
                        verified: true,
                    },
                },
                _id: { $ne: originalContactId },
            }, options).toArray();
        });
    }
    findAllByVisitorId(visitorId) {
        return this.find({
            'channels.visitor.visitorId': visitorId,
        });
    }
    addEmail(contactId, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedContact = yield this.findOneAndUpdate({ _id: contactId }, { $addToSet: { emails: { address: email } } });
            return updatedContact.value;
        });
    }
}
exports.LivechatContactsRaw = LivechatContactsRaw;
