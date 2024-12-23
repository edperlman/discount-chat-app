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
exports.deleteMessageValidatingPermission = void 0;
exports.deleteMessage = deleteMessage;
const apps_1 = require("@rocket.chat/apps");
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const callbacks_1 = require("../../../../lib/callbacks");
const canDeleteMessage_1 = require("../../../authorization/server/functions/canDeleteMessage");
const server_1 = require("../../../file-upload/server");
const server_2 = require("../../../settings/server");
const notifyListener_1 = require("../lib/notifyListener");
const deleteMessageValidatingPermission = (message, userId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(message === null || message === void 0 ? void 0 : message._id)) {
        throw new meteor_1.Meteor.Error('error-invalid-message', 'Invalid message');
    }
    if (!userId) {
        throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user');
    }
    const user = yield models_1.Users.findOneById(userId);
    const originalMessage = yield models_1.Messages.findOneById(message._id);
    if (!originalMessage || !user || !(yield (0, canDeleteMessage_1.canDeleteMessageAsync)(userId, originalMessage))) {
        throw new meteor_1.Meteor.Error('error-action-not-allowed', 'Not allowed');
    }
    return deleteMessage(originalMessage, user);
});
exports.deleteMessageValidatingPermission = deleteMessageValidatingPermission;
function deleteMessage(message, user) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c, _d, e_2, _e, _f;
        var _g;
        const deletedMsg = yield models_1.Messages.findOneById(message._id);
        const isThread = ((deletedMsg === null || deletedMsg === void 0 ? void 0 : deletedMsg.tcount) || 0) > 0;
        const keepHistory = server_2.settings.get('Message_KeepHistory') || isThread;
        const showDeletedStatus = server_2.settings.get('Message_ShowDeletedStatus') || isThread;
        const bridges = ((_g = apps_1.Apps.self) === null || _g === void 0 ? void 0 : _g.isLoaded()) && apps_1.Apps.getBridges();
        const room = yield models_1.Rooms.findOneById(message.rid, { projection: { lastMessage: 1, prid: 1, mid: 1, federated: 1 } });
        if (deletedMsg) {
            if (bridges) {
                const prevent = yield bridges.getListenerBridge().messageEvent(apps_1.AppEvents.IPreMessageDeletePrevent, deletedMsg);
                if (prevent) {
                    throw new meteor_1.Meteor.Error('error-app-prevented-deleting', 'A Rocket.Chat App prevented the message deleting.');
                }
            }
            if (room) {
                yield core_services_1.Message.beforeDelete(deletedMsg, room);
            }
        }
        if (deletedMsg === null || deletedMsg === void 0 ? void 0 : deletedMsg.tmid) {
            yield models_1.Messages.decreaseReplyCountById(deletedMsg.tmid, -1);
        }
        const files = (message.files || [message.file]).filter(Boolean); // Keep compatibility with old messages
        if (keepHistory) {
            if (showDeletedStatus) {
                // TODO is there a better way to tell TS "IUser[username]" is not undefined?
                yield models_1.Messages.cloneAndSaveAsHistoryById(message._id, user);
            }
            else {
                yield models_1.Messages.setHiddenById(message._id, true);
            }
            try {
                for (var _h = true, files_1 = __asyncValues(files), files_1_1; files_1_1 = yield files_1.next(), _a = files_1_1.done, !_a; _h = true) {
                    _c = files_1_1.value;
                    _h = false;
                    const file = _c;
                    (file === null || file === void 0 ? void 0 : file._id) && (yield models_1.Uploads.updateOne({ _id: file._id }, { $set: { _hidden: true } }));
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_h && !_a && (_b = files_1.return)) yield _b.call(files_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        else {
            if (!showDeletedStatus) {
                yield models_1.Messages.removeById(message._id);
            }
            yield models_1.ReadReceipts.removeByMessageId(message._id);
            try {
                for (var _j = true, files_2 = __asyncValues(files), files_2_1; files_2_1 = yield files_2.next(), _d = files_2_1.done, !_d; _j = true) {
                    _f = files_2_1.value;
                    _j = false;
                    const file = _f;
                    (file === null || file === void 0 ? void 0 : file._id) && (yield server_1.FileUpload.getStore('Uploads').deleteById(file._id));
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (!_j && !_d && (_e = files_2.return)) yield _e.call(files_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        if (showDeletedStatus) {
            // TODO is there a better way to tell TS "IUser[username]" is not undefined?
            yield models_1.Messages.setAsDeletedByIdAndUser(message._id, user);
        }
        else {
            void core_services_1.api.broadcast('notify.deleteMessage', message.rid, { _id: message._id });
        }
        // update last message
        if (server_2.settings.get('Store_Last_Message') && (!(room === null || room === void 0 ? void 0 : room.lastMessage) || room.lastMessage._id === message._id)) {
            const lastMessageNotDeleted = yield models_1.Messages.getLastVisibleUserMessageSentByRoomId(message.rid);
            yield models_1.Rooms.resetLastMessageById(message.rid, lastMessageNotDeleted, -1);
        }
        else {
            // decrease message count
            yield models_1.Rooms.decreaseMessageCountById(message.rid, 1);
        }
        yield callbacks_1.callbacks.run('afterDeleteMessage', deletedMsg, room);
        void (0, notifyListener_1.notifyOnRoomChangedById)(message.rid);
        if (keepHistory || showDeletedStatus) {
            void (0, notifyListener_1.notifyOnMessageChange)({
                id: message._id,
            });
        }
        if (bridges && deletedMsg) {
            void bridges.getListenerBridge().messageEvent(apps_1.AppEvents.IPostMessageDeleted, deletedMsg, user);
        }
    });
}
