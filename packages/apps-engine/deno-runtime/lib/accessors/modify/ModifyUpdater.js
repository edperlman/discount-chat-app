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
exports.ModifyUpdater = void 0;
const MessageBuilder_ts_1 = require("../builders/MessageBuilder.ts");
const RoomBuilder_ts_1 = require("../builders/RoomBuilder.ts");
const AppObjectRegistry_ts_1 = require("../../../AppObjectRegistry.ts");
const require_ts_1 = require("../../../lib/require.ts");
const { UIHelper } = (0, require_ts_1.require)('@rocket.chat/apps-engine/server/misc/UIHelper.js');
const { RoomType } = (0, require_ts_1.require)('@rocket.chat/apps-engine/definition/rooms/RoomType.js');
const { RocketChatAssociationModel } = (0, require_ts_1.require)('@rocket.chat/apps-engine/definition/metadata/RocketChatAssociations.js');
class ModifyUpdater {
    constructor(senderFn) {
        this.senderFn = senderFn;
    }
    getLivechatUpdater() {
        return new Proxy({ __kind: 'getLivechatUpdater' }, {
            get: (_target, prop) => (...params) => prop === 'toJSON'
                ? {}
                : this.senderFn({
                    method: `accessor:getModifier:getUpdater:getLivechatUpdater:${prop}`,
                    params,
                })
                    .then((response) => response.result)
                    .catch((err) => {
                    throw new Error(err.error);
                }),
        });
    }
    getUserUpdater() {
        return new Proxy({ __kind: 'getUserUpdater' }, {
            get: (_target, prop) => (...params) => prop === 'toJSON'
                ? {}
                : this.senderFn({
                    method: `accessor:getModifier:getUpdater:getUserUpdater:${prop}`,
                    params,
                })
                    .then((response) => response.result)
                    .catch((err) => {
                    throw new Error(err.error);
                }),
        });
    }
    message(messageId, _updater) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.senderFn({
                method: 'bridges:getMessageBridge:doGetById',
                params: [messageId, AppObjectRegistry_ts_1.AppObjectRegistry.get('id')],
            });
            return new MessageBuilder_ts_1.MessageBuilder(response.result);
        });
    }
    room(roomId, _updater) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.senderFn({
                method: 'bridges:getRoomBridge:doGetById',
                params: [roomId, AppObjectRegistry_ts_1.AppObjectRegistry.get('id')],
            });
            return new RoomBuilder_ts_1.RoomBuilder(response.result);
        });
    }
    finish(builder) {
        switch (builder.kind) {
            case RocketChatAssociationModel.MESSAGE:
                return this._finishMessage(builder);
            case RocketChatAssociationModel.ROOM:
                return this._finishRoom(builder);
            default:
                throw new Error('Invalid builder passed to the ModifyUpdater.finish function.');
        }
    }
    _finishMessage(builder) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const result = builder.getMessage();
            if (!result.id) {
                throw new Error("Invalid message, can't update a message without an id.");
            }
            if (!((_a = result.sender) === null || _a === void 0 ? void 0 : _a.id)) {
                throw new Error('Invalid sender assigned to the message.');
            }
            if ((_b = result.blocks) === null || _b === void 0 ? void 0 : _b.length) {
                result.blocks = UIHelper.assignIds(result.blocks, AppObjectRegistry_ts_1.AppObjectRegistry.get('id') || '');
            }
            yield this.senderFn({
                method: 'bridges:getMessageBridge:doUpdate',
                params: [result, AppObjectRegistry_ts_1.AppObjectRegistry.get('id')],
            });
        });
    }
    _finishRoom(builder) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = builder.getRoom();
            if (!result.id) {
                throw new Error("Invalid room, can't update a room without an id.");
            }
            if (!result.type) {
                throw new Error('Invalid type assigned to the room.');
            }
            if (result.type !== RoomType.LIVE_CHAT) {
                if (!result.creator || !result.creator.id) {
                    throw new Error('Invalid creator assigned to the room.');
                }
                if (!result.slugifiedName || !result.slugifiedName.trim()) {
                    throw new Error('Invalid slugifiedName assigned to the room.');
                }
            }
            if (!result.displayName || !result.displayName.trim()) {
                throw new Error('Invalid displayName assigned to the room.');
            }
            yield this.senderFn({
                method: 'bridges:getRoomBridge:doUpdate',
                params: [result, builder.getMembersToBeAddedUsernames(), AppObjectRegistry_ts_1.AppObjectRegistry.get('id')],
            });
        });
    }
}
exports.ModifyUpdater = ModifyUpdater;
