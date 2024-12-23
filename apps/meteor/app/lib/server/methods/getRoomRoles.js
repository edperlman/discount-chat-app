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
const getRoomRoles_1 = require("../../../../server/lib/roles/getRoomRoles");
const server_1 = require("../../../authorization/server");
const server_2 = require("../../../settings/server");
meteor_1.Meteor.methods({
    getRoomRoles(rid) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, check_1.check)(rid, String);
            const fromUserId = meteor_1.Meteor.userId();
            if (!fromUserId && server_2.settings.get('Accounts_AllowAnonymousRead') === false) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'getRoomRoles' });
            }
            const room = yield models_1.Rooms.findOneById(rid);
            if (!room) {
                throw new meteor_1.Meteor.Error('error-invalid-room', 'Invalid room', { method: 'getRoomRoles' });
            }
            if (fromUserId && !(yield (0, server_1.canAccessRoomAsync)(room, { _id: fromUserId }))) {
                throw new meteor_1.Meteor.Error('error-invalid-user', 'Invalid user', { method: 'getRoomRoles' });
            }
            return (0, getRoomRoles_1.getRoomRoles)(rid);
        });
    },
});
