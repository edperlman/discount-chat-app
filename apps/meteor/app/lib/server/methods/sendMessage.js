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
exports.executeSendMessage = executeSendMessage;
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const moment_1 = __importDefault(require("moment"));
const i18n_1 = require("../../../../server/lib/i18n");
const system_1 = require("../../../../server/lib/logger/system");
const canSendMessage_1 = require("../../../authorization/server/functions/canSendMessage");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const airGappedRestrictionsWrapper_1 = require("../../../license/server/airGappedRestrictionsWrapper");
const server_1 = require("../../../metrics/server");
const server_2 = require("../../../settings/server");
const server_3 = require("../../../ui-utils/server");
const sendMessage_1 = require("../functions/sendMessage");
const lib_1 = require("../lib");
function executeSendMessage(uid, message, previewUrls) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        if (message.tshow && !message.tmid) {
            throw new meteor_1.Meteor.Error('invalid-params', 'tshow provided but missing tmid', {
                method: 'sendMessage',
            });
        }
        if (message.tmid && !server_2.settings.get('Threads_enabled')) {
            throw new meteor_1.Meteor.Error('error-not-allowed', 'not-allowed', {
                method: 'sendMessage',
            });
        }
        if (message.ts) {
            const tsDiff = Math.abs((0, moment_1.default)(message.ts).diff(Date.now()));
            if (tsDiff > 60000) {
                throw new meteor_1.Meteor.Error('error-message-ts-out-of-sync', 'Message timestamp is out of sync', {
                    method: 'sendMessage',
                    message_ts: message.ts,
                    server_ts: new Date().getTime(),
                });
            }
            else if (tsDiff > 10000) {
                message.ts = new Date();
            }
        }
        else {
            message.ts = new Date();
        }
        if (message.msg) {
            if (message.msg.length > ((_a = server_2.settings.get('Message_MaxAllowedSize')) !== null && _a !== void 0 ? _a : 0)) {
                throw new meteor_1.Meteor.Error('error-message-size-exceeded', 'Message size exceeds Message_MaxAllowedSize', {
                    method: 'sendMessage',
                });
            }
        }
        const user = yield models_1.Users.findOneById(uid, {
            projection: {
                username: 1,
                type: 1,
                name: 1,
            },
        });
        if (!(user === null || user === void 0 ? void 0 : user.username)) {
            throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user');
        }
        let { rid } = message;
        // do not allow nested threads
        if (message.tmid) {
            const parentMessage = yield models_1.Messages.findOneById(message.tmid, { projection: { rid: 1, tmid: 1 } });
            message.tmid = (parentMessage === null || parentMessage === void 0 ? void 0 : parentMessage.tmid) || message.tmid;
            if (parentMessage === null || parentMessage === void 0 ? void 0 : parentMessage.rid) {
                rid = parentMessage === null || parentMessage === void 0 ? void 0 : parentMessage.rid;
            }
        }
        if (!rid) {
            throw new Error("The 'rid' property on the message object is missing.");
        }
        (0, check_1.check)(rid, String);
        try {
            const room = yield (0, canSendMessage_1.canSendMessageAsync)(rid, { uid, username: user.username, type: user.type });
            if (room.encrypted && server_2.settings.get('E2E_Enable') && !server_2.settings.get('E2E_Allow_Unencrypted_Messages')) {
                if (message.t !== 'e2e') {
                    throw new meteor_1.Meteor.Error('error-not-allowed', 'Not allowed to send un-encrypted messages in an encrypted room', {
                        method: 'sendMessage',
                    });
                }
            }
            server_1.metrics.messagesSent.inc(); // TODO This line needs to be moved to it's proper place. See the comments on: https://github.com/RocketChat/Rocket.Chat/pull/5736
            return yield (0, sendMessage_1.sendMessage)(user, message, room, false, previewUrls);
        }
        catch (err) {
            system_1.SystemLogger.error({ msg: 'Error sending message:', err });
            const errorMessage = typeof err === 'string' ? err : err.error || err.message;
            const errorContext = (_b = err.details) !== null && _b !== void 0 ? _b : {};
            void core_services_1.api.broadcast('notify.ephemeralMessage', uid, message.rid, {
                msg: i18n_1.i18n.t(errorMessage, Object.assign(Object.assign({}, errorContext), { lng: user.language })),
            });
            if (typeof err === 'string') {
                throw new Error(err);
            }
            throw err;
        }
    });
}
meteor_1.Meteor.methods({
    sendMessage(message, previewUrls) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(message, {
                _id: check_1.Match.Maybe(String),
                rid: check_1.Match.Maybe(String),
                msg: check_1.Match.Maybe(String),
                tmid: check_1.Match.Maybe(String),
                tshow: check_1.Match.Maybe(Boolean),
                ts: check_1.Match.Maybe(Date),
                t: check_1.Match.Maybe(String),
                otrAck: check_1.Match.Maybe(String),
                bot: check_1.Match.Maybe(Boolean),
                content: check_1.Match.Maybe(Object),
                e2e: check_1.Match.Maybe(String),
                e2eMentions: check_1.Match.Maybe(Object),
                customFields: check_1.Match.Maybe(Object),
                federation: check_1.Match.Maybe(Object),
                groupable: check_1.Match.Maybe(Boolean),
                sentByEmail: check_1.Match.Maybe(Boolean),
            });
            const uid = meteor_1.Meteor.userId();
            if (!uid) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'sendMessage',
                });
            }
            if (server_3.MessageTypes.isSystemMessage(message)) {
                throw new Error("Cannot send system messages using 'sendMessage'");
            }
            try {
                return yield (0, airGappedRestrictionsWrapper_1.applyAirGappedRestrictionsValidation)(() => executeSendMessage(uid, message, previewUrls));
            }
            catch (error) {
                if (['error-not-allowed', 'restricted-workspace'].includes(error.error || error.message)) {
                    throw new meteor_1.Meteor.Error(error.error || error.message, error.reason, {
                        method: 'sendMessage',
                    });
                }
            }
        });
    },
});
// Limit a user, who does not have the "bot" role, to sending 5 msgs/second
lib_1.RateLimiter.limitMethod('sendMessage', 5, 1000, {
    userId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return !(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'send-many-messages'));
        });
    },
});
