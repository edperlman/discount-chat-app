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
exports.deleteReportedMessages = deleteReportedMessages;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const server_1 = require("../../../app/file-upload/server");
const server_2 = require("../../../app/settings/server");
// heavily inspired from message delete taking place in the user deletion process
// in this path we don't care about the apps engine events - it's a "raw" bulk action
function deleteReportedMessages(messages, user) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        const keepHistory = server_2.settings.get('Message_KeepHistory');
        const showDeletedStatus = server_2.settings.get('Message_ShowDeletedStatus');
        const files = [];
        const messageIds = [];
        for (const message of messages) {
            if (message.file) {
                files.push(message.file._id);
            }
            if (message.files && message.files.length > 0) {
                files.concat(message.files.map((file) => file._id));
            }
            messageIds.push(message._id);
        }
        if (keepHistory) {
            if (showDeletedStatus) {
                const cursor = models_1.Messages.find({ _id: { $in: messageIds } });
                try {
                    for (var _d = true, cursor_1 = __asyncValues(cursor), cursor_1_1; cursor_1_1 = yield cursor_1.next(), _a = cursor_1_1.done, !_a; _d = true) {
                        _c = cursor_1_1.value;
                        _d = false;
                        const doc = _c;
                        yield models_1.Messages.cloneAndSaveAsHistoryByRecord(doc, user);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = cursor_1.return)) yield _b.call(cursor_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            else {
                yield models_1.Messages.setHiddenByIds(messageIds, true);
            }
            yield models_1.Uploads.updateMany({ _id: { $in: files } }, { $set: { _hidden: true } });
        }
        else {
            if (!showDeletedStatus) {
                yield models_1.Messages.deleteMany({ _id: { $in: messageIds } });
            }
            yield models_1.ReadReceipts.removeByMessageIds(messageIds);
            const store = server_1.FileUpload.getStore('Uploads');
            yield Promise.all(files.map((file) => store.deleteById(file)));
        }
        if (showDeletedStatus) {
            yield models_1.Messages.setAsDeletedByIdsAndUser(messageIds, user);
        }
        const transformed = messages.reduce((acc, { rid, _id }) => {
            if (!acc[rid]) {
                acc[rid] = [];
            }
            acc[rid].push(_id);
            return acc;
        }, {});
        Object.entries(transformed).forEach(([rid, messageIds]) => {
            void core_services_1.api.broadcast('notify.deleteMessageBulk', rid, {
                rid,
                excludePinned: true,
                ignoreDiscussion: true,
                ts: { $gt: new Date() },
                users: [],
                ids: messageIds,
                showDeletedStatus,
            });
        });
    });
}
