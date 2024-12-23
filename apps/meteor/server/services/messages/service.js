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
exports.MessageService = void 0;
const core_services_1 = require("@rocket.chat/core-services");
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const deleteMessage_1 = require("../../../app/lib/server/functions/deleteMessage");
const sendMessage_1 = require("../../../app/lib/server/functions/sendMessage");
const updateMessage_1 = require("../../../app/lib/server/functions/updateMessage");
const notifyListener_1 = require("../../../app/lib/server/lib/notifyListener");
const notifyUsersOnMessage_1 = require("../../../app/lib/server/lib/notifyUsersOnMessage");
const sendMessage_2 = require("../../../app/lib/server/methods/sendMessage");
const setReaction_1 = require("../../../app/reactions/server/setReaction");
const server_1 = require("../../../app/settings/server");
const getUserAvatarURL_1 = require("../../../app/utils/server/getUserAvatarURL");
const BeforeSaveCannedResponse_1 = require("../../../ee/server/hooks/messages/BeforeSaveCannedResponse");
const utils_1 = require("../federation/utils");
const BeforeFederationActions_1 = require("./hooks/BeforeFederationActions");
const BeforeSaveBadWords_1 = require("./hooks/BeforeSaveBadWords");
const BeforeSaveCheckMAC_1 = require("./hooks/BeforeSaveCheckMAC");
const BeforeSaveJumpToMessage_1 = require("./hooks/BeforeSaveJumpToMessage");
const BeforeSaveMarkdownParser_1 = require("./hooks/BeforeSaveMarkdownParser");
const BeforeSaveMentions_1 = require("./hooks/BeforeSaveMentions");
const BeforeSavePreventMention_1 = require("./hooks/BeforeSavePreventMention");
const BeforeSaveSpotify_1 = require("./hooks/BeforeSaveSpotify");
const disableMarkdownParser = ['yes', 'true'].includes(String(process.env.DISABLE_MESSAGE_PARSER).toLowerCase());
class MessageService extends core_services_1.ServiceClassInternal {
    constructor() {
        super(...arguments);
        this.name = 'message';
    }
    created() {
        return __awaiter(this, void 0, void 0, function* () {
            this.preventMention = new BeforeSavePreventMention_1.BeforeSavePreventMention();
            this.badWords = new BeforeSaveBadWords_1.BeforeSaveBadWords();
            this.spotify = new BeforeSaveSpotify_1.BeforeSaveSpotify();
            this.jumpToMessage = new BeforeSaveJumpToMessage_1.BeforeSaveJumpToMessage({
                getMessages(messageIds) {
                    return models_1.Messages.findVisibleByIds(messageIds).toArray();
                },
                getRooms(roomIds) {
                    return models_1.Rooms.findByIds(roomIds).toArray();
                },
                canAccessRoom(room, user) {
                    return core_services_1.Authorization.canAccessRoom(room, user);
                },
                getUserAvatarURL(user) {
                    return (user && (0, getUserAvatarURL_1.getUserAvatarURL)(user)) || '';
                },
            });
            this.cannedResponse = new BeforeSaveCannedResponse_1.BeforeSaveCannedResponse();
            this.markdownParser = new BeforeSaveMarkdownParser_1.BeforeSaveMarkdownParser(!disableMarkdownParser);
            this.checkMAC = new BeforeSaveCheckMAC_1.BeforeSaveCheckMAC();
            yield this.configureBadWords();
        });
    }
    configureBadWords() {
        return __awaiter(this, void 0, void 0, function* () {
            server_1.settings.watchMultiple(['Message_AllowBadWordsFilter', 'Message_BadWordsFilterList', 'Message_BadWordsWhitelist'], (_a) => __awaiter(this, [_a], void 0, function* ([enabled, badWordsList, whiteList]) {
                if (!enabled) {
                    this.badWords.disable();
                    return;
                }
                yield this.badWords.configure(badWordsList, whiteList);
            }));
        });
    }
    sendMessage(_a) {
        return __awaiter(this, arguments, void 0, function* ({ fromId, rid, msg }) {
            return (0, sendMessage_2.executeSendMessage)(fromId, { rid, msg });
        });
    }
    sendMessageWithValidation(user_1, message_1, room_1) {
        return __awaiter(this, arguments, void 0, function* (user, message, room, upsert = false) {
            return (0, sendMessage_1.sendMessage)(user, message, room, upsert);
        });
    }
    deleteMessage(user, message) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, deleteMessage_1.deleteMessage)(message, user);
        });
    }
    updateMessage(message, user, originalMsg, previewUrls) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, updateMessage_1.updateMessage)(message, user, originalMsg, previewUrls);
        });
    }
    reactToMessage(userId, reaction, messageId, shouldReact) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, setReaction_1.executeSetReaction)(userId, reaction, messageId, shouldReact);
        });
    }
    saveSystemMessageAndNotifyUser(type, rid, messageText, owner, extraData) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdMessage = yield this.saveSystemMessage(type, rid, messageText, owner, extraData);
            const room = yield models_1.Rooms.findOneById(rid);
            if (!room) {
                throw new Error('Failed to find the room.');
            }
            yield (0, notifyUsersOnMessage_1.notifyUsersOnSystemMessage)(createdMessage, room);
            return createdMessage;
        });
    }
    saveSystemMessage(type, rid, message, owner, extraData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id: userId, username, name } = owner;
            if (!username) {
                throw new Error('The username cannot be empty.');
            }
            const [{ insertedId }] = yield Promise.all([
                models_1.Messages.createWithTypeRoomIdMessageUserAndUnread(type, rid, message, { _id: userId, username, name }, server_1.settings.get('Message_Read_Receipt_Enabled'), extraData),
                models_1.Rooms.incMsgCountById(rid, 1),
            ]);
            if (!insertedId) {
                throw new Error('Failed to save system message.');
            }
            const createdMessage = yield models_1.Messages.findOneById(insertedId);
            if (!createdMessage) {
                throw new Error('Failed to find the created message.');
            }
            void (0, notifyListener_1.notifyOnMessageChange)({ id: createdMessage._id, data: createdMessage });
            void (0, notifyListener_1.notifyOnRoomChangedById)(rid);
            return createdMessage;
        });
    }
    beforeSave(_a) {
        return __awaiter(this, arguments, void 0, function* ({ message, room, user, }) {
            // TODO looks like this one was not being used (so I'll left it commented)
            // await this.joinDiscussionOnMessage({ message, room, user });
            if (!BeforeFederationActions_1.FederationActions.shouldPerformAction(message, room)) {
                throw new utils_1.FederationMatrixInvalidConfigurationError('Unable to send message');
            }
            message = yield BeforeSaveMentions_1.mentionServer.execute(message);
            message = yield this.cannedResponse.replacePlaceholders({ message, room, user });
            message = yield this.badWords.filterBadWords({ message });
            message = yield this.markdownParser.parseMarkdown({ message, config: this.getMarkdownConfig() });
            message = yield this.spotify.convertSpotifyLinks({ message });
            message = yield this.jumpToMessage.createAttachmentForMessageURLs({
                message,
                user,
                config: {
                    chainLimit: server_1.settings.get('Message_QuoteChainLimit'),
                    siteUrl: server_1.settings.get('Site_Url'),
                    useRealName: server_1.settings.get('UI_Use_Real_Name'),
                },
            });
            if (!this.isEditedOrOld(message)) {
                yield Promise.all([
                    this.checkMAC.isWithinLimits({ message, room }),
                    this.preventMention.preventMention({ message, user, mention: 'all', permission: 'mention-all' }),
                    this.preventMention.preventMention({ message, user, mention: 'here', permission: 'mention-here' }),
                ]);
            }
            return message;
        });
    }
    getMarkdownConfig() {
        const customDomains = server_1.settings.get('Message_CustomDomain_AutoLink')
            ? server_1.settings
                .get('Message_CustomDomain_AutoLink')
                .split(',')
                .map((domain) => domain.trim())
            : [];
        return Object.assign({ colors: server_1.settings.get('HexColorPreview_Enabled'), emoticons: true, customDomains }, (server_1.settings.get('Katex_Enabled') && {
            katex: {
                dollarSyntax: server_1.settings.get('Katex_Dollar_Syntax'),
                parenthesisSyntax: server_1.settings.get('Katex_Parenthesis_Syntax'),
            },
        }));
    }
    isEditedOrOld(message) {
        return (0, core_typings_1.isEditedMessage)(message) || !message.ts || Math.abs(Date.now() - message.ts.getTime()) > 60000;
    }
    // joinDiscussionOnMessage
    // private async joinDiscussionOnMessage({ message, room, user }: { message: IMessage; room: IRoom; user: IUser }) {
    // 	// abort if room is not a discussion
    // 	if (!room.prid) {
    // 		return;
    // 	}
    // 	// check if user already joined the discussion
    // 	const sub = await Subscriptions.findOneByRoomIdAndUserId(room._id, message.u._id, {
    // 		projection: { _id: 1 },
    // 	});
    // 	if (sub) {
    // 		return;
    // 	}
    // 	await Room.join({ room, user });
    // }
    beforeReacted(message, room) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!BeforeFederationActions_1.FederationActions.shouldPerformAction(message, room)) {
                throw new utils_1.FederationMatrixInvalidConfigurationError('Unable to react to message');
            }
        });
    }
    beforeDelete(message, room) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!BeforeFederationActions_1.FederationActions.shouldPerformAction(message, room)) {
                throw new utils_1.FederationMatrixInvalidConfigurationError('Unable to delete message');
            }
        });
    }
}
exports.MessageService = MessageService;
