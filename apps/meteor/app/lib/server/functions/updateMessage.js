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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMessage = void 0;
const apps_1 = require("@rocket.chat/apps");
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const parseUrlsInMessage_1 = require("./parseUrlsInMessage");
const server_1 = require("../../../settings/server");
const afterSaveMessage_1 = require("../lib/afterSaveMessage");
const notifyListener_1 = require("../lib/notifyListener");
const validateCustomMessageFields_1 = require("../lib/validateCustomMessageFields");
const updateMessage = function (message, user, originalMsg, previewUrls) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const originalMessage = originalMsg || (yield models_1.Messages.findOneById(message._id));
        if (!originalMessage) {
            throw new Error('Invalid message ID.');
        }
        let messageData = Object.assign({}, originalMessage, message);
        // For the Rocket.Chat Apps :)
        if (message && apps_1.Apps.self && apps_1.Apps.isLoaded()) {
            const prevent = yield apps_1.Apps.getBridges().getListenerBridge().messageEvent(apps_1.AppEvents.IPreMessageUpdatedPrevent, messageData);
            if (prevent) {
                throw new meteor_1.Meteor.Error('error-app-prevented-updating', 'A Rocket.Chat App prevented the message updating.');
            }
            let result = yield apps_1.Apps.getBridges().getListenerBridge().messageEvent(apps_1.AppEvents.IPreMessageUpdatedExtend, messageData);
            result = yield apps_1.Apps.getBridges().getListenerBridge().messageEvent(apps_1.AppEvents.IPreMessageUpdatedModify, result);
            if (typeof result === 'object') {
                Object.assign(messageData, result);
            }
        }
        // If we keep history of edits, insert a new message to store history information
        if (server_1.settings.get('Message_KeepHistory')) {
            yield models_1.Messages.cloneAndSaveAsHistoryById(messageData._id, user);
        }
        Object.assign(messageData, {
            editedAt: new Date(),
            editedBy: {
                _id: user._id,
                username: user.username,
            },
        });
        (0, parseUrlsInMessage_1.parseUrlsInMessage)(messageData, previewUrls);
        const room = yield models_1.Rooms.findOneById(messageData.rid);
        if (!room) {
            return;
        }
        messageData = yield core_services_1.Message.beforeSave({ message: messageData, room, user });
        if (messageData.customFields) {
            (0, validateCustomMessageFields_1.validateCustomMessageFields)({
                customFields: messageData.customFields,
                messageCustomFieldsEnabled: server_1.settings.get('Message_CustomFields_Enabled'),
                messageCustomFields: server_1.settings.get('Message_CustomFields'),
            });
        }
        const { _id } = messageData, editedMessage = __rest(messageData, ["_id"]);
        if (!editedMessage.msg) {
            delete editedMessage.md;
        }
        // do not send $unset if not defined. Can cause exceptions in certain mongo versions.
        yield models_1.Messages.updateOne({ _id }, Object.assign({ $set: Object.assign({}, editedMessage) }, (!editedMessage.md && { $unset: { md: 1 } })));
        if ((_a = apps_1.Apps.self) === null || _a === void 0 ? void 0 : _a.isLoaded()) {
            // This returns a promise, but it won't mutate anything about the message
            // so, we don't really care if it is successful or fails
            void ((_b = apps_1.Apps.getBridges()) === null || _b === void 0 ? void 0 : _b.getListenerBridge().messageEvent(apps_1.AppEvents.IPostMessageUpdated, messageData));
        }
        setImmediate(() => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const msg = yield models_1.Messages.findOneById(_id);
            if (!msg) {
                return;
            }
            // although this is an "afterSave" kind callback, we know they can extend message's properties
            // so we wait for it to run before broadcasting
            const data = yield (0, afterSaveMessage_1.afterSaveMessage)(msg, room, user._id);
            void (0, notifyListener_1.notifyOnMessageChange)({
                id: msg._id,
                data,
            });
            if (((_a = room === null || room === void 0 ? void 0 : room.lastMessage) === null || _a === void 0 ? void 0 : _a._id) === msg._id) {
                void (0, notifyListener_1.notifyOnRoomChangedById)(message.rid);
            }
        }));
    });
};
exports.updateMessage = updateMessage;
