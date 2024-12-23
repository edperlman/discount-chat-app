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
exports.ModifyCreator = void 0;
const BlockBuilder_ts_1 = require("../builders/BlockBuilder.ts");
const MessageBuilder_ts_1 = require("../builders/MessageBuilder.ts");
const DiscussionBuilder_ts_1 = require("../builders/DiscussionBuilder.ts");
const LivechatMessageBuilder_ts_1 = require("../builders/LivechatMessageBuilder.ts");
const RoomBuilder_ts_1 = require("../builders/RoomBuilder.ts");
const UserBuilder_ts_1 = require("../builders/UserBuilder.ts");
const VideoConferenceBuilder_ts_1 = require("../builders/VideoConferenceBuilder.ts");
const AppObjectRegistry_ts_1 = require("../../../AppObjectRegistry.ts");
const require_ts_1 = require("../../../lib/require.ts");
const { UIHelper } = (0, require_ts_1.require)('@rocket.chat/apps-engine/server/misc/UIHelper.js');
const { RoomType } = (0, require_ts_1.require)('@rocket.chat/apps-engine/definition/rooms/RoomType.js');
const { UserType } = (0, require_ts_1.require)('@rocket.chat/apps-engine/definition/users/UserType.js');
const { RocketChatAssociationModel } = (0, require_ts_1.require)('@rocket.chat/apps-engine/definition/metadata/RocketChatAssociations.js');
class ModifyCreator {
    constructor(senderFn) {
        this.senderFn = senderFn;
    }
    getLivechatCreator() {
        return new Proxy({ __kind: 'getLivechatCreator' }, {
            get: (_target, prop) => {
                // It's not worthwhile to make an asynchronous request for such a simple method
                if (prop === 'createToken') {
                    return () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                }
                if (prop === 'toJSON') {
                    return () => ({});
                }
                return (...params) => this.senderFn({
                    method: `accessor:getModifier:getCreator:getLivechatCreator:${prop}`,
                    params,
                })
                    .then((response) => response.result)
                    .catch((err) => {
                    throw new Error(err.error);
                });
            },
        });
    }
    getUploadCreator() {
        return new Proxy({ __kind: 'getUploadCreator' }, {
            get: (_target, prop) => (...params) => prop === 'toJSON'
                ? {}
                : this.senderFn({
                    method: `accessor:getModifier:getCreator:getUploadCreator:${prop}`,
                    params,
                })
                    .then((response) => response.result)
                    .catch((err) => {
                    throw new Error(err.error);
                }),
        });
    }
    getEmailCreator() {
        return new Proxy({ __kind: 'getEmailCreator' }, {
            get: (_target, prop) => (...params) => prop === 'toJSON'
                ? {}
                : this.senderFn({
                    method: `accessor:getModifier:getCreator:getEmailCreator:${prop}`,
                    params
                })
                    .then((response) => response.result)
                    .catch((err) => {
                    throw new Error(err.error);
                }),
        });
    }
    getContactCreator() {
        return new Proxy({ __kind: 'getContactCreator' }, {
            get: (_target, prop) => (...params) => prop === 'toJSON'
                ? {}
                : this.senderFn({
                    method: `accessor:getModifier:getCreator:getContactCreator:${prop}`,
                    params
                })
                    .then((response) => response.result)
                    .catch((err) => {
                    throw new Error(err.error);
                }),
        });
    }
    getBlockBuilder() {
        return new BlockBuilder_ts_1.BlockBuilder();
    }
    startMessage(data) {
        if (data) {
            delete data.id;
        }
        return new MessageBuilder_ts_1.MessageBuilder(data);
    }
    startLivechatMessage(data) {
        if (data) {
            delete data.id;
        }
        return new LivechatMessageBuilder_ts_1.LivechatMessageBuilder(data);
    }
    startRoom(data) {
        if (data) {
            // @ts-ignore - this has been imported from the Apps-Engine
            delete data.id;
        }
        return new RoomBuilder_ts_1.RoomBuilder(data);
    }
    startDiscussion(data) {
        if (data) {
            delete data.id;
        }
        return new DiscussionBuilder_ts_1.DiscussionBuilder(data);
    }
    startVideoConference(data) {
        return new VideoConferenceBuilder_ts_1.VideoConferenceBuilder(data);
    }
    startBotUser(data) {
        if (data) {
            delete data.id;
            const { roles } = data;
            if (roles === null || roles === void 0 ? void 0 : roles.length) {
                const hasRole = roles
                    .map((role) => role.toLocaleLowerCase())
                    .some((role) => role === 'admin' || role === 'owner' || role === 'moderator');
                if (hasRole) {
                    throw new Error('Invalid role assigned to the user. Should not be admin, owner or moderator.');
                }
            }
            if (!data.type) {
                data.type = UserType.BOT;
            }
        }
        return new UserBuilder_ts_1.UserBuilder(data);
    }
    finish(builder) {
        switch (builder.kind) {
            case RocketChatAssociationModel.MESSAGE:
                return this._finishMessage(builder);
            case RocketChatAssociationModel.LIVECHAT_MESSAGE:
                return this._finishLivechatMessage(builder);
            case RocketChatAssociationModel.ROOM:
                return this._finishRoom(builder);
            case RocketChatAssociationModel.DISCUSSION:
                return this._finishDiscussion(builder);
            case RocketChatAssociationModel.VIDEO_CONFERENCE:
                return this._finishVideoConference(builder);
            case RocketChatAssociationModel.USER:
                return this._finishUser(builder);
            default:
                throw new Error('Invalid builder passed to the ModifyCreator.finish function.');
        }
    }
    _finishMessage(builder) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const result = builder.getMessage();
            delete result.id;
            if (!result.sender || !result.sender.id) {
                const response = yield this.senderFn({
                    method: 'bridges:getUserBridge:doGetAppUser',
                    params: ['APP_ID'],
                });
                const appUser = response.result;
                if (!appUser) {
                    throw new Error('Invalid sender assigned to the message.');
                }
                result.sender = appUser;
            }
            if ((_a = result.blocks) === null || _a === void 0 ? void 0 : _a.length) {
                // Can we move this elsewhere? This AppObjectRegistry usage doesn't really belong here, but where?
                result.blocks = UIHelper.assignIds(result.blocks, AppObjectRegistry_ts_1.AppObjectRegistry.get('id') || '');
            }
            const response = yield this.senderFn({
                method: 'bridges:getMessageBridge:doCreate',
                params: [result, AppObjectRegistry_ts_1.AppObjectRegistry.get('id')],
            });
            return String(response.result);
        });
    }
    _finishLivechatMessage(builder) {
        return __awaiter(this, void 0, void 0, function* () {
            if (builder.getSender() && !builder.getVisitor()) {
                return this._finishMessage(builder.getMessageBuilder());
            }
            const result = builder.getMessage();
            delete result.id;
            if (!result.token && (!result.visitor || !result.visitor.token)) {
                throw new Error('Invalid visitor sending the message');
            }
            result.token = result.visitor ? result.visitor.token : result.token;
            const response = yield this.senderFn({
                method: 'bridges:getLivechatBridge:doCreateMessage',
                params: [result, AppObjectRegistry_ts_1.AppObjectRegistry.get('id')],
            });
            return String(response.result);
        });
    }
    _finishRoom(builder) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = builder.getRoom();
            delete result.id;
            if (!result.type) {
                throw new Error('Invalid type assigned to the room.');
            }
            if (result.type !== RoomType.LIVE_CHAT) {
                if (!result.creator || !result.creator.id) {
                    throw new Error('Invalid creator assigned to the room.');
                }
            }
            if (result.type !== RoomType.DIRECT_MESSAGE) {
                if (result.type !== RoomType.LIVE_CHAT) {
                    if (!result.slugifiedName || !result.slugifiedName.trim()) {
                        throw new Error('Invalid slugifiedName assigned to the room.');
                    }
                }
                if (!result.displayName || !result.displayName.trim()) {
                    throw new Error('Invalid displayName assigned to the room.');
                }
            }
            const response = yield this.senderFn({
                method: 'bridges:getRoomBridge:doCreate',
                params: [result, builder.getMembersToBeAddedUsernames(), AppObjectRegistry_ts_1.AppObjectRegistry.get('id')],
            });
            return String(response.result);
        });
    }
    _finishDiscussion(builder) {
        return __awaiter(this, void 0, void 0, function* () {
            const room = builder.getRoom();
            delete room.id;
            if (!room.creator || !room.creator.id) {
                throw new Error('Invalid creator assigned to the discussion.');
            }
            if (!room.slugifiedName || !room.slugifiedName.trim()) {
                throw new Error('Invalid slugifiedName assigned to the discussion.');
            }
            if (!room.displayName || !room.displayName.trim()) {
                throw new Error('Invalid displayName assigned to the discussion.');
            }
            if (!room.parentRoom || !room.parentRoom.id) {
                throw new Error('Invalid parentRoom assigned to the discussion.');
            }
            const response = yield this.senderFn({
                method: 'bridges:getRoomBridge:doCreateDiscussion',
                params: [room, builder.getParentMessage(), builder.getReply(), builder.getMembersToBeAddedUsernames(), AppObjectRegistry_ts_1.AppObjectRegistry.get('id')],
            });
            return String(response.result);
        });
    }
    _finishVideoConference(builder) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const videoConference = builder.getVideoConference();
            if (!videoConference.createdBy) {
                throw new Error('Invalid creator assigned to the video conference.');
            }
            if (!((_a = videoConference.providerName) === null || _a === void 0 ? void 0 : _a.trim())) {
                throw new Error('Invalid provider name assigned to the video conference.');
            }
            if (!videoConference.rid) {
                throw new Error('Invalid roomId assigned to the video conference.');
            }
            const response = yield this.senderFn({
                method: 'bridges:getVideoConferenceBridge:doCreate',
                params: [videoConference, AppObjectRegistry_ts_1.AppObjectRegistry.get('id')],
            });
            return String(response.result);
        });
    }
    _finishUser(builder) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = builder.getUser();
            const response = yield this.senderFn({
                method: 'bridges:getUserBridge:doCreate',
                params: [user, AppObjectRegistry_ts_1.AppObjectRegistry.get('id')],
            });
            return String(response.result);
        });
    }
}
exports.ModifyCreator = ModifyCreator;
