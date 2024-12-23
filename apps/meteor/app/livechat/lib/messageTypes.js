"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const string_helpers_1 = require("@rocket.chat/string-helpers");
const formatDistance_1 = __importDefault(require("date-fns/formatDistance"));
const moment_1 = __importDefault(require("moment"));
const MessageTypes_1 = require("../../ui-utils/lib/MessageTypes");
const i18n_1 = require("../../utils/lib/i18n");
MessageTypes_1.MessageTypes.registerType({
    id: 'livechat_navigation_history',
    system: true,
    message: 'New_visitor_navigation',
    data(message) {
        return {
            history: message.navigation
                ? `${(message.navigation.page.title ? `${message.navigation.page.title} - ` : '') + message.navigation.page.location.href}`
                : '',
        };
    },
});
MessageTypes_1.MessageTypes.registerType({
    id: 'livechat_transfer_history',
    system: true,
    message: 'New_chat_transfer',
    data(message) {
        if (!message.transferData) {
            return {
                transfer: '',
            };
        }
        const { comment } = message.transferData;
        const commentLabel = comment && comment !== '' ? '_with_a_comment' : '';
        const from = message.transferData.transferredBy && (message.transferData.transferredBy.name || message.transferData.transferredBy.username);
        const transferTypes = {
            agent: () => {
                var _a, _b, _c, _d;
                return (0, i18n_1.t)(`Livechat_transfer_to_agent${commentLabel}`, Object.assign({ from, to: ((_b = (_a = message === null || message === void 0 ? void 0 : message.transferData) === null || _a === void 0 ? void 0 : _a.transferredTo) === null || _b === void 0 ? void 0 : _b.name) || ((_d = (_c = message === null || message === void 0 ? void 0 : message.transferData) === null || _c === void 0 ? void 0 : _c.transferredTo) === null || _d === void 0 ? void 0 : _d.username) || '' }, (comment && { comment })));
            },
            department: () => {
                var _a, _b;
                return (0, i18n_1.t)(`Livechat_transfer_to_department${commentLabel}`, Object.assign({ from, to: ((_b = (_a = message === null || message === void 0 ? void 0 : message.transferData) === null || _a === void 0 ? void 0 : _a.nextDepartment) === null || _b === void 0 ? void 0 : _b.name) || '' }, (comment && { comment })));
            },
            queue: () => (0, i18n_1.t)(`Livechat_transfer_return_to_the_queue${commentLabel}`, Object.assign({ from }, (comment && { comment }))),
            autoTransferUnansweredChatsToAgent: () => {
                var _a, _b, _c, _d;
                return (0, i18n_1.t)(`Livechat_transfer_to_agent_auto_transfer_unanswered_chat`, {
                    from,
                    to: ((_b = (_a = message === null || message === void 0 ? void 0 : message.transferData) === null || _a === void 0 ? void 0 : _a.transferredTo) === null || _b === void 0 ? void 0 : _b.name) || ((_d = (_c = message === null || message === void 0 ? void 0 : message.transferData) === null || _c === void 0 ? void 0 : _c.transferredTo) === null || _d === void 0 ? void 0 : _d.username) || '',
                    duration: comment,
                });
            },
            autoTransferUnansweredChatsToQueue: () => (0, i18n_1.t)(`Livechat_transfer_return_to_the_queue_auto_transfer_unanswered_chat`, {
                from,
                duration: comment,
            }),
        };
        return {
            transfer: transferTypes[message.transferData.scope](),
        };
    },
});
MessageTypes_1.MessageTypes.registerType({
    id: 'livechat_transcript_history',
    system: true,
    message: 'Livechat_chat_transcript_sent',
    data(message) {
        if (!message.requestData) {
            return {
                transcript: '',
            };
        }
        const { requestData: { type, visitor, user } = { type: 'user' } } = message;
        const requestTypes = {
            visitor: () => (0, i18n_1.t)('Livechat_visitor_transcript_request', {
                guest: (visitor === null || visitor === void 0 ? void 0 : visitor.name) || (visitor === null || visitor === void 0 ? void 0 : visitor.username) || '',
            }),
            user: () => (0, i18n_1.t)('Livechat_user_sent_chat_transcript_to_visitor', {
                agent: (user === null || user === void 0 ? void 0 : user.name) || (user === null || user === void 0 ? void 0 : user.username) || '',
                guest: (visitor === null || visitor === void 0 ? void 0 : visitor.name) || (visitor === null || visitor === void 0 ? void 0 : visitor.username) || '',
            }),
        };
        return {
            transcript: requestTypes[type](),
        };
    },
});
MessageTypes_1.MessageTypes.registerType({
    id: 'livechat_video_call',
    system: true,
    message: 'New_videocall_request',
});
MessageTypes_1.MessageTypes.registerType({
    id: 'livechat_webrtc_video_call',
    message: 'room_changed_type',
    data(message) {
        if (message.msg === 'ended' && message.webRtcCallEndTs && message.ts) {
            return {
                message: (0, i18n_1.t)('WebRTC_call_ended_message', {
                    callDuration: (0, formatDistance_1.default)(new Date(message.webRtcCallEndTs), new Date(message.ts)),
                    endTime: (0, moment_1.default)(message.webRtcCallEndTs).format('h:mm A'),
                }),
            };
        }
        if (message.msg === 'declined' && message.webRtcCallEndTs) {
            return {
                message: (0, i18n_1.t)('WebRTC_call_declined_message'),
            };
        }
        return {
            message: (0, string_helpers_1.escapeHTML)(message.msg),
        };
    },
});
MessageTypes_1.MessageTypes.registerType({
    id: 'omnichannel_placed_chat_on_hold',
    system: true,
    message: 'Omnichannel_placed_chat_on_hold',
    data(message) {
        return {
            comment: message.comment ? message.comment : 'No comment provided',
        };
    },
});
MessageTypes_1.MessageTypes.registerType({
    id: 'omnichannel_on_hold_chat_resumed',
    system: true,
    message: 'Omnichannel_on_hold_chat_resumed',
    data(message) {
        return {
            comment: message.comment ? message.comment : 'No comment provided',
        };
    },
});
