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
exports.removeEmailInbox = exports.updateEmailInbox = exports.insertOneEmailInbox = exports.findEmailInboxes = void 0;
const models_1 = require("@rocket.chat/models");
const notifyListener_1 = require("../../../lib/server/lib/notifyListener");
const findEmailInboxes = (_a) => __awaiter(void 0, [_a], void 0, function* ({ query = {}, pagination: { offset, count, sort }, }) {
    const { cursor, totalCount } = models_1.EmailInbox.findPaginated(query, {
        sort: sort || { name: 1 },
        skip: offset,
        limit: count,
    });
    const [emailInboxes, total] = yield Promise.all([cursor.toArray(), totalCount]);
    return {
        emailInboxes,
        count: emailInboxes.length,
        offset,
        total,
    };
});
exports.findEmailInboxes = findEmailInboxes;
const insertOneEmailInbox = (userId, emailInboxParams) => __awaiter(void 0, void 0, void 0, function* () {
    const obj = Object.assign(Object.assign({}, emailInboxParams), { _createdAt: new Date(), _updatedAt: new Date(), _createdBy: yield models_1.Users.findOneById(userId, { projection: { username: 1 } }) });
    const response = yield models_1.EmailInbox.create(obj);
    if (response.insertedId) {
        void (0, notifyListener_1.notifyOnEmailInboxChanged)(Object.assign({ _id: response.insertedId }, obj), 'inserted');
    }
    return response;
});
exports.insertOneEmailInbox = insertOneEmailInbox;
const updateEmailInbox = (emailInboxParams) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, active, name, email, description, senderInfo, department, smtp, imap } = emailInboxParams;
    const updateEmailInbox = Object.assign({ $set: Object.assign({ active,
            name,
            email,
            description,
            senderInfo,
            smtp,
            imap, _updatedAt: new Date() }, (department !== 'All' && { department })) }, (department === 'All' && { $unset: { department: 1 } }));
    const updatedResponse = yield models_1.EmailInbox.updateById(_id, updateEmailInbox);
    if (!updatedResponse.value) {
        throw new Error('error-invalid-email-inbox');
    }
    void (0, notifyListener_1.notifyOnEmailInboxChanged)(Object.assign(Object.assign({}, updatedResponse.value), (department === 'All' && { department: undefined })), 'updated');
    return updatedResponse.value;
});
exports.updateEmailInbox = updateEmailInbox;
const removeEmailInbox = (emailInboxId) => __awaiter(void 0, void 0, void 0, function* () {
    const removeResponse = yield models_1.EmailInbox.removeById(emailInboxId);
    if (removeResponse.deletedCount) {
        void (0, notifyListener_1.notifyOnEmailInboxChanged)({ _id: emailInboxId }, 'removed');
    }
    return removeResponse;
});
exports.removeEmailInbox = removeEmailInbox;
