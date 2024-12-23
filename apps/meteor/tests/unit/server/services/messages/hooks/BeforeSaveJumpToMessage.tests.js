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
const chai_1 = require("chai");
const BeforeSaveJumpToMessage_1 = require("../../../../../../server/services/messages/hooks/BeforeSaveJumpToMessage");
const createMessage = (msg, extra = {}) => (Object.assign({ _id: 'random', rid: 'GENERAL', ts: new Date(), u: {
        _id: 'userId',
        username: 'username',
    }, _updatedAt: new Date(), msg: msg }, extra));
const createUser = (username) => ({
    _id: 'userId',
    username,
    name: 'name',
    language: 'en',
});
const createRoom = (extra = {}) => (Object.assign({ _id: 'GENERAL', t: 'c', u: {
        _id: 'userId',
        username: 'username',
        name: 'name',
    }, msgs: 1, usersCount: 1, _updatedAt: new Date() }, extra));
const countDeep = (msg, deep = 1) => {
    if (!msg) {
        return deep - 1;
    }
    if (Array.isArray(msg === null || msg === void 0 ? void 0 : msg.attachments) && msg.attachments.length > 0) {
        return msg.attachments.reduce((count, att) => Math.max(countDeep(att, deep + 1), count), 0);
    }
    return deep - 1;
};
describe('Create attachments for message URLs', () => {
    it('should return message without attatchment and URLs if no URL provided', () => __awaiter(void 0, void 0, void 0, function* () {
        const jumpToMessage = new BeforeSaveJumpToMessage_1.BeforeSaveJumpToMessage({
            getMessages: () => __awaiter(void 0, void 0, void 0, function* () { return [createMessage('linked message', { _id: 'linked' })]; }),
            getRooms: () => __awaiter(void 0, void 0, void 0, function* () { return [createRoom()]; }),
            canAccessRoom: () => __awaiter(void 0, void 0, void 0, function* () { return true; }),
            getUserAvatarURL: () => 'url',
        });
        const message = yield jumpToMessage.createAttachmentForMessageURLs({
            message: createMessage('hey'),
            user: createUser(),
            config: {
                chainLimit: 10,
                siteUrl: 'https://open.rocket.chat',
                useRealName: true,
            },
        });
        return (0, chai_1.expect)(message).to.not.have.property('urls');
    }));
    it('should do nothing if URL is not from SiteUrl', () => __awaiter(void 0, void 0, void 0, function* () {
        const jumpToMessage = new BeforeSaveJumpToMessage_1.BeforeSaveJumpToMessage({
            getMessages: () => __awaiter(void 0, void 0, void 0, function* () { return [createMessage('linked message', { _id: 'linked' })]; }),
            getRooms: () => __awaiter(void 0, void 0, void 0, function* () { return [createRoom()]; }),
            canAccessRoom: () => __awaiter(void 0, void 0, void 0, function* () { return true; }),
            getUserAvatarURL: () => 'url',
        });
        const message = yield jumpToMessage.createAttachmentForMessageURLs({
            message: createMessage('hey', { urls: [{ url: 'https://google.com' }] }),
            user: createUser(),
            config: {
                chainLimit: 10,
                siteUrl: 'https://open.rocket.chat',
                useRealName: true,
            },
        });
        (0, chai_1.expect)(message).to.have.property('urls').of.length(1);
        (0, chai_1.expect)(message).to.not.have.property('attachments');
    }));
    it('should do nothing if URL is from SiteUrl but not have a query string', () => __awaiter(void 0, void 0, void 0, function* () {
        const jumpToMessage = new BeforeSaveJumpToMessage_1.BeforeSaveJumpToMessage({
            getMessages: () => __awaiter(void 0, void 0, void 0, function* () { return [createMessage('linked message', { _id: 'linked' })]; }),
            getRooms: () => __awaiter(void 0, void 0, void 0, function* () { return [createRoom()]; }),
            canAccessRoom: () => __awaiter(void 0, void 0, void 0, function* () { return true; }),
            getUserAvatarURL: () => 'url',
        });
        const message = yield jumpToMessage.createAttachmentForMessageURLs({
            message: createMessage('hey', { urls: [{ url: 'https://open.rocket.chat' }] }),
            user: createUser(),
            config: {
                chainLimit: 10,
                siteUrl: 'https://open.rocket.chat',
                useRealName: true,
            },
        });
        (0, chai_1.expect)(message).to.have.property('urls').of.length(1);
        (0, chai_1.expect)(message).to.not.have.property('attachments');
    }));
    it('should do nothing if URL is from SiteUrl but not have a msgId query string', () => __awaiter(void 0, void 0, void 0, function* () {
        const jumpToMessage = new BeforeSaveJumpToMessage_1.BeforeSaveJumpToMessage({
            getMessages: () => __awaiter(void 0, void 0, void 0, function* () { return [createMessage('linked message', { _id: 'linked' })]; }),
            getRooms: () => __awaiter(void 0, void 0, void 0, function* () { return [createRoom()]; }),
            canAccessRoom: () => __awaiter(void 0, void 0, void 0, function* () { return true; }),
            getUserAvatarURL: () => 'url',
        });
        const message = yield jumpToMessage.createAttachmentForMessageURLs({
            message: createMessage('hey', { urls: [{ url: 'https://open.rocket.chat/?token=value' }] }),
            user: createUser(),
            config: {
                chainLimit: 10,
                siteUrl: 'https://open.rocket.chat',
                useRealName: true,
            },
        });
        (0, chai_1.expect)(message).to.have.property('urls').of.length(1);
        (0, chai_1.expect)(message).to.not.have.property('attachments');
    }));
    it('should do nothing if it do not find a msg from the URL', () => __awaiter(void 0, void 0, void 0, function* () {
        const jumpToMessage = new BeforeSaveJumpToMessage_1.BeforeSaveJumpToMessage({
            getMessages: () => __awaiter(void 0, void 0, void 0, function* () { return []; }),
            getRooms: () => __awaiter(void 0, void 0, void 0, function* () { return [createRoom()]; }),
            canAccessRoom: () => __awaiter(void 0, void 0, void 0, function* () { return true; }),
            getUserAvatarURL: () => 'url',
        });
        const message = yield jumpToMessage.createAttachmentForMessageURLs({
            message: createMessage('hey', { urls: [{ url: 'https://open.rocket.chat/?msg=value' }] }),
            user: createUser(),
            config: {
                chainLimit: 10,
                siteUrl: 'https://open.rocket.chat',
                useRealName: true,
            },
        });
        (0, chai_1.expect)(message).to.have.property('urls').of.length(1);
        (0, chai_1.expect)(message).to.not.have.property('attachments');
    }));
    it('should do nothing if it cannot find the room of the message from the URL', () => __awaiter(void 0, void 0, void 0, function* () {
        const jumpToMessage = new BeforeSaveJumpToMessage_1.BeforeSaveJumpToMessage({
            getMessages: () => __awaiter(void 0, void 0, void 0, function* () { return [createMessage('linked message', { _id: 'linked' })]; }),
            getRooms: () => __awaiter(void 0, void 0, void 0, function* () { return []; }),
            canAccessRoom: () => __awaiter(void 0, void 0, void 0, function* () { return true; }),
            getUserAvatarURL: () => 'url',
        });
        const message = yield jumpToMessage.createAttachmentForMessageURLs({
            message: createMessage('hey', { urls: [{ url: 'https://open.rocket.chat/?msg=value' }] }),
            user: createUser(),
            config: {
                chainLimit: 10,
                siteUrl: 'https://open.rocket.chat',
                useRealName: true,
            },
        });
        (0, chai_1.expect)(message).to.have.property('urls').of.length(1);
        (0, chai_1.expect)(message).to.not.have.property('attachments');
    }));
    it('should do nothing if user dont have access to the room of the message from the URL', () => __awaiter(void 0, void 0, void 0, function* () {
        const jumpToMessage = new BeforeSaveJumpToMessage_1.BeforeSaveJumpToMessage({
            getMessages: () => __awaiter(void 0, void 0, void 0, function* () { return [createMessage('linked message', { _id: 'linked' })]; }),
            getRooms: () => __awaiter(void 0, void 0, void 0, function* () { return [createRoom()]; }),
            canAccessRoom: () => __awaiter(void 0, void 0, void 0, function* () { return false; }),
            getUserAvatarURL: () => 'url',
        });
        const message = yield jumpToMessage.createAttachmentForMessageURLs({
            message: createMessage('hey', { urls: [{ url: 'https://open.rocket.chat/?msg=value' }] }),
            user: createUser(),
            config: {
                chainLimit: 10,
                siteUrl: 'https://open.rocket.chat',
                useRealName: true,
            },
        });
        (0, chai_1.expect)(message).to.have.property('urls').of.length(1);
        (0, chai_1.expect)(message).to.not.have.property('attachments');
    }));
    it('should not duplicate quote attachment from the message if message_link is the same as the URL', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const jumpToMessage = new BeforeSaveJumpToMessage_1.BeforeSaveJumpToMessage({
            getMessages: () => __awaiter(void 0, void 0, void 0, function* () { return [createMessage('linked message', { _id: 'linked' })]; }),
            getRooms: () => __awaiter(void 0, void 0, void 0, function* () { return [createRoom()]; }),
            canAccessRoom: () => __awaiter(void 0, void 0, void 0, function* () { return true; }),
            getUserAvatarURL: () => 'url',
        });
        const message = yield jumpToMessage.createAttachmentForMessageURLs({
            message: createMessage('hey', {
                urls: [{ url: 'https://open.rocket.chat/linked?msg=linked' }],
                attachments: [
                    {
                        text: 'old attachment',
                        author_name: 'username',
                        author_icon: 'url',
                        message_link: 'https://open.rocket.chat/linked?msg=linked',
                        ts: new Date(),
                    },
                ],
            }),
            user: createUser(),
            config: {
                chainLimit: 10,
                siteUrl: 'https://open.rocket.chat',
                useRealName: true,
            },
        });
        (0, chai_1.expect)(message).to.have.property('urls').and.to.have.lengthOf(1);
        const [url] = (_a = message.urls) !== null && _a !== void 0 ? _a : [];
        (0, chai_1.expect)(url).to.include({
            url: 'https://open.rocket.chat/linked?msg=linked',
            ignoreParse: true,
        });
        (0, chai_1.expect)(message).to.have.property('attachments').and.to.have.lengthOf(1);
        const [attachment] = (_b = message.attachments) !== null && _b !== void 0 ? _b : [];
        (0, chai_1.expect)(attachment).to.have.property('text', 'linked message');
    }));
    it('should remove existing quote attachments provided in the message if they are not in the urls field', () => __awaiter(void 0, void 0, void 0, function* () {
        const jumpToMessage = new BeforeSaveJumpToMessage_1.BeforeSaveJumpToMessage({
            getMessages: () => __awaiter(void 0, void 0, void 0, function* () { return [createMessage('linked message', { _id: 'linked' })]; }),
            getRooms: () => __awaiter(void 0, void 0, void 0, function* () { return [createRoom()]; }),
            canAccessRoom: () => __awaiter(void 0, void 0, void 0, function* () { return true; }),
            getUserAvatarURL: () => 'url',
        });
        const message = yield jumpToMessage.createAttachmentForMessageURLs({
            message: createMessage('hey', {
                urls: [],
                attachments: [
                    {
                        text: 'old attachment',
                        author_name: 'username',
                        author_icon: 'url',
                        message_link: 'https://open.rocket.chat/linked?msg=linked',
                        ts: new Date(),
                    },
                ],
            }),
            user: createUser(),
            config: {
                chainLimit: 10,
                siteUrl: 'https://open.rocket.chat',
                useRealName: true,
            },
        });
        (0, chai_1.expect)(message).to.have.property('attachments').and.to.have.lengthOf(0);
    }));
    it('should not consider attachments with undefined message_link as quotes', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const jumpToMessage = new BeforeSaveJumpToMessage_1.BeforeSaveJumpToMessage({
            getMessages: () => __awaiter(void 0, void 0, void 0, function* () { return [createMessage('linked message', { _id: 'linked' })]; }),
            getRooms: () => __awaiter(void 0, void 0, void 0, function* () { return [createRoom()]; }),
            canAccessRoom: () => __awaiter(void 0, void 0, void 0, function* () { return true; }),
            getUserAvatarURL: () => 'url',
        });
        const message = yield jumpToMessage.createAttachmentForMessageURLs({
            message: createMessage('hey', {
                urls: [],
                attachments: [
                    {
                        text: 'old attachment',
                        author_name: 'username',
                        author_icon: 'url',
                        message_link: undefined,
                        ts: new Date(),
                    },
                ],
            }),
            user: createUser(),
            config: {
                chainLimit: 10,
                siteUrl: 'https://open.rocket.chat',
                useRealName: true,
            },
        });
        (0, chai_1.expect)(message).to.have.property('attachments').and.to.have.lengthOf(1);
        const [attachment] = (_a = message.attachments) !== null && _a !== void 0 ? _a : [];
        (0, chai_1.expect)(attachment).to.have.property('text', 'old attachment');
    }));
    it('should return an attachment with the message content if a message URL is provided', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const jumpToMessage = new BeforeSaveJumpToMessage_1.BeforeSaveJumpToMessage({
            getMessages: () => __awaiter(void 0, void 0, void 0, function* () { return [createMessage('linked message', { _id: 'linked' })]; }),
            getRooms: () => __awaiter(void 0, void 0, void 0, function* () { return [createRoom()]; }),
            canAccessRoom: () => __awaiter(void 0, void 0, void 0, function* () { return true; }),
            getUserAvatarURL: () => 'url',
        });
        const message = yield jumpToMessage.createAttachmentForMessageURLs({
            message: createMessage('hey', { urls: [{ url: 'https://open.rocket.chat/linked?msg=linked' }] }),
            user: createUser(),
            config: {
                chainLimit: 10,
                siteUrl: 'https://open.rocket.chat',
                useRealName: true,
            },
        });
        (0, chai_1.expect)(message).to.have.property('urls').and.to.have.lengthOf(1);
        const [url] = (_a = message.urls) !== null && _a !== void 0 ? _a : [];
        (0, chai_1.expect)(url).to.include({
            url: 'https://open.rocket.chat/linked?msg=linked',
            ignoreParse: true,
        });
        (0, chai_1.expect)(message).to.have.property('attachments').and.to.have.lengthOf(1);
        const [attachment] = (_b = message.attachments) !== null && _b !== void 0 ? _b : [];
        (0, chai_1.expect)(attachment).to.have.property('text', 'linked message');
    }));
    it('should respect chain limit config', () => __awaiter(void 0, void 0, void 0, function* () {
        const jumpToMessage = new BeforeSaveJumpToMessage_1.BeforeSaveJumpToMessage({
            getMessages: () => __awaiter(void 0, void 0, void 0, function* () {
                return [
                    createMessage('linked message', {
                        _id: 'linked',
                        attachments: [
                            {
                                text: 'chained 1',
                                author_name: 'username',
                                author_icon: 'url',
                                ts: new Date(),
                                message_link: 'https://open.rocket.chat/linked?msg=linkedMsgId',
                                attachments: [
                                    {
                                        text: 'chained 2',
                                        author_name: 'username',
                                        author_icon: 'url',
                                        message_link: 'https://open.rocket.chat/linked?msg=linkedMsgId',
                                        ts: new Date(),
                                        attachments: [
                                            {
                                                text: 'chained 3',
                                                author_name: 'username',
                                                author_icon: 'url',
                                                message_link: 'https://open.rocket.chat/linked?msg=linkedMsgId',
                                                ts: new Date(),
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    }),
                ];
            }),
            getRooms: () => __awaiter(void 0, void 0, void 0, function* () { return [createRoom()]; }),
            canAccessRoom: () => __awaiter(void 0, void 0, void 0, function* () { return true; }),
            getUserAvatarURL: () => 'url',
        });
        const message = yield jumpToMessage.createAttachmentForMessageURLs({
            message: createMessage('hey', {
                urls: [{ url: 'https://open.rocket.chat/linked?msg=linked' }],
            }),
            user: createUser(),
            config: {
                chainLimit: 3,
                siteUrl: 'https://open.rocket.chat',
                useRealName: true,
            },
        });
        (0, chai_1.expect)(message).to.have.property('urls').and.to.have.lengthOf(1);
        (0, chai_1.expect)(message).to.have.property('attachments').and.to.have.lengthOf(1);
        const deep = countDeep(message);
        (0, chai_1.expect)(deep).to.be.eq(3);
    }));
    it('should create the attachment if cannot access room but message has a livechat token', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const jumpToMessage = new BeforeSaveJumpToMessage_1.BeforeSaveJumpToMessage({
            getMessages: () => __awaiter(void 0, void 0, void 0, function* () { return [createMessage('linked message', { _id: 'linked' })]; }),
            getRooms: () => __awaiter(void 0, void 0, void 0, function* () { return [createRoom({ t: 'l', v: { token: 'livechatToken' } })]; }),
            canAccessRoom: () => __awaiter(void 0, void 0, void 0, function* () { return false; }),
            getUserAvatarURL: () => 'url',
        });
        const message = yield jumpToMessage.createAttachmentForMessageURLs({
            message: createMessage('hey', {
                urls: [{ url: 'https://open.rocket.chat/linked?msg=linked' }],
                token: 'livechatToken',
            }),
            user: createUser(),
            config: {
                chainLimit: 10,
                siteUrl: 'https://open.rocket.chat',
                useRealName: true,
            },
        });
        (0, chai_1.expect)(message).to.have.property('urls').and.to.have.lengthOf(1);
        const [url] = (_a = message.urls) !== null && _a !== void 0 ? _a : [];
        (0, chai_1.expect)(url).to.include({
            url: 'https://open.rocket.chat/linked?msg=linked',
            ignoreParse: true,
        });
        (0, chai_1.expect)(message).to.have.property('attachments').and.to.have.lengthOf(1);
        const [attachment] = (_b = message.attachments) !== null && _b !== void 0 ? _b : [];
        (0, chai_1.expect)(attachment).to.have.property('text', 'linked message');
    }));
    it('should do nothing if cannot access room but message has a livechat token but is not from the room does not have a token', () => __awaiter(void 0, void 0, void 0, function* () {
        const jumpToMessage = new BeforeSaveJumpToMessage_1.BeforeSaveJumpToMessage({
            getMessages: () => __awaiter(void 0, void 0, void 0, function* () { return [createMessage('linked message', { _id: 'linked' })]; }),
            getRooms: () => __awaiter(void 0, void 0, void 0, function* () { return [createRoom({ t: 'l' })]; }),
            canAccessRoom: () => __awaiter(void 0, void 0, void 0, function* () { return false; }),
            getUserAvatarURL: () => 'url',
        });
        const message = yield jumpToMessage.createAttachmentForMessageURLs({
            message: createMessage('hey', {
                urls: [{ url: 'https://open.rocket.chat/linked?msg=linked' }],
                token: 'another-token',
            }),
            user: createUser(),
            config: {
                chainLimit: 10,
                siteUrl: 'https://open.rocket.chat',
                useRealName: true,
            },
        });
        (0, chai_1.expect)(message).to.have.property('urls').and.to.have.lengthOf(1);
        (0, chai_1.expect)(message).to.not.have.property('attachments');
    }));
    it('should remove the clean up the attachments of the quoted message property if chain limit < 2', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const jumpToMessage = new BeforeSaveJumpToMessage_1.BeforeSaveJumpToMessage({
            getMessages: () => __awaiter(void 0, void 0, void 0, function* () {
                return [
                    createMessage('linked message', {
                        _id: 'linkedMsgId',
                        attachments: [
                            {
                                text: 'chained 1',
                                author_name: 'username',
                                author_icon: 'url',
                                ts: new Date(),
                            },
                        ],
                    }),
                ];
            }),
            getRooms: () => __awaiter(void 0, void 0, void 0, function* () { return [createRoom()]; }),
            canAccessRoom: () => __awaiter(void 0, void 0, void 0, function* () { return true; }),
            getUserAvatarURL: () => 'url',
        });
        const message = yield jumpToMessage.createAttachmentForMessageURLs({
            message: createMessage('hey', {
                urls: [{ url: 'https://open.rocket.chat/linked?msg=linkedMsgId' }],
            }),
            user: createUser(),
            config: {
                chainLimit: 1,
                siteUrl: 'https://open.rocket.chat',
                useRealName: true,
            },
        });
        (0, chai_1.expect)(message).to.have.property('urls').and.to.have.lengthOf(1);
        (0, chai_1.expect)(message).to.have.property('attachments').and.to.have.lengthOf(1);
        const deep = countDeep(message);
        (0, chai_1.expect)(deep).to.be.eq(1);
        const [attachment] = (_a = message.attachments) !== null && _a !== void 0 ? _a : [];
        (0, chai_1.expect)(attachment).to.have.property('attachments').and.to.have.lengthOf(0);
        (0, chai_1.expect)(attachment).to.include({
            text: 'linked message',
            author_name: 'username',
            author_icon: 'url',
            message_link: 'https://open.rocket.chat/linked?msg=linkedMsgId',
        });
    }));
    it('should work for multiple URLs', () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const jumpToMessage = new BeforeSaveJumpToMessage_1.BeforeSaveJumpToMessage({
            getMessages: () => __awaiter(void 0, void 0, void 0, function* () {
                return [
                    createMessage('first message', {
                        _id: 'msg1',
                    }),
                    createMessage('second message', {
                        _id: 'msg2',
                    }),
                ];
            }),
            getRooms: () => __awaiter(void 0, void 0, void 0, function* () { return [createRoom()]; }),
            canAccessRoom: () => __awaiter(void 0, void 0, void 0, function* () { return true; }),
            getUserAvatarURL: () => 'url',
        });
        const message = yield jumpToMessage.createAttachmentForMessageURLs({
            message: createMessage('hey', {
                urls: [{ url: 'https://open.rocket.chat/linked?msg=msg1' }, { url: 'https://open.rocket.chat/linked?msg=msg2' }],
            }),
            user: createUser(),
            config: {
                chainLimit: 1,
                siteUrl: 'https://open.rocket.chat',
                useRealName: true,
            },
        });
        (0, chai_1.expect)(message).to.have.property('urls').and.to.have.lengthOf(2);
        (0, chai_1.expect)(message).to.have.property('attachments').and.to.have.lengthOf(2);
        const deep = countDeep(message);
        (0, chai_1.expect)(deep).to.be.eq(1);
        const [att1, att2] = (_a = message.attachments) !== null && _a !== void 0 ? _a : [];
        (0, chai_1.expect)(att1).to.include({
            text: 'first message',
            message_link: 'https://open.rocket.chat/linked?msg=msg1',
        });
        (0, chai_1.expect)(att2).to.include({
            text: 'second message',
            message_link: 'https://open.rocket.chat/linked?msg=msg2',
        });
    }));
});
