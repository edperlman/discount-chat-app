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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDataAPI = void 0;
const random_1 = require("@rocket.chat/random");
const moment_1 = __importDefault(require("moment"));
const client_1 = require("../../../app/authorization/client");
const client_2 = require("../../../app/models/client");
const client_3 = require("../../../app/settings/client");
const client_4 = require("../../../app/ui-utils/client");
const SDKClient_1 = require("../../../app/utils/client/lib/SDKClient");
const prependReplies_1 = require("../utils/prependReplies");
const createDataAPI = ({ rid, tmid }) => {
    const composeMessage = (text_1, _a) => __awaiter(void 0, [text_1, _a], void 0, function* (text, { sendToChannel, quotedMessages, originalMessage }) {
        var _b, _c;
        const msg = yield (0, prependReplies_1.prependReplies)(text, quotedMessages);
        const effectiveRID = (_b = originalMessage === null || originalMessage === void 0 ? void 0 : originalMessage.rid) !== null && _b !== void 0 ? _b : rid;
        const effectiveTMID = originalMessage ? originalMessage.tmid : tmid;
        return Object.assign(Object.assign({ _id: (_c = originalMessage === null || originalMessage === void 0 ? void 0 : originalMessage._id) !== null && _c !== void 0 ? _c : random_1.Random.id(), rid: effectiveRID }, (effectiveTMID && Object.assign({ tmid: effectiveTMID }, (sendToChannel && { tshow: sendToChannel })))), { msg });
    });
    const findMessageByID = (mid) => __awaiter(void 0, void 0, void 0, function* () { var _a; return (_a = client_2.Messages.findOne({ _id: mid, _hidden: { $ne: true } }, { reactive: false })) !== null && _a !== void 0 ? _a : SDKClient_1.sdk.call('getSingleMessage', mid); });
    const getMessageByID = (mid) => __awaiter(void 0, void 0, void 0, function* () {
        const message = yield findMessageByID(mid);
        if (!message) {
            throw new Error('Message not found');
        }
        return message;
    });
    const findLastMessage = () => __awaiter(void 0, void 0, void 0, function* () { return client_2.Messages.findOne({ rid, tmid: tmid !== null && tmid !== void 0 ? tmid : { $exists: false }, _hidden: { $ne: true } }, { sort: { ts: -1 }, reactive: false }); });
    const getLastMessage = () => __awaiter(void 0, void 0, void 0, function* () {
        const message = yield findLastMessage();
        if (!message) {
            throw new Error('Message not found');
        }
        return message;
    });
    const findLastOwnMessage = () => __awaiter(void 0, void 0, void 0, function* () {
        const uid = Meteor.userId();
        if (!uid) {
            return undefined;
        }
        return client_2.Messages.findOne({ rid, 'tmid': tmid !== null && tmid !== void 0 ? tmid : { $exists: false }, 'u._id': uid, '_hidden': { $ne: true } }, { sort: { ts: -1 }, reactive: false });
    });
    const getLastOwnMessage = () => __awaiter(void 0, void 0, void 0, function* () {
        const message = yield findLastOwnMessage();
        if (!message) {
            throw new Error('Message not found');
        }
        return message;
    });
    const canUpdateMessage = (message) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (client_4.MessageTypes.isSystemMessage(message)) {
            return false;
        }
        const canEditMessage = (0, client_1.hasAtLeastOnePermission)('edit-message', message.rid);
        const editAllowed = (_a = client_3.settings.get('Message_AllowEditing')) !== null && _a !== void 0 ? _a : false;
        const editOwn = (message === null || message === void 0 ? void 0 : message.u) && message.u._id === Meteor.userId();
        if (!canEditMessage && (!editAllowed || !editOwn)) {
            return false;
        }
        const blockEditInMinutes = client_3.settings.get('Message_AllowEditing_BlockEditInMinutes');
        const bypassBlockTimeLimit = (0, client_1.hasPermission)('bypass-time-limit-edit-and-delete', message.rid);
        const elapsedMinutes = (0, moment_1.default)().diff(message.ts, 'minutes');
        if (!bypassBlockTimeLimit && elapsedMinutes && blockEditInMinutes && elapsedMinutes > blockEditInMinutes) {
            return false;
        }
        return true;
    });
    const findPreviousOwnMessage = (message) => __awaiter(void 0, void 0, void 0, function* () {
        const uid = Meteor.userId();
        if (!uid) {
            return undefined;
        }
        const msg = client_2.Messages.findOne({ rid, 'tmid': tmid !== null && tmid !== void 0 ? tmid : { $exists: false }, 'u._id': uid, '_hidden': { $ne: true }, 'ts': { $lt: message.ts } }, { sort: { ts: -1 }, reactive: false });
        if (!msg) {
            return undefined;
        }
        if (yield canUpdateMessage(msg)) {
            return msg;
        }
        return findPreviousOwnMessage(msg);
    });
    const getPreviousOwnMessage = (message) => __awaiter(void 0, void 0, void 0, function* () {
        const previousMessage = yield findPreviousOwnMessage(message);
        if (!previousMessage) {
            throw new Error('Message not found');
        }
        return previousMessage;
    });
    const findNextOwnMessage = (message) => __awaiter(void 0, void 0, void 0, function* () {
        const uid = Meteor.userId();
        if (!uid) {
            return undefined;
        }
        const msg = client_2.Messages.findOne({ rid, 'tmid': tmid !== null && tmid !== void 0 ? tmid : { $exists: false }, 'u._id': uid, '_hidden': { $ne: true }, 'ts': { $gt: message.ts } }, { sort: { ts: 1 }, reactive: false });
        if (!msg) {
            return undefined;
        }
        if (yield canUpdateMessage(msg)) {
            return msg;
        }
        return findNextOwnMessage(msg);
    });
    const getNextOwnMessage = (message) => __awaiter(void 0, void 0, void 0, function* () {
        const nextMessage = yield findNextOwnMessage(message);
        if (!nextMessage) {
            throw new Error('Message not found');
        }
        return nextMessage;
    });
    const pushEphemeralMessage = (message) => __awaiter(void 0, void 0, void 0, function* () {
        client_2.Messages.upsert({ _id: message._id }, { $set: Object.assign(Object.assign(Object.assign({}, message), { rid }), (tmid && { tmid })) });
    });
    const updateMessage = (message, previewUrls) => __awaiter(void 0, void 0, void 0, function* () { return SDKClient_1.sdk.call('updateMessage', message, previewUrls); });
    const canDeleteMessage = (message) => __awaiter(void 0, void 0, void 0, function* () {
        const uid = Meteor.userId();
        if (!uid) {
            return false;
        }
        if (client_4.MessageTypes.isSystemMessage(message)) {
            return false;
        }
        const forceDeleteAllowed = (0, client_1.hasPermission)('force-delete-message', message.rid);
        if (forceDeleteAllowed) {
            return true;
        }
        const deletionEnabled = client_3.settings.get('Message_AllowDeleting');
        if (!deletionEnabled) {
            return false;
        }
        const deleteAnyAllowed = (0, client_1.hasPermission)('delete-message', rid);
        const deleteOwnAllowed = (0, client_1.hasPermission)('delete-own-message');
        const deleteAllowed = deleteAnyAllowed || (deleteOwnAllowed && (message === null || message === void 0 ? void 0 : message.u) && message.u._id === Meteor.userId());
        if (!deleteAllowed) {
            return false;
        }
        const blockDeleteInMinutes = client_3.settings.get('Message_AllowDeleting_BlockDeleteInMinutes');
        const bypassBlockTimeLimit = (0, client_1.hasPermission)('bypass-time-limit-edit-and-delete', message.rid);
        const elapsedMinutes = (0, moment_1.default)().diff(message.ts, 'minutes');
        const onTimeForDelete = bypassBlockTimeLimit || !blockDeleteInMinutes || !elapsedMinutes || elapsedMinutes <= blockDeleteInMinutes;
        return deleteAllowed && onTimeForDelete;
    });
    const deleteMessage = (msgIdOrMsg) => __awaiter(void 0, void 0, void 0, function* () {
        let msgId;
        let roomId;
        if (typeof msgIdOrMsg === 'string') {
            msgId = msgIdOrMsg;
            const msg = yield findMessageByID(msgId);
            if (!msg) {
                throw new Error('Message not found');
            }
            roomId = msg.rid;
        }
        else {
            msgId = msgIdOrMsg._id;
            roomId = msgIdOrMsg.rid;
        }
        yield SDKClient_1.sdk.rest.post('/v1/chat.delete', { msgId, roomId });
    });
    const drafts = new Map();
    const getDraft = (mid) => __awaiter(void 0, void 0, void 0, function* () { return drafts.get(mid); });
    const discardDraft = (mid) => __awaiter(void 0, void 0, void 0, function* () {
        drafts.delete(mid);
    });
    const saveDraft = (mid, draft) => __awaiter(void 0, void 0, void 0, function* () {
        drafts.set(mid, draft);
    });
    const findRoom = () => __awaiter(void 0, void 0, void 0, function* () { return client_2.Rooms.findOne({ _id: rid }, { reactive: false }); });
    const getRoom = () => __awaiter(void 0, void 0, void 0, function* () {
        const room = yield findRoom();
        if (!room) {
            throw new Error('Room not found');
        }
        return room;
    });
    const isSubscribedToRoom = () => __awaiter(void 0, void 0, void 0, function* () { return !!client_2.Subscriptions.findOne({ rid }, { reactive: false }); });
    const joinRoom = () => __awaiter(void 0, void 0, void 0, function* () {
        yield SDKClient_1.sdk.call('joinRoom', rid);
    });
    const findDiscussionByID = (drid) => __awaiter(void 0, void 0, void 0, function* () { return client_2.Rooms.findOne({ _id: drid, prid: { $exists: true } }, { reactive: false }); });
    const getDiscussionByID = (drid) => __awaiter(void 0, void 0, void 0, function* () {
        const discussion = yield findDiscussionByID(drid);
        if (!discussion) {
            throw new Error('Discussion not found');
        }
        return discussion;
    });
    const createStrictGetter = (find, errorMessage) => {
        return (...args) => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield find(...args);
            if (!result) {
                throw new Error(errorMessage);
            }
            return result;
        });
    };
    const findSubscription = () => __awaiter(void 0, void 0, void 0, function* () {
        return client_2.Subscriptions.findOne({ rid }, { reactive: false });
    });
    const getSubscription = createStrictGetter(findSubscription, 'Subscription not found');
    const findSubscriptionFromMessage = (message) => __awaiter(void 0, void 0, void 0, function* () {
        return client_2.Subscriptions.findOne({ rid: message.rid }, { reactive: false });
    });
    const getSubscriptionFromMessage = createStrictGetter(findSubscriptionFromMessage, 'Subscription not found');
    return {
        composeMessage,
        findMessageByID,
        getMessageByID,
        findLastMessage,
        getLastMessage,
        findLastOwnMessage,
        getLastOwnMessage,
        findPreviousOwnMessage,
        getPreviousOwnMessage,
        findNextOwnMessage,
        getNextOwnMessage,
        pushEphemeralMessage,
        canUpdateMessage,
        updateMessage,
        canDeleteMessage,
        deleteMessage,
        getDraft,
        saveDraft,
        discardDraft,
        findRoom,
        getRoom,
        isSubscribedToRoom,
        joinRoom,
        findDiscussionByID,
        getDiscussionByID,
        findSubscription,
        getSubscription,
        findSubscriptionFromMessage,
        getSubscriptionFromMessage,
    };
};
exports.createDataAPI = createDataAPI;
