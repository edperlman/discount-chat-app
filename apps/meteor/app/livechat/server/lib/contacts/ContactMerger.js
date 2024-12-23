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
exports.ContactMerger = void 0;
const models_1 = require("@rocket.chat/models");
const getContactManagerIdByUsername_1 = require("./getContactManagerIdByUsername");
const isSameChannel_1 = require("../../../lib/isSameChannel");
class ContactMerger {
    constructor() {
        this.managerList = new Map();
    }
    getManagerId(manager) {
        if ('id' in manager) {
            return manager.id;
        }
        return this.managerList.get(manager.username);
    }
    isSameManager(manager1, manager2) {
        if ('id' in manager1 && 'id' in manager2) {
            return manager1.id === manager2.id;
        }
        if ('username' in manager1 && 'username' in manager2) {
            return manager1.username === manager2.username;
        }
        const id1 = this.getManagerId(manager1);
        const id2 = this.getManagerId(manager2);
        if (!id1 || !id2) {
            return false;
        }
        return id1 === id2;
    }
    isSameField(field1, field2) {
        if (field1.type === 'manager' && field2.type === 'manager') {
            return this.isSameManager(field1.value, field2.value);
        }
        if (field1.type === 'channel' && field2.type === 'channel') {
            return (0, isSameChannel_1.isSameChannel)(field1.value.visitor, field2.value.visitor);
        }
        if (field1.type !== field2.type) {
            return false;
        }
        if (field1.value === field2.value) {
            return true;
        }
        return false;
    }
    loadDataForFields(session, ...fieldLists) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, fieldLists_1, fieldLists_1_1;
            var _b, e_1, _c, _d, _e, e_2, _f, _g;
            try {
                for (_a = true, fieldLists_1 = __asyncValues(fieldLists); fieldLists_1_1 = yield fieldLists_1.next(), _b = fieldLists_1_1.done, !_b; _a = true) {
                    _d = fieldLists_1_1.value;
                    _a = false;
                    const fieldList = _d;
                    try {
                        for (var _h = true, fieldList_1 = (e_2 = void 0, __asyncValues(fieldList)), fieldList_1_1; fieldList_1_1 = yield fieldList_1.next(), _e = fieldList_1_1.done, !_e; _h = true) {
                            _g = fieldList_1_1.value;
                            _h = false;
                            const field = _g;
                            if (field.type !== 'manager' || 'id' in field.value) {
                                continue;
                            }
                            if (!field.value.username) {
                                continue;
                            }
                            if (this.managerList.has(field.value.username)) {
                                continue;
                            }
                            const id = yield (0, getContactManagerIdByUsername_1.getContactManagerIdByUsername)(field.value.username, session);
                            this.managerList.set(field.value.username, id);
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (!_h && !_e && (_f = fieldList_1.return)) yield _f.call(fieldList_1);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_a && !_b && (_c = fieldLists_1.return)) yield _c.call(fieldLists_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    }
    static createWithFields(session, ...fieldLists) {
        return __awaiter(this, void 0, void 0, function* () {
            const merger = new ContactMerger();
            yield merger.loadDataForFields(session, ...fieldLists);
            return merger;
        });
    }
    static getAllFieldsFromContact(contact) {
        var _a, _b;
        const { customFields = {}, name, contactManager } = contact;
        const fields = new Set();
        (_a = contact.emails) === null || _a === void 0 ? void 0 : _a.forEach(({ address: value }) => fields.add({ type: 'email', value }));
        (_b = contact.phones) === null || _b === void 0 ? void 0 : _b.forEach(({ phoneNumber: value }) => fields.add({ type: 'phone', value }));
        contact.channels.forEach((value) => fields.add({ type: 'channel', value }));
        if (name) {
            fields.add({ type: 'name', value: name });
        }
        if (contactManager) {
            fields.add({ type: 'manager', value: { id: contactManager } });
        }
        Object.keys(customFields).forEach((key) => fields.add({ type: `customFields.${key}`, value: customFields[key] }));
        // If the contact already has conflicts, load their values as well
        if (contact.conflictingFields) {
            for (const conflict of contact.conflictingFields) {
                fields.add({ type: conflict.field, value: conflict.value });
            }
        }
        return [...fields];
    }
    static getAllFieldsFromVisitor(visitor, source) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { livechatData: customFields = {}, contactManager, name, username } = visitor;
            const fields = new Set();
            (_a = visitor.visitorEmails) === null || _a === void 0 ? void 0 : _a.forEach(({ address: value }) => fields.add({ type: 'email', value }));
            (_b = visitor.phone) === null || _b === void 0 ? void 0 : _b.forEach(({ phoneNumber: value }) => fields.add({ type: 'phone', value }));
            if (name) {
                fields.add({ type: 'name', value: name });
            }
            if (username) {
                fields.add({ type: 'username', value: username });
            }
            if (contactManager === null || contactManager === void 0 ? void 0 : contactManager.username) {
                fields.add({ type: 'manager', value: { username: contactManager === null || contactManager === void 0 ? void 0 : contactManager.username } });
            }
            Object.keys(customFields).forEach((key) => fields.add({ type: `customFields.${key}`, value: customFields[key] }));
            if (source) {
                fields.add({
                    type: 'channel',
                    value: {
                        name: source.label || source.type.toString(),
                        visitor: {
                            visitorId: visitor._id,
                            source: {
                                type: source.type,
                                id: source.id,
                            },
                        },
                        blocked: false,
                        verified: false,
                        details: source,
                    },
                });
            }
            return [...fields];
        });
    }
    static getFieldValuesByType(fields, type) {
        return fields.filter((field) => field.type === type).map(({ value }) => value);
    }
    static mergeFieldsIntoContact(_a) {
        return __awaiter(this, arguments, void 0, function* ({ fields, contact, conflictHandlingMode = 'conflict', session, }) {
            var _b, _c;
            const existingFields = ContactMerger.getAllFieldsFromContact(contact);
            const overwriteData = conflictHandlingMode === 'overwrite';
            const merger = yield ContactMerger.createWithFields(session, fields, existingFields);
            const newFields = fields.filter((field) => {
                // If the field already exists with the same value, ignore it
                if (existingFields.some((existingField) => merger.isSameField(existingField, field))) {
                    return false;
                }
                // If the field is an username and the contact already has a name, ignore it as well
                if (field.type === 'username' && existingFields.some(({ type }) => type === 'name')) {
                    return false;
                }
                return true;
            });
            const newPhones = ContactMerger.getFieldValuesByType(newFields, 'phone');
            const newEmails = ContactMerger.getFieldValuesByType(newFields, 'email');
            const newChannels = ContactMerger.getFieldValuesByType(newFields, 'channel');
            const newNamesOnly = ContactMerger.getFieldValuesByType(newFields, 'name');
            const newCustomFields = newFields.filter(({ type }) => type.startsWith('customFields.'));
            // Usernames are ignored unless the contact has no other name
            const newUsernames = !contact.name && !newNamesOnly.length ? ContactMerger.getFieldValuesByType(newFields, 'username') : [];
            const dataToSet = {};
            // Names, Managers and Custom Fields need are set as conflicting fields if the contact already has them
            const newNames = [...newNamesOnly, ...newUsernames];
            const newManagers = ContactMerger.getFieldValuesByType(newFields, 'manager')
                .map((manager) => {
                if ('id' in manager) {
                    return manager.id;
                }
                return merger.getManagerId(manager);
            })
                .filter((id) => Boolean(id));
            if (newNames.length && (!contact.name || overwriteData)) {
                const firstName = newNames.shift();
                if (firstName) {
                    dataToSet.name = firstName;
                }
            }
            if (newManagers.length && (!contact.contactManager || overwriteData)) {
                const firstManager = newManagers.shift();
                if (firstManager) {
                    dataToSet.contactManager = firstManager;
                }
            }
            const customFieldsPerName = new Map();
            for (const customField of newCustomFields) {
                if (!customFieldsPerName.has(customField.type)) {
                    customFieldsPerName.set(customField.type, []);
                }
                (_b = customFieldsPerName.get(customField.type)) === null || _b === void 0 ? void 0 : _b.push(customField);
            }
            for (const [key, customFields] of customFieldsPerName) {
                const fieldName = key.replace('customFields.', '');
                // If the contact does not have this custom field yet, save the first value directly to the contact instead of as a conflict
                if (!((_c = contact.customFields) === null || _c === void 0 ? void 0 : _c[fieldName]) || overwriteData) {
                    const first = customFields.shift();
                    if (first) {
                        dataToSet[key] = first.value;
                    }
                }
            }
            const allConflicts = conflictHandlingMode !== 'conflict'
                ? []
                : [
                    ...newNames.map((name) => ({ field: 'name', value: name })),
                    ...newManagers.map((manager) => ({ field: 'manager', value: manager })),
                ];
            // Phones, Emails and Channels are simply added to the contact's existing list
            const dataToAdd = Object.assign(Object.assign(Object.assign(Object.assign({}, (newPhones.length ? { phones: { $each: newPhones.map((phoneNumber) => ({ phoneNumber })) } } : {})), (newEmails.length ? { emails: { $each: newEmails.map((address) => ({ address })) } } : {})), (newChannels.length ? { channels: { $each: newChannels } } : {})), (allConflicts.length ? { conflictingFields: { $each: allConflicts } } : {}));
            if (newChannels.length) {
                dataToSet.preRegistration = false;
            }
            const updateData = Object.assign(Object.assign({}, (Object.keys(dataToSet).length ? { $set: dataToSet } : {})), (Object.keys(dataToAdd).length ? { $addToSet: dataToAdd } : {}));
            if (Object.keys(updateData).length) {
                yield models_1.LivechatContacts.updateById(contact._id, updateData, { session });
            }
        });
    }
    static mergeVisitorIntoContact(visitor, contact, source) {
        return __awaiter(this, void 0, void 0, function* () {
            const fields = yield ContactMerger.getAllFieldsFromVisitor(visitor, source);
            yield ContactMerger.mergeFieldsIntoContact({
                fields,
                contact,
                conflictHandlingMode: contact.unknown ? 'overwrite' : 'conflict',
            });
        });
    }
}
exports.ContactMerger = ContactMerger;
