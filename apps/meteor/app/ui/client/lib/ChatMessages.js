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
exports.ChatMessages = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const UserAction_1 = require("./UserAction");
const data_1 = require("../../../../client/lib/chats/data");
const processMessageEditing_1 = require("../../../../client/lib/chats/flows/processMessageEditing");
const processSetReaction_1 = require("../../../../client/lib/chats/flows/processSetReaction");
const processSlashCommand_1 = require("../../../../client/lib/chats/flows/processSlashCommand");
const processTooLongMessage_1 = require("../../../../client/lib/chats/flows/processTooLongMessage");
const replyBroadcast_1 = require("../../../../client/lib/chats/flows/replyBroadcast");
const requestMessageDeletion_1 = require("../../../../client/lib/chats/flows/requestMessageDeletion");
const sendMessage_1 = require("../../../../client/lib/chats/flows/sendMessage");
const uploadFiles_1 = require("../../../../client/lib/chats/flows/uploadFiles");
const readStateManager_1 = require("../../../../client/lib/chats/readStateManager");
const uploads_1 = require("../../../../client/lib/chats/uploads");
const messageHighlightSubscription_1 = require("../../../../client/views/room/MessageList/providers/messageHighlightSubscription");
class ChatMessages {
    constructor(params) {
        this.params = params;
        this.setComposerAPI = (composer) => {
            var _a;
            (_a = this.composer) === null || _a === void 0 ? void 0 : _a.release();
            this.composer = composer;
        };
        this.messageEditing = {
            toPreviousMessage: () => __awaiter(this, void 0, void 0, function* () {
                if (!this.composer) {
                    return;
                }
                if (!this.currentEditing) {
                    let lastMessage = yield this.data.findLastOwnMessage();
                    // Videoconf messages should not be edited
                    if (lastMessage && (0, core_typings_1.isVideoConfMessage)(lastMessage)) {
                        lastMessage = yield this.data.findPreviousOwnMessage(lastMessage);
                    }
                    if (lastMessage) {
                        yield this.data.saveDraft(undefined, this.composer.text);
                        yield this.messageEditing.editMessage(lastMessage);
                    }
                    return;
                }
                const currentMessage = yield this.data.findMessageByID(this.currentEditing.mid);
                let previousMessage = currentMessage ? yield this.data.findPreviousOwnMessage(currentMessage) : undefined;
                // Videoconf messages should not be edited
                if (previousMessage && (0, core_typings_1.isVideoConfMessage)(previousMessage)) {
                    previousMessage = yield this.data.findPreviousOwnMessage(previousMessage);
                }
                if (previousMessage) {
                    yield this.messageEditing.editMessage(previousMessage);
                    return;
                }
                yield this.currentEditing.cancel();
            }),
            toNextMessage: () => __awaiter(this, void 0, void 0, function* () {
                if (!this.composer || !this.currentEditing) {
                    return;
                }
                const currentMessage = yield this.data.findMessageByID(this.currentEditing.mid);
                let nextMessage = currentMessage ? yield this.data.findNextOwnMessage(currentMessage) : undefined;
                // Videoconf messages should not be edited
                if (nextMessage && (0, core_typings_1.isVideoConfMessage)(nextMessage)) {
                    nextMessage = yield this.data.findNextOwnMessage(nextMessage);
                }
                if (nextMessage) {
                    yield this.messageEditing.editMessage(nextMessage, { cursorAtStart: true });
                    return;
                }
                yield this.currentEditing.cancel();
            }),
            editMessage: (message_1, ...args_1) => __awaiter(this, [message_1, ...args_1], void 0, function* (message, { cursorAtStart = false } = {}) {
                var _a, _b, _c;
                const text = (yield this.data.getDraft(message._id)) || ((_b = (_a = message.attachments) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.description) || message.msg;
                yield ((_c = this.currentEditing) === null || _c === void 0 ? void 0 : _c.stop());
                if (!this.composer || !(yield this.data.canUpdateMessage(message))) {
                    return;
                }
                this.currentEditingMID = message._id;
                (0, messageHighlightSubscription_1.setHighlightMessage)(message._id);
                this.composer.setEditingMode(true);
                this.composer.setText(text);
                cursorAtStart && this.composer.setCursorToStart();
                !cursorAtStart && this.composer.setCursorToEnd();
                this.composer.focus();
            }),
        };
        const { rid, tmid } = params;
        this.uid = params.uid;
        this.data = (0, data_1.createDataAPI)({ rid, tmid });
        this.uploads = (0, uploads_1.createUploadsAPI)({ rid, tmid });
        this.ActionManager = params.actionManager;
        const unimplemented = () => {
            throw new Error('Flow is not implemented');
        };
        this.readStateManager = new readStateManager_1.ReadStateManager(rid);
        this.emojiPicker = {
            open: unimplemented,
            close: unimplemented,
        };
        this.action = {
            start: (action) => __awaiter(this, void 0, void 0, function* () {
                UserAction_1.UserAction.start(params.rid, `user-${action}`, { tmid: params.tmid });
            }),
            performContinuously: (action) => __awaiter(this, void 0, void 0, function* () {
                UserAction_1.UserAction.performContinuously(params.rid, `user-${action}`, { tmid: params.tmid });
            }),
            stop: (action) => __awaiter(this, void 0, void 0, function* () {
                UserAction_1.UserAction.stop(params.rid, `user-${action}`, { tmid: params.tmid });
            }),
        };
        this.flows = {
            uploadFiles: uploadFiles_1.uploadFiles.bind(null, this),
            sendMessage: sendMessage_1.sendMessage.bind(this, this),
            processSlashCommand: processSlashCommand_1.processSlashCommand.bind(null, this),
            processTooLongMessage: processTooLongMessage_1.processTooLongMessage.bind(null, this),
            processMessageEditing: processMessageEditing_1.processMessageEditing.bind(null, this),
            processSetReaction: processSetReaction_1.processSetReaction.bind(null, this),
            requestMessageDeletion: requestMessageDeletion_1.requestMessageDeletion.bind(this, this),
            replyBroadcast: replyBroadcast_1.replyBroadcast.bind(null, this),
        };
    }
    get currentEditing() {
        if (!this.composer || !this.currentEditingMID) {
            return undefined;
        }
        return {
            mid: this.currentEditingMID,
            reset: () => __awaiter(this, void 0, void 0, function* () {
                var _a;
                if (!this.composer || !this.currentEditingMID) {
                    return false;
                }
                const message = yield this.data.findMessageByID(this.currentEditingMID);
                if (this.composer.text !== (message === null || message === void 0 ? void 0 : message.msg)) {
                    this.composer.setText((_a = message === null || message === void 0 ? void 0 : message.msg) !== null && _a !== void 0 ? _a : '');
                    return true;
                }
                return false;
            }),
            stop: () => __awaiter(this, void 0, void 0, function* () {
                if (!this.composer || !this.currentEditingMID) {
                    return;
                }
                const message = yield this.data.findMessageByID(this.currentEditingMID);
                const draft = this.composer.text;
                if (draft === (message === null || message === void 0 ? void 0 : message.msg)) {
                    yield this.data.discardDraft(this.currentEditingMID);
                }
                else {
                    yield this.data.saveDraft(this.currentEditingMID, (yield this.data.getDraft(this.currentEditingMID)) || draft);
                }
                this.composer.setEditingMode(false);
                this.currentEditingMID = undefined;
                (0, messageHighlightSubscription_1.clearHighlightMessage)();
            }),
            cancel: () => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c;
                if (!this.currentEditingMID) {
                    return;
                }
                yield this.data.discardDraft(this.currentEditingMID);
                yield ((_a = this.currentEditing) === null || _a === void 0 ? void 0 : _a.stop());
                (_b = this.composer) === null || _b === void 0 ? void 0 : _b.setText((_c = (yield this.data.getDraft(undefined))) !== null && _c !== void 0 ? _c : '');
            }),
        };
    }
    release() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (this.currentEditing) {
                if (!this.params.tmid) {
                    yield this.currentEditing.cancel();
                }
                (_a = this.composer) === null || _a === void 0 ? void 0 : _a.clear();
            }
        });
    }
}
exports.ChatMessages = ChatMessages;
