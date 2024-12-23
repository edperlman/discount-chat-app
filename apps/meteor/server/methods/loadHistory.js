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
const check_1 = require("meteor/check");
const meteor_1 = require("meteor/meteor");
const server_1 = require("../../app/authorization/server");
const hasPermission_1 = require("../../app/authorization/server/functions/hasPermission");
const loadMessageHistory_1 = require("../../app/lib/server/functions/loadMessageHistory");
const server_2 = require("../../app/settings/server");
meteor_1.Meteor.methods({
    loadHistory(rid_1, end_1) {
        return __awaiter(this, arguments, void 0, function* (rid, end, limit = 20, ls, showThreadMessages = true) {
            (0, check_1.check)(rid, String);
            if (!meteor_1.Meteor.userId() && server_2.settings.get('Accounts_AllowAnonymousRead') === false) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', {
                    method: 'loadHistory',
                });
            }
            const fromId = meteor_1.Meteor.userId();
            const room = yield models_1.Rooms.findOneById(rid, { projection: Object.assign(Object.assign({}, server_1.roomAccessAttributes), { t: 1 }) });
            if (!room) {
                return false;
            }
            // this checks the Allow Anonymous Read setting, so no need to check again
            if (!(yield (0, server_1.canAccessRoomAsync)(room, fromId ? { _id: fromId } : undefined))) {
                return false;
            }
            // if fromId is undefined and it passed the previous check, the user is reading anonymously
            if (!fromId) {
                return (0, loadMessageHistory_1.loadMessageHistory)({ rid, end, limit, ls, showThreadMessages });
            }
            const canPreview = yield (0, hasPermission_1.hasPermissionAsync)(fromId, 'preview-c-room');
            if (room.t === 'c' && !canPreview && !(yield models_1.Subscriptions.findOneByRoomIdAndUserId(rid, fromId, { projection: { _id: 1 } }))) {
                return false;
            }
            return (0, loadMessageHistory_1.loadMessageHistory)({ userId: fromId, rid, end, limit, ls, showThreadMessages });
        });
    },
});
