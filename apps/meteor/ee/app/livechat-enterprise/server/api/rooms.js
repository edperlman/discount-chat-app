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
const core_services_1 = require("@rocket.chat/core-services");
const models_1 = require("@rocket.chat/models");
const rest_typings_1 = require("@rocket.chat/rest-typings");
const priorities_1 = require("./lib/priorities");
const server_1 = require("../../../../../app/api/server");
const hasPermission_1 = require("../../../../../app/authorization/server/functions/hasPermission");
const i18n_1 = require("../../../../../server/lib/i18n");
server_1.API.v1.addRoute('livechat/room.onHold', { authRequired: true, permissionsRequired: ['on-hold-livechat-room'], validateParams: rest_typings_1.isLivechatRoomOnHoldProps }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { roomId } = this.bodyParams;
            const room = yield models_1.LivechatRooms.findOneById(roomId, {
                projection: { _id: 1, t: 1, open: 1, onHold: 1, u: 1, lastMessage: 1, servedBy: 1 },
            });
            if (!room) {
                throw new Error('error-invalid-room');
            }
            const subscription = yield models_1.Subscriptions.findOneByRoomIdAndUserId(roomId, this.userId, { projection: { _id: 1 } });
            if (!subscription && !(yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'on-hold-others-livechat-room'))) {
                throw new Error('Not_authorized');
            }
            const onHoldBy = { _id: this.userId, username: this.user.username, name: this.user.name };
            const comment = i18n_1.i18n.t('Omnichannel_On_Hold_manually', {
                user: onHoldBy.name || `@${onHoldBy.username}`,
            });
            yield core_services_1.OmnichannelEEService.placeRoomOnHold(room, comment, this.user);
            return server_1.API.v1.success();
        });
    },
});
server_1.API.v1.addRoute('livechat/room.resumeOnHold', { authRequired: true, permissionsRequired: ['view-l-room'], validateParams: rest_typings_1.isLivechatRoomResumeOnHoldProps }, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { roomId } = this.bodyParams;
            if (!roomId || roomId.trim() === '') {
                throw new Error('invalid-param');
            }
            const room = yield models_1.LivechatRooms.findOneById(roomId, {
                projection: { t: 1, open: 1, onHold: 1, servedBy: 1 },
            });
            if (!room) {
                throw new Error('error-invalid-room');
            }
            const subscription = yield models_1.Subscriptions.findOneByRoomIdAndUserId(roomId, this.userId, { projection: { _id: 1 } });
            if (!subscription && !(yield (0, hasPermission_1.hasPermissionAsync)(this.userId, 'on-hold-others-livechat-room'))) {
                throw new Error('Not_authorized');
            }
            const { name, username, _id: userId } = this.user;
            const onHoldBy = { _id: userId, username, name };
            const comment = i18n_1.i18n.t('Omnichannel_on_hold_chat_resumed_manually', {
                user: onHoldBy.name || `@${onHoldBy.username}`,
            });
            yield core_services_1.OmnichannelEEService.resumeRoomOnHold(room, comment, this.user, true);
            return server_1.API.v1.success();
        });
    },
});
server_1.API.v1.addRoute('livechat/room/:rid/priority', {
    authRequired: true,
    validateParams: { POST: rest_typings_1.isPOSTLivechatRoomPriorityParams },
    permissionsRequired: {
        POST: { permissions: ['view-l-room'], operation: 'hasAny' },
        DELETE: { permissions: ['view-l-room'], operation: 'hasAny' },
    },
}, {
    post() {
        return __awaiter(this, void 0, void 0, function* () {
            const { rid } = this.urlParams;
            const { priorityId } = this.bodyParams;
            if (!this.user.username) {
                return server_1.API.v1.failure('Invalid user');
            }
            yield (0, priorities_1.updateRoomPriority)(rid, {
                _id: this.user._id,
                name: this.user.name || '',
                username: this.user.username,
            }, priorityId);
            return server_1.API.v1.success();
        });
    },
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            const { rid } = this.urlParams;
            if (!this.user.username) {
                return server_1.API.v1.failure('Invalid user');
            }
            yield (0, priorities_1.removePriorityFromRoom)(rid, {
                _id: this.user._id,
                name: this.user.name || '',
                username: this.user.username,
            });
            return server_1.API.v1.success();
        });
    },
});
