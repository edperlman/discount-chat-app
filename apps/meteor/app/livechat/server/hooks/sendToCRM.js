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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdditionalFieldsByType = exports.sendMessageType = exports.isOmnichannelClosingMessage = exports.isOmnichannelNavigationMessage = void 0;
const core_typings_1 = require("@rocket.chat/core-typings");
const models_1 = require("@rocket.chat/models");
const callbacks_1 = require("../../../../lib/callbacks");
const server_1 = require("../../../settings/server");
const normalizeMessageFileUpload_1 = require("../../../utils/server/functions/normalizeMessageFileUpload");
const LivechatTyped_1 = require("../lib/LivechatTyped");
const msgNavType = 'livechat_navigation_history';
const msgClosingType = 'livechat-close';
const isOmnichannelNavigationMessage = (message) => {
    return message.t === msgNavType;
};
exports.isOmnichannelNavigationMessage = isOmnichannelNavigationMessage;
const isOmnichannelClosingMessage = (message) => {
    return message.t === msgClosingType;
};
exports.isOmnichannelClosingMessage = isOmnichannelClosingMessage;
const sendMessageType = (msgType) => {
    switch (msgType) {
        case msgClosingType:
            return true;
        case msgNavType:
            return (server_1.settings.get('Livechat_Visitor_navigation_as_a_message') &&
                server_1.settings.get('Send_visitor_navigation_history_livechat_webhook_request'));
        default:
            return false;
    }
};
exports.sendMessageType = sendMessageType;
const getAdditionalFieldsByType = (type, room) => {
    const { departmentId, servedBy, closedAt, closedBy, closer, oldServedBy, oldDepartmentId } = room;
    switch (type) {
        case 'LivechatSessionStart':
        case 'LivechatSessionQueued':
            return { departmentId };
        case 'LivechatSession':
            return { departmentId, servedBy, closedAt, closedBy, closer };
        case 'LivechatSessionTaken':
            return { departmentId, servedBy };
        case 'LivechatSessionForwarded':
            return { departmentId, servedBy, oldDepartmentId, oldServedBy };
        default:
            return {};
    }
};
exports.getAdditionalFieldsByType = getAdditionalFieldsByType;
function sendToCRM(type_1, room_1) {
    return __awaiter(this, arguments, void 0, function* (type, room, includeMessages = true) {
        var _a, e_1, _b, _c;
        if (!server_1.settings.get('Livechat_webhookUrl')) {
            return room;
        }
        const postData = Object.assign(Object.assign({}, (yield LivechatTyped_1.Livechat.getLivechatRoomGuestInfo(room))), { type, messages: [] });
        let messages = null;
        if (typeof includeMessages === 'boolean' && includeMessages) {
            messages = yield models_1.Messages.findVisibleByRoomId(room._id, { sort: { ts: 1 } }).toArray();
        }
        else if (includeMessages instanceof Array) {
            messages = includeMessages;
        }
        if (messages) {
            try {
                for (var _d = true, messages_1 = __asyncValues(messages), messages_1_1; messages_1_1 = yield messages_1.next(), _a = messages_1_1.done, !_a; _d = true) {
                    _c = messages_1_1.value;
                    _d = false;
                    const message = _c;
                    if (message.t && !(0, exports.sendMessageType)(message.t)) {
                        continue;
                    }
                    const msg = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ _id: message._id, username: message.u.username, msg: message.msg || JSON.stringify(message.blocks) }, (message.blocks && message.blocks.length > 0 ? { blocks: message.blocks } : {})), { ts: message.ts, rid: message.rid }), ((0, core_typings_1.isEditedMessage)(message) && { editedAt: message.editedAt })), (message.u.username !== postData.visitor.username && { agentId: message.u._id })), ((0, exports.isOmnichannelNavigationMessage)(message) && { navigation: message.navigation })), ((0, exports.isOmnichannelClosingMessage)(message) && { closingMessage: true })), (message.file && { file: message.file, attachments: message.attachments }));
                    const { u } = message;
                    postData.messages.push(Object.assign(Object.assign({}, (yield (0, normalizeMessageFileUpload_1.normalizeMessageFileUpload)(Object.assign({ u }, msg)))), { _updatedAt: message._updatedAt }));
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = messages_1.return)) yield _b.call(messages_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        const additionalData = (0, exports.getAdditionalFieldsByType)(type, room);
        const responseData = Object.assign(postData, additionalData);
        const response = yield LivechatTyped_1.Livechat.sendRequest(responseData);
        if (response) {
            const responseData = yield response.text();
            yield models_1.LivechatRooms.saveCRMDataByRoomId(room._id, responseData);
        }
        return room;
    });
}
callbacks_1.callbacks.add('livechat.closeRoom', (params) => __awaiter(void 0, void 0, void 0, function* () {
    const { room } = params;
    if (!server_1.settings.get('Livechat_webhook_on_close')) {
        return params;
    }
    yield sendToCRM('LivechatSession', room);
    return params;
}), callbacks_1.callbacks.priority.MEDIUM, 'livechat-send-crm-close-room');
callbacks_1.callbacks.add('livechat.newRoom', (room) => __awaiter(void 0, void 0, void 0, function* () {
    if (!server_1.settings.get('Livechat_webhook_on_start')) {
        return room;
    }
    return sendToCRM('LivechatSessionStart', room);
}), callbacks_1.callbacks.priority.MEDIUM, 'livechat-send-crm-start-room');
callbacks_1.callbacks.add('livechat.afterTakeInquiry', (_a) => __awaiter(void 0, [_a], void 0, function* ({ inquiry, room }) {
    if (!server_1.settings.get('Livechat_webhook_on_chat_taken')) {
        return inquiry;
    }
    return sendToCRM('LivechatSessionTaken', room);
}), callbacks_1.callbacks.priority.MEDIUM, 'livechat-send-crm-room-taken');
callbacks_1.callbacks.add('livechat.chatQueued', (room) => {
    if (!server_1.settings.get('Livechat_webhook_on_chat_queued')) {
        return room;
    }
    return sendToCRM('LivechatSessionQueued', room);
}, callbacks_1.callbacks.priority.MEDIUM, 'livechat-send-crm-room-queued');
callbacks_1.callbacks.add('livechat.afterForwardChatToAgent', (params) => __awaiter(void 0, void 0, void 0, function* () {
    const { rid, oldServedBy } = params;
    if (!server_1.settings.get('Livechat_webhook_on_forward')) {
        return params;
    }
    const originalRoom = yield models_1.LivechatRooms.findOneById(rid);
    if (!originalRoom) {
        return params;
    }
    const room = Object.assign(originalRoom, { oldServedBy });
    yield sendToCRM('LivechatSessionForwarded', room);
    return params;
}), callbacks_1.callbacks.priority.MEDIUM, 'livechat-send-crm-room-forwarded-to-agent');
callbacks_1.callbacks.add('livechat.afterForwardChatToDepartment', (params) => __awaiter(void 0, void 0, void 0, function* () {
    const { rid, oldDepartmentId } = params;
    if (!server_1.settings.get('Livechat_webhook_on_forward')) {
        return params;
    }
    const originalRoom = yield models_1.LivechatRooms.findOneById(rid);
    if (!originalRoom) {
        return params;
    }
    const room = Object.assign(originalRoom, { oldDepartmentId });
    yield sendToCRM('LivechatSessionForwarded', room);
    return params;
}), callbacks_1.callbacks.priority.MEDIUM, 'livechat-send-crm-room-forwarded-to-department');
callbacks_1.callbacks.add('livechat.saveInfo', (room) => __awaiter(void 0, void 0, void 0, function* () {
    // Do not send to CRM if the chat is still open
    if (!(0, core_typings_1.isOmnichannelRoom)(room) || room.open) {
        return room;
    }
    return sendToCRM('LivechatEdit', room);
}), callbacks_1.callbacks.priority.MEDIUM, 'livechat-send-crm-save-info');
callbacks_1.callbacks.add('afterOmnichannelSaveMessage', (message_1, _a) => __awaiter(void 0, [message_1, _a], void 0, function* (message, { room }) {
    // if the message has a token, it was sent from the visitor
    // if not, it was sent from the agent
    if (message.token && !server_1.settings.get('Livechat_webhook_on_visitor_message')) {
        return message;
    }
    if (!message.token && !server_1.settings.get('Livechat_webhook_on_agent_message')) {
        return message;
    }
    // if the message has a type means it is a special message (like the closing comment), so skips
    // unless the settings that handle with visitor navigation history are enabled
    if (message.t && !(0, exports.sendMessageType)(message.t)) {
        return message;
    }
    yield sendToCRM('Message', room, [message]);
    return message;
}), callbacks_1.callbacks.priority.MEDIUM, 'livechat-send-crm-message');
callbacks_1.callbacks.add('livechat.leadCapture', (room) => {
    if (!server_1.settings.get('Livechat_webhook_on_capture')) {
        return room;
    }
    return sendToCRM('LeadCapture', room, false);
}, callbacks_1.callbacks.priority.MEDIUM, 'livechat-send-crm-lead-capture');
