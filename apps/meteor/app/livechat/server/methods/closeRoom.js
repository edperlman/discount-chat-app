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
const models_1 = require("@rocket.chat/models");
const meteor_1 = require("meteor/meteor");
const hasPermission_1 = require("../../../authorization/server/functions/hasPermission");
const deprecationWarningLogger_1 = require("../../../lib/server/lib/deprecationWarningLogger");
const LivechatTyped_1 = require("../lib/LivechatTyped");
meteor_1.Meteor.methods({
    'livechat:closeRoom'(roomId, comment, options) {
        return __awaiter(this, void 0, void 0, function* () {
            deprecationWarningLogger_1.methodDeprecationLogger.method('livechat:closeRoom', '7.0.0');
            const userId = meteor_1.Meteor.userId();
            if (!userId || !(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'close-livechat-room'))) {
                throw new meteor_1.Meteor.Error('error-not-authorized', 'Not authorized', {
                    method: 'livechat:closeRoom',
                });
            }
            const room = yield models_1.LivechatRooms.findOneById(roomId);
            if (!room || room.t !== 'l') {
                throw new meteor_1.Meteor.Error('error-invalid-room', 'Invalid room', {
                    method: 'livechat:closeRoom',
                });
            }
            const subscription = yield models_1.Subscriptions.findOneByRoomIdAndUserId(roomId, userId, {
                projection: {
                    _id: 1,
                },
            });
            if (!room.open && subscription) {
                yield models_1.Subscriptions.removeByRoomId(roomId);
                return;
            }
            if (!room.open) {
                throw new meteor_1.Meteor.Error('room-closed', 'Room closed', { method: 'livechat:closeRoom' });
            }
            const user = yield models_1.Users.findOneById(userId);
            if (!user) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'livechat:closeRoom',
                });
            }
            if (!subscription && !(yield (0, hasPermission_1.hasPermissionAsync)(userId, 'close-others-livechat-room'))) {
                throw new meteor_1.Meteor.Error('error-not-authorized', 'Not authorized', {
                    method: 'livechat:closeRoom',
                });
            }
            yield LivechatTyped_1.Livechat.closeRoom({
                user,
                room,
                comment,
                options: resolveOptions(user, options),
            });
        });
    },
});
const resolveOptions = (user, options) => {
    if (!options) {
        return undefined;
    }
    const resolvedOptions = {
        clientAction: options.clientAction,
        tags: options.tags,
    };
    if (options.generateTranscriptPdf) {
        resolvedOptions.pdfTranscript = {
            requestedBy: user._id,
        };
    }
    if (!(options === null || options === void 0 ? void 0 : options.emailTranscript)) {
        return resolvedOptions;
    }
    if ((options === null || options === void 0 ? void 0 : options.emailTranscript.sendToVisitor) === false) {
        return Object.assign(Object.assign({}, resolvedOptions), { emailTranscript: {
                sendToVisitor: false,
            } });
    }
    return Object.assign(Object.assign({}, resolvedOptions), { emailTranscript: {
            sendToVisitor: true,
            requestData: Object.assign(Object.assign({}, options.emailTranscript.requestData), { requestedBy: user, requestedAt: new Date() }),
        } });
};
