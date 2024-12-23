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
exports.RocketChatMessageAdapter = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const federation_id_escape_helper_1 = require("./federation-id-escape-helper");
const deleteMessage_1 = require("../../../../../../app/lib/server/functions/deleteMessage");
const sendMessage_1 = require("../../../../../../app/lib/server/functions/sendMessage");
const updateMessage_1 = require("../../../../../../app/lib/server/functions/updateMessage");
const setReaction_1 = require("../../../../../../app/reactions/server/setReaction");
const getURL_1 = require("../../../../../../app/utils/server/getURL");
const roomCoordinator_1 = require("../../../../../lib/rooms/roomCoordinator");
const to_external_parser_formatter_1 = require("../converters/to-external-parser-formatter");
const DEFAULT_EMOJI_TO_REACT_WHEN_RECEIVED_EMOJI_DOES_NOT_EXIST = ':grey_question:';
class RocketChatMessageAdapter {
    sendMessage(user, room, rawMessage, externalFormattedMessage, externalEventId, homeServerDomain) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, sendMessage_1.sendMessage)(user.getInternalReference(), {
                federation: { eventId: externalEventId },
                msg: (0, to_external_parser_formatter_1.toInternalMessageFormat)({
                    rawMessage,
                    formattedMessage: externalFormattedMessage,
                    homeServerDomain,
                    senderExternalId: user.getExternalId(),
                }),
            }, room.getInternalReference());
        });
    }
    sendQuoteMessage(user, federatedRoom, externalFormattedText, rawMessage, externalEventId, messageToReplyTo, homeServerDomain) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = federatedRoom.getInternalReference();
            yield (0, sendMessage_1.sendMessage)(user.getInternalReference(), {
                federation: { eventId: externalEventId },
                msg: yield this.getMessageToReplyToWhenQuoting(federatedRoom, messageToReplyTo, externalFormattedText, rawMessage, homeServerDomain, user),
            }, room);
        });
    }
    sendThreadMessage(user, room, rawMessage, externalEventId, parentMessageId, externalFormattedMessage, homeServerDomain) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, sendMessage_1.sendMessage)(user.getInternalReference(), {
                federation: { eventId: externalEventId },
                msg: (0, to_external_parser_formatter_1.toInternalMessageFormat)({
                    rawMessage,
                    formattedMessage: externalFormattedMessage,
                    homeServerDomain,
                    senderExternalId: user.getExternalId(),
                }),
                tmid: parentMessageId,
            }, room.getInternalReference());
        });
    }
    sendThreadQuoteMessage(user, federatedRoom, rawMessage, externalEventId, messageToReplyTo, homeServerDomain, parentMessageId, externalFormattedText) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = federatedRoom.getInternalReference();
            yield (0, sendMessage_1.sendMessage)(user.getInternalReference(), {
                federation: { eventId: externalEventId },
                msg: yield this.getMessageToReplyToWhenQuoting(federatedRoom, messageToReplyTo, externalFormattedText, rawMessage, homeServerDomain, user),
                tmid: parentMessageId,
            }, room);
        });
    }
    editMessage(user, newRawMessageText, newExternalFormattedMessage, originalMessage, homeServerDomain) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedMessage = Object.assign(Object.assign({}, originalMessage), { msg: (0, to_external_parser_formatter_1.toInternalMessageFormat)({
                    rawMessage: newRawMessageText,
                    formattedMessage: newExternalFormattedMessage,
                    homeServerDomain,
                    senderExternalId: user.getExternalId(),
                }) });
            yield (0, updateMessage_1.updateMessage)(updatedMessage, user.getInternalReference(), originalMessage);
        });
    }
    getMessageToReplyToWhenQuoting(federatedRoom, messageToReplyTo, externalFormattedMessage, rawMessage, homeServerDomain, senderUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = federatedRoom.getInternalReference();
            const messageToReplyToUrl = (0, getURL_1.getURL)(`${roomCoordinator_1.roomCoordinator.getRouteLink(room.t, { rid: room._id, name: room.name })}?msg=${messageToReplyTo._id}`, { full: true });
            return (0, to_external_parser_formatter_1.toInternalQuoteMessageFormat)({
                messageToReplyToUrl,
                formattedMessage: externalFormattedMessage,
                rawMessage,
                homeServerDomain,
                senderExternalId: senderUser.getExternalId(),
            });
        });
    }
    getMessageToEditWhenReplyAndQuote(editedMessage, newExternalFormattedMessage, newRawMessageText, homeServerDomain, senderUser) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const quotedMessageUrl = (_c = (_b = (_a = editedMessage.attachments) === null || _a === void 0 ? void 0 : _a.filter(core_typings_1.isQuoteAttachment)) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.message_link;
            return (0, to_external_parser_formatter_1.toInternalQuoteMessageFormat)({
                messageToReplyToUrl: quotedMessageUrl || '',
                formattedMessage: newExternalFormattedMessage,
                rawMessage: newRawMessageText,
                homeServerDomain,
                senderExternalId: senderUser.getExternalId(),
            });
        });
    }
    editQuotedMessage(user, newRawMessageText, newExternalFormattedMessage, editedMessage, homeServerDomain) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedMessage = Object.assign(Object.assign({}, editedMessage), { msg: yield this.getMessageToEditWhenReplyAndQuote(editedMessage, newExternalFormattedMessage, newRawMessageText, homeServerDomain, user) });
            yield (0, updateMessage_1.updateMessage)(updatedMessage, user.getInternalReference(), editedMessage);
        });
    }
    sendFileMessage(user, room, files, attachments, externalEventId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, sendMessage_1.sendMessage)(user.getInternalReference(), {
                federation: { eventId: externalEventId },
                rid: room.getInternalId(),
                ts: new Date(),
                file: (files || [])[0],
                files,
                attachments,
            }, room.getInternalReference());
        });
    }
    sendQuoteFileMessage(user, federatedRoom, files, attachments, externalEventId, messageToReplyTo, homeServerDomain) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = federatedRoom.getInternalReference();
            yield (0, sendMessage_1.sendMessage)(user.getInternalReference(), {
                federation: { eventId: externalEventId },
                rid: federatedRoom.getInternalId(),
                ts: new Date(),
                file: (files || [])[0],
                files,
                attachments,
                msg: yield this.getMessageToReplyToWhenQuoting(federatedRoom, messageToReplyTo, '', '', homeServerDomain, user),
            }, room);
        });
    }
    sendThreadFileMessage(user, room, files, attachments, externalEventId, parentMessageId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, sendMessage_1.sendMessage)(user.getInternalReference(), {
                federation: { eventId: externalEventId },
                rid: room.getInternalId(),
                ts: new Date(),
                file: (files || [])[0],
                files,
                attachments,
                tmid: parentMessageId,
            }, room.getInternalReference());
        });
    }
    sendThreadQuoteFileMessage(user, federatedRoom, files, attachments, externalEventId, messageToReplyTo, homeServerDomain, parentMessageId) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = federatedRoom.getInternalReference();
            const messageToReplyToUrl = (0, getURL_1.getURL)(`${roomCoordinator_1.roomCoordinator.getRouteLink(room.t, { rid: room._id, name: room.name })}?msg=${messageToReplyTo._id}`, { full: true });
            yield (0, sendMessage_1.sendMessage)(user.getInternalReference(), {
                federation: { eventId: externalEventId },
                rid: federatedRoom.getInternalId(),
                ts: new Date(),
                file: (files || [])[0],
                files,
                attachments,
                msg: yield (0, to_external_parser_formatter_1.toInternalQuoteMessageFormat)({
                    messageToReplyToUrl,
                    rawMessage: '',
                    senderExternalId: user.getExternalId(),
                    formattedMessage: '',
                    homeServerDomain,
                }),
                tmid: parentMessageId,
            }, room);
        });
    }
    deleteMessage(message, user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, deleteMessage_1.deleteMessage)(message, user.getInternalReference());
        });
    }
    reactToMessage(user, message, reaction, externalEventId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                yield (0, setReaction_1.executeSetReaction)(user.getInternalId(), reaction, message._id);
                user.getUsername() &&
                    (yield models_1.Messages.setFederationReactionEventId(user.getUsername(), message._id, reaction, (0, federation_id_escape_helper_1.escapeExternalFederationEventId)(externalEventId)));
            }
            catch (error) {
                if ((_a = error === null || error === void 0 ? void 0 : error.message) === null || _a === void 0 ? void 0 : _a.includes('Invalid emoji provided.')) {
                    yield (0, setReaction_1.executeSetReaction)(user.getInternalId(), DEFAULT_EMOJI_TO_REACT_WHEN_RECEIVED_EMOJI_DOES_NOT_EXIST, message._id);
                }
            }
        });
    }
    unreactToMessage(user, message, reaction, externalEventId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, setReaction_1.executeSetReaction)(user.getInternalId(), reaction, message._id);
            yield models_1.Messages.unsetFederationReactionEventId((0, federation_id_escape_helper_1.escapeExternalFederationEventId)(externalEventId), message._id, reaction);
        });
    }
    findOneByFederationIdOnReactions(federationEventId, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return ((user.getUsername() &&
                models_1.Messages.findOneByFederationIdAndUsernameOnReactions((0, federation_id_escape_helper_1.escapeExternalFederationEventId)(federationEventId), user.getUsername())) ||
                undefined);
        });
    }
    getMessageByFederationId(federationEventId) {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.Messages.findOneByFederationId(federationEventId);
        });
    }
    setExternalFederationEventOnMessage(messageId, federationEventId) {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.Messages.setFederationEventIdById(messageId, federationEventId);
        });
    }
    unsetExternalFederationEventOnMessageReaction(externalEventId, message, reaction) {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.Messages.unsetFederationReactionEventId((0, federation_id_escape_helper_1.escapeExternalFederationEventId)(externalEventId), message._id, reaction);
        });
    }
    getMessageById(internalMessageId) {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.Messages.findOneById(internalMessageId);
        });
    }
    setExternalFederationEventOnMessageReaction(username, message, reaction, externalEventId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield models_1.Messages.setFederationReactionEventId(username, message._id, reaction, (0, federation_id_escape_helper_1.escapeExternalFederationEventId)(externalEventId));
        });
    }
}
exports.RocketChatMessageAdapter = RocketChatMessageAdapter;
