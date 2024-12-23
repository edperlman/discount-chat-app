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
exports.AppThreadsConverter = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const cachedFunction_1 = require("./cachedFunction");
const transformMappedData_1 = require("./transformMappedData");
class AppThreadsConverter {
    constructor(orch) {
        this.orch = orch;
        this.orch = orch;
    }
    convertById(threadId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {
                $or: [
                    {
                        _id: threadId,
                    },
                    {
                        tmid: threadId,
                    },
                ],
            };
            const mainMessage = yield models_1.Messages.findOneById(threadId);
            if (!mainMessage) {
                return [];
            }
            const replies = yield models_1.Messages.find(query).toArray();
            const room = (yield this.orch.getConverters().get('rooms').convertById(mainMessage.rid));
            if (!room) {
                return [];
            }
            const convertToApp = (0, cachedFunction_1.cachedFunction)(this.orch.getConverters().get('users').convertToApp.bind(this.orch.getConverters().get('users')));
            const convertUserById = (0, cachedFunction_1.cachedFunction)(this.orch.getConverters().get('users').convertById.bind(this.orch.getConverters().get('users')));
            return Promise.all([mainMessage, ...replies].map((msg) => this.convertMessage(msg, room, convertUserById, convertToApp)));
        });
    }
    convertMessage(msgObj, room, convertUserById, convertToApp) {
        return __awaiter(this, void 0, void 0, function* () {
            const map = {
                id: '_id',
                threadId: 'tmid',
                reactions: 'reactions',
                parseUrls: 'parseUrls',
                text: 'msg',
                createdAt: 'ts',
                updatedAt: '_updatedAt',
                editedAt: 'editedAt',
                emoji: 'emoji',
                avatarUrl: 'avatar',
                alias: 'alias',
                file: 'file',
                customFields: 'customFields',
                groupable: 'groupable',
                token: 'token',
                blocks: 'blocks',
                room: () => room,
                editor: (message) => __awaiter(this, void 0, void 0, function* () {
                    if (!(0, core_typings_1.isEditedMessage)(message)) {
                        return undefined;
                    }
                    const { editedBy } = message;
                    return convertUserById(editedBy._id);
                }),
                attachments: (message) => __awaiter(this, void 0, void 0, function* () {
                    if (!message.attachments) {
                        return undefined;
                    }
                    const result = yield this._convertAttachmentsToApp(message.attachments);
                    delete message.attachments;
                    return result;
                }),
                sender: (message) => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    // #TODO: #AppsEngineTypes - Remove explicit types and typecasts once the apps-engine definition/implementation mismatch is fixed.
                    if (!((_a = message.u) === null || _a === void 0 ? void 0 : _a._id)) {
                        return undefined;
                    }
                    let user = yield convertUserById(message.u._id);
                    // When the sender of the message is a Guest (livechat) and not a user
                    if (!user) {
                        user = yield convertToApp(message.u);
                    }
                    return user;
                }),
            };
            // #TODO: #AppsEngineTypes - Remove explicit types and typecasts once the apps-engine definition/implementation mismatch is fixed.
            const msgData = Object.assign(Object.assign({}, msgObj), { reactions: msgObj.reactions });
            return (0, transformMappedData_1.transformMappedData)(msgData, map);
        });
    }
    _convertAttachmentsToApp(attachments) {
        return __awaiter(this, void 0, void 0, function* () {
            const map = {
                collapsed: 'collapsed',
                color: 'color',
                text: 'text',
                timestampLink: 'message_link',
                thumbnailUrl: 'thumb_url',
                imageDimensions: 'image_dimensions',
                imagePreview: 'image_preview',
                imageUrl: 'image_url',
                imageType: 'image_type',
                imageSize: 'image_size',
                audioUrl: 'audio_url',
                audioType: 'audio_type',
                audioSize: 'audio_size',
                videoUrl: 'video_url',
                videoType: 'video_type',
                videoSize: 'video_size',
                fields: 'fields',
                actionButtonsAlignment: 'button_alignment',
                actions: 'actions',
                type: 'type',
                description: 'description',
                author: (attachment) => {
                    if (!('author_name' in attachment)) {
                        return;
                    }
                    const { author_name: name, author_link: link, author_icon: icon } = attachment;
                    delete attachment.author_name;
                    delete attachment.author_link;
                    delete attachment.author_icon;
                    return { name, link, icon };
                },
                title: (attachment) => {
                    const { title: value, title_link: link, title_link_download: displayDownloadLink } = attachment;
                    delete attachment.title;
                    delete attachment.title_link;
                    delete attachment.title_link_download;
                    return { value, link, displayDownloadLink };
                },
                timestamp: (attachment) => {
                    const result = attachment.ts ? new Date(attachment.ts) : undefined;
                    delete attachment.ts;
                    return result;
                },
            };
            return Promise.all(attachments.map((attachment) => __awaiter(this, void 0, void 0, function* () { return (0, transformMappedData_1.transformMappedData)(attachment, map); })));
        });
    }
}
exports.AppThreadsConverter = AppThreadsConverter;
