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
exports.AppMessageBridge = void 0;
const MessageBridge_1 = require("@rocket.chat/apps-engine/server/bridges/MessageBridge");
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const deleteMessage_1 = require("../../../lib/server/functions/deleteMessage");
const updateMessage_1 = require("../../../lib/server/functions/updateMessage");
const sendMessage_1 = require("../../../lib/server/methods/sendMessage");
const Notifications_1 = __importDefault(require("../../../notifications/server/lib/Notifications"));
const setReaction_1 = require("../../../reactions/server/setReaction");
class AppMessageBridge extends MessageBridge_1.MessageBridge {
    constructor(orch) {
        super();
        this.orch = orch;
    }
    create(message, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            this.orch.debugLog(`The App ${appId} is creating a new message.`);
            const convertedMessage = yield ((_a = this.orch.getConverters()) === null || _a === void 0 ? void 0 : _a.get('messages').convertAppMessage(message));
            // #TODO: #AppsEngineTypes - Remove explicit types and typecasts once the apps-engine definition/implementation mismatch is fixed.
            const definedMessage = convertedMessage;
            const sentMessage = yield (0, sendMessage_1.executeSendMessage)(definedMessage.u._id, definedMessage);
            return sentMessage._id;
        });
    }
    getById(messageId, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            this.orch.debugLog(`The App ${appId} is getting the message: "${messageId}"`);
            // #TODO: #AppsEngineTypes - Remove explicit types and typecasts once the apps-engine definition/implementation mismatch is fixed.
            const message = yield ((_a = this.orch.getConverters()) === null || _a === void 0 ? void 0 : _a.get('messages').convertById(messageId));
            return message;
        });
    }
    update(message, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            this.orch.debugLog(`The App ${appId} is updating a message.`);
            if (!message.editor) {
                throw new Error('Invalid editor assigned to the message for the update.');
            }
            if (!message.id || !(yield models_1.Messages.findOneById(message.id))) {
                throw new Error('A message must exist to update.');
            }
            // #TODO: #AppsEngineTypes - Remove explicit types and typecasts once the apps-engine definition/implementation mismatch is fixed.
            const msg = yield ((_a = this.orch.getConverters()) === null || _a === void 0 ? void 0 : _a.get('messages').convertAppMessage(message));
            const editor = yield models_1.Users.findOneById(message.editor.id);
            if (!editor) {
                throw new Error('Invalid editor assigned to the message for the update.');
            }
            yield (0, updateMessage_1.updateMessage)(msg, editor);
        });
    }
    delete(message, user, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            this.orch.debugLog(`The App ${appId} is deleting a message.`);
            if (!message.id) {
                throw new Error('Invalid message id');
            }
            const convertedMsg = yield ((_a = this.orch.getConverters()) === null || _a === void 0 ? void 0 : _a.get('messages').convertAppMessage(message));
            const convertedUser = (yield models_1.Users.findOneById(user.id)) || ((_b = this.orch.getConverters()) === null || _b === void 0 ? void 0 : _b.get('users').convertToRocketChat(user));
            yield (0, deleteMessage_1.deleteMessage)(convertedMsg, convertedUser);
        });
    }
    notifyUser(user, message, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            this.orch.debugLog(`The App ${appId} is notifying a user.`);
            const msg = yield ((_a = this.orch.getConverters()) === null || _a === void 0 ? void 0 : _a.get('messages').convertAppMessage(message));
            if (!msg) {
                return;
            }
            void core_services_1.api.broadcast('notify.ephemeralMessage', user.id, msg.rid, Object.assign({}, msg));
        });
    }
    notifyRoom(room, message, appId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            this.orch.debugLog(`The App ${appId} is notifying a room's users.`);
            if (!(room === null || room === void 0 ? void 0 : room.id)) {
                return;
            }
            // #TODO: #AppsEngineTypes - Remove explicit types and typecasts once the apps-engine definition/implementation mismatch is fixed.
            const msg = yield ((_a = this.orch.getConverters()) === null || _a === void 0 ? void 0 : _a.get('messages').convertAppMessage(message));
            const convertedMessage = msg;
            const users = (yield models_1.Subscriptions.findByRoomIdWhenUserIdExists(room.id, { projection: { 'u._id': 1 } }).toArray()).map((s) => s.u._id);
            yield models_1.Users.findByIds(users, { projection: { _id: 1 } }).forEach(({ _id }) => void core_services_1.api.broadcast('notify.ephemeralMessage', _id, room.id, Object.assign({}, convertedMessage)));
        });
    }
    typing(_a) {
        return __awaiter(this, arguments, void 0, function* ({ scope, id, username, isTyping }) {
            switch (scope) {
                case 'room':
                    if (!username) {
                        throw new Error('Invalid username');
                    }
                    Notifications_1.default.notifyRoom(id, 'user-activity', username, isTyping ? ['user-typing'] : []);
                    return;
                default:
                    throw new Error('Unrecognized typing scope provided');
            }
        });
    }
    isValidReaction(reaction) {
        return reaction.startsWith(':') && reaction.endsWith(':');
    }
    addReaction(messageId, userId, reaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isValidReaction(reaction)) {
                throw new Error('Invalid reaction');
            }
            return (0, setReaction_1.executeSetReaction)(userId, reaction, messageId, true);
        });
    }
    removeReaction(messageId, userId, reaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isValidReaction(reaction)) {
                throw new Error('Invalid reaction');
            }
            return (0, setReaction_1.executeSetReaction)(userId, reaction, messageId, false);
        });
    }
}
exports.AppMessageBridge = AppMessageBridge;
